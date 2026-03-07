from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.course import UserProgress

router = APIRouter()


@router.get("/me")
def get_current_user_info(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user information."""
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "avatar": user.avatar,
        "bio": user.bio,
        "title": user.title,
        "preferences": user.preferences,
        "stats": user.stats
    }


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
