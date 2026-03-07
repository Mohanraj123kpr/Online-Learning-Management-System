from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.user import User
from app.models.organization import Organization, OrgMembership, OrgCourse
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse
from datetime import timedelta
from app.core.config import settings
import uuid

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return token with org context."""
    
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Get user's organization membership
    membership = db.query(OrgMembership).filter(
        OrgMembership.user_id == user.id,
        OrgMembership.active == True
    ).first()
    
    organization = None
    org_courses = []
    
    if membership:
        # Get organization details
        organization = db.query(Organization).filter(
            Organization.id == membership.organization_id
        ).first()
        
        # Get organization courses
        org_courses = db.query(OrgCourse).filter(
            OrgCourse.organization_id == membership.organization_id
        ).all()
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "org_id": membership.organization_id if membership else None,
            "role": membership.role.value if membership else None
        },
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Build response
    return LoginResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            avatar=user.avatar,
            bio=user.bio,
            title=user.title,
            organization_id=membership.organization_id if membership else None,
            org_role=membership.role.value if membership else None,
            department=membership.department if membership else None,
            preferences=user.preferences or {},
            stats=user.stats or {},
            created_at=user.created_at
        ),
        organization={
            "id": organization.id,
            "name": organization.name,
            "slug": organization.slug,
            "logo": organization.logo,
            "domain": organization.domain,
            "plan": organization.plan.value,
            "settings": organization.settings,
            "createdAt": organization.created_at.isoformat()
        } if organization else None,
        membership={
            "id": membership.id,
            "userId": membership.user_id,
            "organizationId": membership.organization_id,
            "role": membership.role.value,
            "department": membership.department,
            "joinedAt": membership.joined_at.isoformat(),
            "active": membership.active
        } if membership else None,
        org_courses=[
            {
                "id": oc.id,
                "organizationId": oc.organization_id,
                "courseId": oc.course_id,
                "assignedTo": oc.assigned_to,
                "assignedUserIds": oc.assigned_user_ids,
                "assignedDepartments": oc.assigned_departments,
                "mandatory": oc.mandatory,
                "dueDate": oc.due_date.isoformat() if oc.due_date else None,
                "addedBy": oc.added_by,
                "addedAt": oc.added_at.isoformat()
            }
            for oc in org_courses
        ],
        token=access_token
    )


@router.post("/logout")
def logout():
    """Logout user (client-side token removal)."""
    return {"message": "Logged out successfully"}


@router.post("/refresh")
def refresh_token(user: User = Depends(get_db)):
    """Refresh access token."""
    # TODO: Implement refresh token logic
    pass
