from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import os
from supabase import create_client, Client
import uvicorn
from typing import List, Dict, Any, Optional
from datetime import datetime, date
import json

app = FastAPI(title="Timeline Service", version="1.0.0")

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

@app.get("/")
def read_root():
    return {"message": "Timeline Service is running!", "version": "1.0.0"}

@app.get("/companies/{company_slug}/timeline")
def get_company_timeline(company_slug: str):
    """Get complete timeline for a company"""
    try:
        # Get company details
        company_result = supabase.table("companies").select("*").eq("slug", company_slug).execute()
        
        if not company_result.data:
            raise HTTPException(status_code=404, detail="Company not found")
            
        company = company_result.data[0]
        company_id = company["id"]
        
        # Get funding rounds
        funding_result = supabase.table("funding_rounds").select("*").eq(
            "company_id", company_id
        ).order("announced_date", desc=True).execute()
        
        # Get company events
        events_result = supabase.table("company_events").select("*").eq(
            "company_id", company_id
        ).order("event_date", desc=True).execute()
        
        # Get related stories
        stories_result = supabase.table("story_companies").select("""
            *,
            stories(id, title, summary, published_date, category, tags, source_url, likes, views)
        """).eq("company_id", company_id).execute()
        
        # Build timeline
        timeline = []
        
        # Add funding rounds
        for funding in funding_result.data:
            timeline.append({
                "id": funding["id"],
                "type": "funding",
                "date": funding["announced_date"],
                "title": f'{funding["round_type"].replace("-", " ").title()} Round',
                "description": f'Raised {format_amount(funding["amount_raised"], funding["currency"])}' if funding["amount_raised"] else f'{funding["round_type"].title()} funding round',
                "amount": funding["amount_raised"],
                "currency": funding["currency"],
                "investors": funding["investors"],
                "valuation": funding["valuation"],
                "source_url": funding["source_url"],
                "metadata": {
                    "round_type": funding["round_type"],
                    "description": funding.get("description", "")
                }
            })
        
        # Add events
        for event in events_result.data:
            timeline.append({
                "id": event["id"],
                "type": "event",
                "date": event["event_date"],
                "title": event["title"],
                "description": event["description"],
                "amount": event["amount"],
                "source_url": event["source_url"],
                "metadata": {
                    "event_type": event["event_type"],
                    **event.get("metadata", {})
                }
            })
            
        # Add stories
        for story_link in stories_result.data:
            if story_link["stories"]:
                story = story_link["stories"]
                published_date = story["published_date"]
                if isinstance(published_date, str):
                    # Extract just the date part
                    published_date = published_date[:10]
                
                timeline.append({
                    "id": story["id"],
                    "type": "story",
                    "date": published_date,
                    "title": story["title"],
                    "description": truncate_text(story["summary"], 150),
                    "source_url": story["source_url"],
                    "metadata": {
                        "category": story["category"],
                        "tags": story["tags"],
                        "likes": story["likes"],
                        "views": story["views"],
                        "full_summary": story["summary"]
                    }
                })
        
        # Sort timeline by date (newest first)
        timeline.sort(key=lambda x: x["date"] if x["date"] else "", reverse=True)
        
        # Get funding summary
        funding_summary = get_funding_summary(funding_result.data)
        
        return {
            "company": company,
            "timeline": timeline,
            "stats": {
                "total_events": len(timeline),
                "funding_rounds": len(funding_result.data),
                "company_events": len(events_result.data),
                "related_stories": len([x for x in stories_result.data if x["stories"]]),
                "total_funding": funding_summary["total_raised"],
                "last_funding": funding_summary["last_round"]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/companies")
def get_companies(
    industry: Optional[str] = None,
    company_type: Optional[str] = None,
    location: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    sort: str = Query("name", regex="^(name|founded_date|updated_at)$")
):
    """Get companies with filtering and pagination"""
    try:
        query = supabase.table("companies").select("""
            *,
            funding_rounds(round_type, amount_raised, announced_date),
            story_companies(stories(id))
        """)
        
        # Apply filters
        if industry:
            query = query.eq("industry", industry)
        if company_type:
            query = query.eq("company_type", company_type)
        if location:
            query = query.ilike("location", f"%{location}%")
        if search:
            query = query.ilike("name", f"%{search}%")
        
        query = query.eq("status", "active")
        
        # Apply sorting
        if sort == "founded_date":
            query = query.order("founded_date", desc=True)
        elif sort == "updated_at":
            query = query.order("updated_at", desc=True)
        else:
            query = query.order("name", desc=False)
        
        # Pagination
        start = (page - 1) * limit
        end = start + limit - 1
        
        result = query.range(start, end).execute()
        
        # Enhance company data
        companies = []
        for company in result.data:
            # Calculate funding stats
            funding_rounds = company.get("funding_rounds", [])
            total_funding = sum(r["amount_raised"] or 0 for r in funding_rounds)
            last_funding = max(funding_rounds, key=lambda x: x["announced_date"]) if funding_rounds else None
            
            # Count related stories
            story_count = len([sc for sc in company.get("story_companies", []) if sc["stories"]])
            
            company_data = {**company}
            company_data["stats"] = {
                "total_funding": total_funding,
                "funding_rounds_count": len(funding_rounds),
                "last_funding_round": last_funding["round_type"] if last_funding else None,
                "last_funding_date": last_funding["announced_date"] if last_funding else None,
                "story_count": story_count
            }
            
            # Clean up nested data
            del company_data["funding_rounds"]
            del company_data["story_companies"]
            
            companies.append(company_data)
        
        return {
            "companies": companies,
            "page": page,
            "limit": limit,
            "total": len(companies),
            "has_more": len(companies) == limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/companies/{company_slug}")
def get_company(company_slug: str):
    """Get single company with basic stats"""
    try:
        result = supabase.table("companies").select("""
            *,
            funding_rounds(*),
            company_events(*),
            story_companies(stories(id, title, category, published_date))
        """).eq("slug", company_slug).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Company not found")
        
        company = result.data[0]
        
        # Calculate stats
        funding_rounds = company.get("funding_rounds", [])
        events = company.get("company_events", [])
        stories = [sc["stories"] for sc in company.get("story_companies", []) if sc["stories"]]
        
        total_funding = sum(r["amount_raised"] or 0 for r in funding_rounds)
        
        company_data = {**company}
        company_data["stats"] = {
            "total_funding": total_funding,
            "funding_rounds_count": len(funding_rounds),
            "events_count": len(events),
            "stories_count": len(stories),
            "latest_story_date": max([s["published_date"] for s in stories]) if stories else None
        }
        
        return {"company": company_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def format_amount(amount: float, currency: str = "USD") -> str:
    """Format monetary amount"""
    if not amount:
        return "Undisclosed"
    
    if amount >= 1_000_000_000:
        return f"${amount/1_000_000_000:.1f}B"
    elif amount >= 1_000_000:
        return f"${amount/1_000_000:.1f}M"
    elif amount >= 1_000:
        return f"${amount/1_000:.0f}K"
    else:
        return f"${amount:.0f}"

def truncate_text(text: str, max_length: int) -> str:
    """Truncate text to specified length"""
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."

def get_funding_summary(funding_rounds: List[Dict]) -> Dict:
    """Calculate funding summary stats"""
    if not funding_rounds:
        return {"total_raised": 0, "last_round": None}
    
    total_raised = sum(r["amount_raised"] or 0 for r in funding_rounds)
    last_round = max(funding_rounds, key=lambda x: x["announced_date"])
    
    return {
        "total_raised": total_raised,
        "last_round": {
            "type": last_round["round_type"],
            "amount": last_round["amount_raised"],
            "date": last_round["announced_date"]
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8001)))
