from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user, get_current_org_membership
from app.models.user import User
from app.models.organization import OrgMembership, OrgCourse
from app.models.course import Course, UserProgress

router = APIRouter()


@router.get("/")
def list_courses(
    user: User = Depends(get_current_user),
    membership: OrgMembership = Depends(get_current_org_membership),
    db: Session = Depends(get_db)
):
    """List all courses available to the user's organization."""
    
    # Get organization's assigned courses
    org_courses = db.query(OrgCourse).filter(
        OrgCourse.organization_id == membership.organization_id
    ).all()
    
    # Get course IDs that user has access to
    accessible_course_ids = []
    for oc in org_courses:
        if oc.assigned_to == "all":
            accessible_course_ids.append(oc.course_id)
        elif oc.assigned_to == "specific":
            # Check if user is in assigned users or departments
            if user.id in (oc.assigned_user_ids or []):
                accessible_course_ids.append(oc.course_id)
            elif membership.department in (oc.assigned_departments or []):
                accessible_course_ids.append(oc.course_id)
    
    # Get courses
    courses = db.query(Course).filter(
        Course.id.in_(accessible_course_ids)
    ).all()
    
    # Get user progress for these courses
    progress_records = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.course_id.in_(accessible_course_ids)
    ).all()
    
    progress_map = {p.course_id: p for p in progress_records}
    
    # Build response
    result = []
    for course in courses:
        progress = progress_map.get(course.id)
        result.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "instructor": course.instructor,
            "thumbnail": course.thumbnail,
            "category": course.category,
            "level": course.level.value,
            "duration": course.duration,
            "studentsEnrolled": course.students_enrolled,
            "rating": course.rating,
            "modules": course.modules,
            "organizationId": course.organization_id,
            "visibility": course.visibility.value,
            "enrolled": progress is not None,
            "progress": progress.progress if progress else 0,
            "currentLesson": progress.last_accessed_lesson if progress else None
        })
    
    return result


@router.get("/{course_id}")
def get_course(
    course_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get course details."""
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Get user progress
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.course_id == course_id
    ).first()
    
    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "instructor": course.instructor,
        "thumbnail": course.thumbnail,
        "category": course.category,
        "level": course.level.value,
        "duration": course.duration,
        "studentsEnrolled": course.students_enrolled,
        "rating": course.rating,
        "modules": course.modules,
        "enrolled": progress is not None,
        "progress": progress.progress if progress else 0,
        "completedLessons": progress.completed_lessons if progress else []
    }


@router.post("/{course_id}/enroll")
def enroll_course(
    course_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enroll in a course."""
    import uuid
    
    # Check if already enrolled
    existing = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.course_id == course_id
    ).first()
    
    if existing:
        return {"message": "Already enrolled"}
    
    # Create progress record
    progress = UserProgress(
        id=str(uuid.uuid4()),
        user_id=user.id,
        course_id=course_id,
        completed_lessons=[],
        progress=0
    )
    
    db.add(progress)
    db.commit()
    
    return {"message": "Enrolled successfully"}


@router.put("/{course_id}/progress")
def update_progress(
    course_id: str,
    lesson_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update course progress."""
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.course_id == course_id
    ).first()
    
    if not progress:
        raise HTTPException(status_code=404, detail="Not enrolled in this course")
    
    # Add lesson to completed if not already there
    if lesson_id not in progress.completed_lessons:
        progress.completed_lessons.append(lesson_id)
    
    # Calculate progress percentage
    course = db.query(Course).filter(Course.id == course_id).first()
    if course:
        total_lessons = sum(len(module.get("lessons", [])) for module in course.modules)
        if total_lessons > 0:
            progress.progress = int((len(progress.completed_lessons) / total_lessons) * 100)
    
    progress.last_accessed_lesson = lesson_id
    
    db.commit()
    
    return {"message": "Progress updated", "progress": progress.progress}
