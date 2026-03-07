"""
Organization management routes.
Handles tenant onboarding, management, and settings.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.organization import Organization, OrgMembership, OrgRole, OrgPlan
from app.core.security import get_password_hash
from pydantic import BaseModel, EmailStr
import uuid
import re

router = APIRouter()


# Schemas
class OrganizationCreate(BaseModel):
    name: str
    slug: str
    domain: str
    plan: OrgPlan = OrgPlan.STARTER
    admin_name: str
    admin_email: EmailStr
    admin_password: str
    logo: str | None = None


class OrganizationUpdate(BaseModel):
    name: str | None = None
    logo: str | None = None
    settings: dict | None = None


class OrganizationResponse(BaseModel):
    id: str
    name: str
    slug: str
    logo: str | None
    domain: str
    plan: str
    settings: dict
    created_at: str
    
    class Config:
        from_attributes = True


# Helper functions
def validate_slug(slug: str) -> bool:
    """Validate organization slug format."""
    return bool(re.match(r'^[a-z0-9-]+$', slug))


def get_plan_limits(plan: OrgPlan) -> dict:
    """Get limits based on organization plan."""
    limits = {
        OrgPlan.STARTER: {
            "maxUsers": 25,
            "maxCourses": 10,
            "allowSelfEnrollment": False,
            "requireApproval": True,
            "customBranding": False,
            "ssoEnabled": False
        },
        OrgPlan.PROFESSIONAL: {
            "maxUsers": 100,
            "maxCourses": 50,
            "allowSelfEnrollment": True,
            "requireApproval": False,
            "customBranding": True,
            "ssoEnabled": False
        },
        OrgPlan.ENTERPRISE: {
            "maxUsers": -1,  # Unlimited
            "maxCourses": -1,  # Unlimited
            "allowSelfEnrollment": True,
            "requireApproval": False,
            "customBranding": True,
            "ssoEnabled": True
        }
    }
    return limits.get(plan, limits[OrgPlan.STARTER])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_organization(
    org_data: OrganizationCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new organization (tenant onboarding).
    Creates organization, admin user, and membership.
    """
    # Validate slug format
    if not validate_slug(org_data.slug):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug must contain only lowercase letters, numbers, and hyphens"
        )
    
    # Check if slug already exists
    existing_org = db.query(Organization).filter(
        Organization.slug == org_data.slug
    ).first()
    if existing_org:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization slug already exists"
        )
    
    # Check if domain already exists
    existing_domain = db.query(Organization).filter(
        Organization.domain == org_data.domain
    ).first()
    if existing_domain:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization domain already exists"
        )
    
    # Check if admin email already exists
    existing_user = db.query(User).filter(
        User.email == org_data.admin_email
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin email already exists"
        )
    
    try:
        # Create organization
        org_id = f"org-{uuid.uuid4().hex[:8]}"
        organization = Organization(
            id=org_id,
            name=org_data.name,
            slug=org_data.slug,
            logo=org_data.logo,
            domain=org_data.domain,
            plan=org_data.plan,
            settings=get_plan_limits(org_data.plan)
        )
        db.add(organization)
        
        # Create admin user
        user_id = f"user-{uuid.uuid4().hex[:8]}"
        admin_user = User(
            id=user_id,
            email=org_data.admin_email,
            hashed_password=get_password_hash(org_data.admin_password),
            name=org_data.admin_name,
            preferences={
                "theme": "light",
                "language": "en",
                "emailNotifications": True
            },
            stats={
                "coursesEnrolled": 0,
                "coursesCompleted": 0,
                "totalHoursLearned": 0
            }
        )
        db.add(admin_user)
        
        # Create admin membership
        membership_id = f"mem-{uuid.uuid4().hex[:8]}"
        membership = OrgMembership(
            id=membership_id,
            user_id=user_id,
            organization_id=org_id,
            role=OrgRole.OWNER,
            department="Administration",
            active=True
        )
        db.add(membership)
        
        db.commit()
        db.refresh(organization)
        
        return {
            "message": "Organization registered successfully",
            "organization": {
                "id": organization.id,
                "name": organization.name,
                "slug": organization.slug,
                "domain": organization.domain,
                "plan": organization.plan.value
            },
            "admin": {
                "id": admin_user.id,
                "email": admin_user.email,
                "name": admin_user.name
            },
            "next_steps": [
                f"Login at: https://yourdomain.com/login with {org_data.admin_email}",
                "Configure organization settings",
                "Invite team members",
                "Add or assign courses"
            ]
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register organization: {str(e)}"
        )


@router.get("/my-organization")
def get_my_organization(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's organization details."""
    membership = db.query(OrgMembership).filter(
        OrgMembership.user_id == current_user.id,
        OrgMembership.active == True
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User is not part of any organization"
        )
    
    organization = db.query(Organization).filter(
        Organization.id == membership.organization_id
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Get member count
    member_count = db.query(OrgMembership).filter(
        OrgMembership.organization_id == organization.id,
        OrgMembership.active == True
    ).count()
    
    return {
        "id": organization.id,
        "name": organization.name,
        "slug": organization.slug,
        "logo": organization.logo,
        "domain": organization.domain,
        "plan": organization.plan.value,
        "settings": organization.settings,
        "member_count": member_count,
        "created_at": organization.created_at.isoformat()
    }


@router.put("/my-organization")
def update_my_organization(
    org_update: OrganizationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update organization details. Requires admin/owner role."""
    membership = db.query(OrgMembership).filter(
        OrgMembership.user_id == current_user.id,
        OrgMembership.active == True
    ).first()
    
    if not membership or membership.role not in [OrgRole.OWNER, OrgRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organization owners/admins can update organization"
        )
    
    organization = db.query(Organization).filter(
        Organization.id == membership.organization_id
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Update fields
    if org_update.name:
        organization.name = org_update.name
    if org_update.logo:
        organization.logo = org_update.logo
    if org_update.settings:
        # Merge settings, don't overwrite plan limits
        current_settings = organization.settings or {}
        current_settings.update(org_update.settings)
        organization.settings = current_settings
    
    db.commit()
    db.refresh(organization)
    
    return {
        "message": "Organization updated successfully",
        "organization": {
            "id": organization.id,
            "name": organization.name,
            "slug": organization.slug,
            "logo": organization.logo,
            "domain": organization.domain,
            "plan": organization.plan.value,
            "settings": organization.settings
        }
    }


@router.post("/my-organization/upgrade")
def upgrade_organization_plan(
    new_plan: OrgPlan,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upgrade organization plan. Requires owner role."""
    membership = db.query(OrgMembership).filter(
        OrgMembership.user_id == current_user.id,
        OrgMembership.active == True
    ).first()
    
    if not membership or membership.role != OrgRole.OWNER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only organization owners can upgrade plan"
        )
    
    organization = db.query(Organization).filter(
        Organization.id == membership.organization_id
    ).first()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Update plan and settings
    old_plan = organization.plan
    organization.plan = new_plan
    organization.settings = get_plan_limits(new_plan)
    
    db.commit()
    db.refresh(organization)
    
    return {
        "message": f"Organization plan upgraded from {old_plan.value} to {new_plan.value}",
        "organization": {
            "id": organization.id,
            "name": organization.name,
            "plan": organization.plan.value,
            "settings": organization.settings
        }
    }
