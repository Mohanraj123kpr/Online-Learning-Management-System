from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.course import UserProgress
from app.schemas.user import UserUpdate, UserPreferencesUpdate, UserResponse
from typing import Optional

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user information."""
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        avatar=user.avatar,
        bio=user.bio,
        title=user.title,
        location=user.location,
        website=user.website,
        social_links=user.social_links or {},
        preferences=user.preferences or {},
        stats=user.stats or {},
        created_at=user.created_at
    )


@router.put("/me", response_model=UserResponse)
def update_user_profile(
    updates: UserUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information."""
    
    # Update fields
    if updates.name is not None:
        user.name = updates.name
    if updates.avatar is not None:
        user.avatar = updates.avatar
    if updates.bio is not None:
        user.bio = updates.bio
    if updates.title is not None:
        user.title = updates.title
    if updates.location is not None:
        user.location = updates.location
    if updates.website is not None:
        user.website = updates.website
    if updates.social_links is not None:
        user.social_links = updates.social_links
    
    db.commit()
    db.refresh(user)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        avatar=user.avatar,
        bio=user.bio,
        title=user.title,
        location=user.location,
        website=user.website,
        social_links=user.social_links or {},
        preferences=user.preferences or {},
        stats=user.stats or {},
        created_at=user.created_at
    )


@router.put("/me/preferences")
def update_user_preferences(
    updates: UserPreferencesUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user preferences."""
    
    # Get current preferences
    preferences = user.preferences or {}
    
    # Update preferences
    update_dict = updates.model_dump(exclude_unset=True)
    preferences.update(update_dict)
    
    user.preferences = preferences
    db.commit()
    
    return {"message": "Preferences updated", "preferences": preferences}


@router.get("/me/progress")
def get_user_progress(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's learning progress."""
    progress_records = db.query(UserProgress).filter(
        UserProgress.user_id == user.id
    ).all()
    
    return [
        {
            "courseId": p.course_id,
            "completedLessons": p.completed_lessons,
            "lastAccessedLesson": p.last_accessed_lesson,
            "progress": p.progress,
            "videoTimestamps": p.video_timestamps
        }
        for p in progress_records
    ]
