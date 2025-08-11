from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
import os
from supabase import create_client, Client
import uvicorn
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
import csv
import io
import json
import uuid
from urllib.parse import urlparse

app = FastAPI(title="CMS Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase_url = os.environ.get("SUPABASE_URL", "")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE", "")
supabase: Client = create_client(supabase_url, supabase_key)

# Data models
class SubmissionCreate(BaseModel):
    founder_name: str
    founder_email: EmailStr
    company_name: str
    company_website: Optional[str] = None
    proposed_title: str
    proposed_summary: str
    proposed_category: str = "general"
    proposed_tags: List[str] = []

class StoryCreate(BaseModel):
    title: str
    summary: str
    content: Optional[str] = None
    category: str = "general"
    tags: List[str] = []
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    company_slugs: List[str] = []
    published_date: Optional[datetime] = None
    status: str = "published"

class StoryUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    company_slugs: Optional[List[str]] = None
    status: Optional[str] = None

class StoryApproval(BaseModel):
    title: str
    summary: str
    category: str
    tags: List[str] = []
    company_slugs: List[str] = []
    source_url: Optional[str] = None
    image_url: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "CMS Service is running!", "version": "1.0.0"}

# Submissions Management
@app.post("/submissions")
def create_submission(submission: SubmissionCreate):
    """Create a new story submission"""
    try:
        result = supabase.table("submissions").insert({
            "founder_name": submission.founder_name,
            "founder_email": submission.founder_email,
            "company_name": submission.company_name,
            "company_website": submission.company_website,
            "proposed_title": submission.proposed_title,
            "proposed_summary": submission.proposed_summary,
            "proposed_category": submission.proposed_category,
            "proposed_tags": submission.proposed_tags,
            "status": "pending"
        }).execute()
        
        return {"message": "Submission created successfully", "data": result.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/submissions")
def get_submissions(
    status: str = Query("pending", regex="^(pending|approved|rejected|all)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get submissions by status"""
    try:
        query = supabase.table("submissions").select("*")
        
        if status != "all":
            query = query.eq("status", status)
            
        query = query.order("submitted_at", desc=True)
        
        # Pagination
        start = (page - 1) * limit
        end = start + limit - 1
        
        result = query.range(start, end).execute()
        
        return {
            "submissions": result.data,
            "page": page,
            "limit": limit,
            "status": status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submissions/{submission_id}/approve")
async def approve_submission(submission_id: str, approval: StoryApproval):
    """Approve a submission and create a story"""
    try:
        # Get submission
        submission_result = supabase.table("submissions").select("*").eq("id", submission_id).execute()
        
        if not submission_result.data:
            raise HTTPException(status_code=404, detail="Submission not found")
            
        submission = submission_result.data[0]
        
        # Create story
        story_data = {
            "title": approval.title,
            "summary": approval.summary,
            "category": approval.category,
            "tags": approval.tags,
            "source_url": approval.source_url,
            "image_url": approval.image_url,
            "status": "published",
            "created_by": "admin",
            "published_date": datetime.now().isoformat()
        }
        
        story_result = supabase.table("stories").insert(story_data).execute()
        story_id = story_result.data[0]["id"]
        
        # Handle company associations
        if approval.company_slugs:
            await link_story_to_companies(story_id, approval.company_slugs, submission["company_name"])
        elif submission["company_name"]:
            await link_story_to_companies(story_id, [], submission["company_name"])
        
        # Update submission status
        supabase.table("submissions").update({
            "status": "approved",
            "reviewed_by": "admin",
            "reviewed_at": datetime.now().isoformat()
        }).eq("id", submission_id).execute()
        
        return {"message": "Submission approved", "story_id": story_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submissions/{submission_id}/reject")
def reject_submission(submission_id: str, reason: str = "Does not meet guidelines"):
    """Reject a submission"""
    try:
        result = supabase.table("submissions").update({
            "status": "rejected",
            "admin_notes": reason,
            "reviewed_by": "admin",
            "reviewed_at": datetime.now().isoformat()
        }).eq("id", submission_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        return {"message": "Submission rejected", "reason": reason}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Stories Management
@app.post("/editor/stories")
async def create_story(story: StoryCreate):
    """Create a new story manually"""
    try:
        story_data = {
            "title": story.title,
            "summary": story.summary,
            "content": story.content,
            "category": story.category,
            "tags": story.tags,
            "source_url": story.source_url,
            "image_url": story.image_url,
            "status": story.status,
            "created_by": "admin",
            "published_date": (story.published_date or datetime.now()).isoformat()
        }
        
        result = supabase.table("stories").insert(story_data).execute()
        story_id = result.data[0]["id"]
        
        # Link to companies
        if story.company_slugs:
            await link_story_to_companies(story_id, story.company_slugs)
        
        return {"message": "Story created successfully", "story": result.data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/editor/stories/{story_id}")
async def update_story(story_id: str, story: StoryUpdate):
    """Update an existing story"""
    try:
        # Build update data
        update_data = {}
        if story.title is not None:
            update_data["title"] = story.title
        if story.summary is not None:
            update_data["summary"] = story.summary
        if story.content is not None:
            update_data["content"] = story.content
        if story.category is not None:
            update_data["category"] = story.category
        if story.tags is not None:
            update_data["tags"] = story.tags
        if story.source_url is not None:
            update_data["source_url"] = story.source_url
        if story.image_url is not None:
            update_data["image_url"] = story.image_url
        if story.status is not None:
            update_data["status"] = story.status
            
        update_data["updated_at"] = datetime.now().isoformat()
        
        result = supabase.table("stories").update(update_data).eq("id", story_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Story not found")
        
        # Update company links if provided
        if story.company_slugs is not None:
            # Remove existing links
            supabase.table("story_companies").delete().eq("story_id", story_id).execute()
            # Add new links
            await link_story_to_companies(story_id, story.company_slugs)
        
        return {"message": "Story updated successfully", "story": result.data[0]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/editor/stories/{story_id}")
def delete_story(story_id: str):
    """Delete a story"""
    try:
        result = supabase.table("stories").delete().eq("id", story_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Story not found")
        
        return {"message": "Story deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/editor/stories")
def get_stories_for_admin(
    status: Optional[str] = None,
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get stories for admin management"""
    try:
        query = supabase.table("stories").select("""
            *,
            story_companies(companies(name, slug))
        """)
        
        if status:
            query = query.eq("status", status)
        if category:
            query = query.eq("category", category)
            
        query = query.order("created_at", desc=True)
        
        start = (page - 1) * limit
        end = start + limit - 1
        
        result = query.range(start, end).execute()
        
        return {
            "stories": result.data,
            "page": page,
            "limit": limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Bulk Import
@app.post("/editor/stories/import-csv")
async def import_stories_csv(
    file: UploadFile = File(..., description="CSV file with stories"),
    dry_run: bool = Form(False, description="Preview import without saving")
):
    """Import stories from CSV file"""
    try:
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        # Read file content
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        # Parse CSV
        csv_reader = csv.DictReader(io.StringIO(csv_content))
        
        # Required fields
        required_fields = ['title', 'summary', 'category']
        
        # Validate headers
        if not all(field in csv_reader.fieldnames for field in required_fields):
            raise HTTPException(
                status_code=400, 
                detail=f"CSV must contain these columns: {', '.join(required_fields)}"
            )
        
        imported_stories = []
        errors = []
        row_number = 1
        
        for row in csv_reader:
            row_number += 1
            
            try:
                # Clean and validate data
                title = row.get('title', '').strip()
                summary = row.get('summary', '').strip()
                category = row.get('category', 'general').strip()
                
                if not title or not summary:
                    errors.append(f"Row {row_number}: Title and summary are required")
                    continue
                
                # Process tags
                tags_str = row.get('tags', '').strip()
                try:
                    tags = json.loads(tags_str) if tags_str else []
                except:
                    tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()] if tags_str else []
                
                # Process company slugs
                company_slugs_str = row.get('company_slugs', '').strip()
                company_slugs = [slug.strip() for slug in company_slugs_str.split(',') if slug.strip()] if company_slugs_str else []
                
                # Parse published date
                published_date_str = row.get('published_date', '').strip()
                if published_date_str:
                    try:
                        published_date = datetime.fromisoformat(published_date_str.replace('Z', '+00:00'))
                    except:
                        published_date = datetime.now()
                else:
                    published_date = datetime.now()
                
                story_data = {
                    "id": str(uuid.uuid4()),
                    "title": title,
                    "summary": summary,
                    "content": row.get('content', '').strip() or None,
                    "category": category,
                    "tags": tags,
                    "source_url": row.get('source_url', '').strip() or None,
                    "image_url": row.get('image_url', '').strip() or None,
                    "status": row.get('status', 'published').strip(),
                    "created_by": "csv_import",
                    "published_date": published_date.isoformat(),
                    "company_slugs": company_slugs,
                    "company_name": row.get('company_name', '').strip() or None
                }
                
                imported_stories.append(story_data)
                
            except Exception as e:
                errors.append(f"Row {row_number}: {str(e)}")
        
        if dry_run:
            return {
                "dry_run": True,
                "total_rows": len(imported_stories),
                "preview": imported_stories[:5],
                "errors": errors
            }
        
        # Save stories to database
        saved_stories = []
        for story in imported_stories:
            try:
                # Extract company data
                company_slugs = story.pop('company_slugs', [])
                company_name = story.pop('company_name', None)
                
                # Insert story
                result = supabase.table("stories").insert(story).execute()
                
                if result.data:
                    story_id = result.data[0]["id"]
                    saved_stories.append(story_id)
                    
                    # Link to companies
                    if company_slugs:
                        await link_story_to_companies(story_id, company_slugs, company_name)
                    elif company_name:
                        await link_story_to_companies(story_id, [], company_name)
                        
            except Exception as e:
                errors.append(f"Failed to save story '{story.get('title', 'Unknown')}': {str(e)}")
        
        return {
            "message": f"Import completed. {len(saved_stories)} stories saved.",
            "imported_count": len(saved_stories),
            "error_count": len(errors),
            "errors": errors[:10]  # Show first 10 errors
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/editor/csv-template")
def get_csv_template():
    """Get CSV template for bulk import"""
    template_data = {
        "headers": [
            "title", "summary", "content", "category", "tags", 
            "source_url", "image_url", "published_date", "status", 
            "company_name", "company_slugs"
        ],
        "example_row": {
            "title": "Example Startup Raises $5M Series A",
            "summary": "Example Startup, an AI-powered productivity platform, announced a $5M Series A funding round led by Example Ventures. The company plans to expand internationally and enhance their machine learning capabilities for better user personalization.",
            "content": "Full article content goes here...",
            "category": "funding",
            "tags": '["ai", "funding", "productivity"]',
            "source_url": "https://example.com/news/funding-announcement",
            "image_url": "https://example.com/images/company-logo.jpg",
            "published_date": "2024-01-15T10:00:00Z",
            "status": "published",
            "company_name": "Example Startup",
            "company_slugs": "example-startup"
        },
        "field_descriptions": {
            "title": "Story headline (required)",
            "summary": "60-80 word summary (required)", 
            "content": "Full article content (optional)",
            "category": "Category slug (required, defaults to 'general')",
            "tags": "JSON array of tags or comma-separated",
            "source_url": "Original article URL (optional)",
            "image_url": "Featured image URL (optional)",
            "published_date": "ISO date string (optional, defaults to now)",
            "status": "published or draft (optional, defaults to 'published')",
            "company_name": "Company name for auto-linking (optional)",
            "company_slugs": "Comma-separated company slugs (optional)"
        }
    }
    
    return template_data

async def link_story_to_companies(story_id: str, company_slugs: List[str], fallback_company_name: str = None):
    """Link a story to companies by slug, create company if needed"""
    try:
        companies_to_link = []
        
        # Find existing companies
        if company_slugs:
            companies_result = supabase.table("companies").select("id, slug").in_("slug", company_slugs).execute()
            companies_to_link = companies_result.data
            
            # Check if any company slugs are missing
            found_slugs = [c["slug"] for c in companies_to_link]
            missing_slugs = [slug for slug in company_slugs if slug not in found_slugs]
            
            # Create missing companies (basic entries)
            for slug in missing_slugs:
                company_name = slug.replace("-", " ").title()
                company_data = {
                    "name": company_name,
                    "slug": slug,
                    "company_type": "startup",
                    "status": "active"
                }
                
                result = supabase.table("companies").insert(company_data).execute()
                if result.data:
                    companies_to_link.append({"id": result.data[0]["id"], "slug": slug})
        
        # If no slugs provided but have company name, try to create/find company
        elif fallback_company_name:
            slug = generate_slug(fallback_company_name)
            
            # Check if company exists
            existing = supabase.table("companies").select("id, slug").eq("slug", slug).execute()
            
            if existing.data:
                companies_to_link = existing.data
            else:
                # Create new company
                company_data = {
                    "name": fallback_company_name,
                    "slug": slug,
                    "company_type": "startup",
                    "status": "active"
                }
                
                result = supabase.table("companies").insert(company_data).execute()
                if result.data:
                    companies_to_link = [{"id": result.data[0]["id"], "slug": slug}]
        
        # Create story-company links
        for company in companies_to_link:
            supabase.table("story_companies").insert({
                "story_id": story_id,
                "company_id": company["id"],
                "relevance_score": 1.0
            }).execute()
            
    except Exception as e:
        # Don't fail the main operation if linking fails
        print(f"Warning: Failed to link story to companies: {str(e)}")

def generate_slug(name: str) -> str:
    """Generate URL-safe slug from company name"""
    import re
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug.strip('-')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8002)))
