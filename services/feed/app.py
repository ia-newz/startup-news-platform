from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import os
from supabase import create_client, Client
import uvicorn
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta

app = FastAPI(title="Feed Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase connection
supabase_url = os.environ.get("SUPABASE_URL", "")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE", "")
supabase: Client = create_client(supabase_url, supabase_key)

@app.get("/")
def read_root():
    return {"message": "Feed Service is running!", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/stories")
def get_stories(
    category: Optional[str] = None,
    industry: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    company_slug: Optional[str] = None
):
    """Get stories with filtering and pagination"""
    try:
        query = supabase.table("stories").select("""
            *,
            story_companies!inner(
                companies(name, slug, industry, logo_url)
            )
        """)
        
        # Apply filters
        if category and category != 'all':
            query = query.eq("category", category)
            
        if search:
            query = query.ilike("title", f"%{search}%")
            
        if company_slug:
            query = query.eq("story_companies.companies.slug", company_slug)
            
        if industry:
            query = query.eq("story_companies.companies.industry", industry)
        
        query = query.eq("status", "published")
        query = query.order("published_date", desc=True)
        
        # Pagination
        start = (page - 1) * limit
        end = start + limit - 1
        
        result = query.range(start, end).execute()
        
        # Format response
        stories = []
        for story in result.data:
            companies = [sc["companies"] for sc in story.get("story_companies", [])]
            story_data = {**story}
            story_data["companies"] = companies
            del story_data["story_companies"]
            stories.append(story_data)
        
        return {
            "stories": stories,
            "page": page,
            "limit": limit,
            "total": len(stories),
            "has_more": len(stories) == limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stories/trending")
def get_trending_stories(
    limit: int = Query(20, ge=1, le=50),
    timeframe: str = Query("week", regex="^(day|week|month)$")
):
    """Get trending stories based on engagement"""
    try:
        # Calculate date threshold
        now = datetime.now()
        if timeframe == "day":
            since = now - timedelta(days=1)
        elif timeframe == "week":
            since = now - timedelta(weeks=1)
        else:  # month
            since = now - timedelta(days=30)
        
        result = supabase.table("stories").select("""
            *,
            story_companies(
                companies(name, slug, industry, logo_url)
            )
        """).eq("status", "published").gte(
            "published_date", since.isoformat()
        ).order("likes", desc=True).order("views", desc=True).limit(limit).execute()
        
        # Format response
        stories = []
        for story in result.data:
            companies = [sc["companies"] for sc in story.get("story_companies", [])]
            story_data = {**story}
            story_data["companies"] = companies
            del story_data["story_companies"]
            stories.append(story_data)
        
        return {"stories": stories, "timeframe": timeframe}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/categories")
def get_categories():
    """Get all available categories"""
    try:
        result = supabase.table("categories").select("*").order("sort_order").execute()
        return {"categories": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/industries")
def get_industries():
    """Get all available industries"""
    try:
        result = supabase.table("industries").select("*").order("sort_order").execute()
        return {"industries": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stories/{story_id}/like")
def like_story(story_id: str):
    """Increment like count for a story"""
    try:
        # Get current likes
        story_result = supabase.table("stories").select("likes").eq("id", story_id).execute()
        
        if not story_result.data:
            raise HTTPException(status_code=404, detail="Story not found")
        
        current_likes = story_result.data[0]["likes"] or 0
        
        # Update likes
        result = supabase.table("stories").update({
            "likes": current_likes + 1
        }).eq("id", story_id).execute()
        
        return {"success": True, "likes": current_likes + 1}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stories/{story_id}/view")
def track_view(story_id: str):
    """Increment view count for a story"""
    try:
        # Get current views
        story_result = supabase.table("stories").select("views").eq("id", story_id).execute()
        
        if not story_result.data:
            raise HTTPException(status_code=404, detail="Story not found")
        
        current_views = story_result.data["views"] or 0
        
        # Update views
        result = supabase.table("stories").update({
            "views": current_views + 1
        }).eq("id", story_id).execute()
        
        return {"success": True, "views": current_views + 1}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
