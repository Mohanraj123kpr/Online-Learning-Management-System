from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import require_admin
from app.models.organization import OrgMembership, OrgCourse
from app.models.user import User
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uuid

router = APIRouter()


class InviteEmployeeRequest(BaseModel):
    email: EmailStr
    name: str
    role: str
    department: Optional[str] = None


class AssignCourseRequest(BaseModel):
    courseId: str
    assignedTo: str  # 'all' or 'specific'
    assignedDepartments: Optional[List[str]] = None
    assignedUserIds: Optional[List[str]] = None
    mandatory: bool = False
    dueDate: Optional[str] = None


@router.get("/employees")
def list_employees(
    membership: OrgMembership = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List all employees in the organization."""
    
    # Get all memberships for this org
    memberships = db.query(OrgMembership).filter(
        OrgMembership.organization_id == membership.organization_id
    ).all()
    
    # Get user details
    user_ids = [m.user_id for m in memberships]
    users = db.query(User).filter(User.id.in_(user_ids)).all()
    user_map = {u.id: u for u in users}
    
    result = []
    for m in memberships:
        user = user_map.get(m.user_id)
        if user:
            result.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "avatar": user.avatar,
                "role": m.role.value,
                "department": m.department,
                "active": m.active,
                "joinedAt": m.joined_at.isoformat()
            })
    
    return result


@router.post("/employees/invite")
def invite_employee(
    data: InviteEmployeeRequest,
    membership: OrgMembership = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Invite a new employee to the organization."""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    
    if existing_user:
        # Check if already a member
        existing_membership = db.query(OrgMembership).filter(
            OrgMembership.user_id == existing_user.id,
            OrgMembership.organization_id == membership.organization_id
        ).first()
        
        if existing_membership:
            raise HTTPException(status_code=400, detail="User is already a member")
        
        # Add to organization
        new_membership = OrgMembership(
            id=str(uuid.uuid4()),
            user_id=existing_user.id,
            organization_id=membership.organization_id,
            role=data.role,
            department=data.department,
            active=True
        )
        db.add(new_membership)
        db.commit()
        
        return {"message": "User added to organization"}
    
    # TODO: Send invitation email
    # For now, just return success
    return {
        "message": "Invitation sent",
        "email": data.email
    }


@router.delete("/employees/{user_id}")
def remove_employee(
    user_id: str,
    membership: OrgMembership = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Remove an employee from the organization."""
    
    # Find membership
    target_membership = db.query(OrgMembership).filter(
        OrgMembership.user_id == user_id,
        OrgMembership.organization_id == membership.organization_id
    ).first()
    
    if not target_membership:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Can't remove yourself
    if user_id == membership.user_id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself")
    
    # Deactivate membership
    target_membership.active = False
    db.commit()
    
    return {"message": "Employee removed"}


@router.post("/courses/assign")
def assign_course(
    data: AssignCourseRequest,
    membership: OrgMembership = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Assign a course to employees."""
    from datetime import datetime
    
    # Create course assignment
    assignment = OrgCourse(
        id=str(uuid.uuid4()),
        organization_id=membership.organization_id,
        course_id=data.courseId,
        assigned_to=data.assignedTo,
        assigned_user_ids=data.assignedUserIds or [],
        assigned_departments=data.assignedDepartments or [],
        mandatory=data.mandatory,
        due_date=datetime.fromisoformat(data.dueDate) if data.dueDate else None,
        added_by=membership.user_id
    )
    
    db.add(assignment)
    db.commit()
    
    return {
        "message": "Course assigned successfully",
        "assignmentId": assignment.id
    }


@router.delete("/courses/assignments/{assignment_id}")
def unassign_course(
    assignment_id: str,
    membership: OrgMembership = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Unassign a course."""
    
    assignment = db.query(OrgCourse).filter(
        OrgCourse.id == assignment_id,
        OrgCourse.organization_id == membership.organization_id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(assignment)
    db.commit()
    
    return {"message": "Course unassigned"}


@router.get("/analytics")
def get_analytics(
    membership: OrgMembership = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get organization analytics."""
    
    # Count employees
    total_employees = db.query(OrgMembership).filter(
        OrgMembership.organization_id == membership.organization_id,
        OrgMembership.active == True
    ).count()
    
    # Count courses
    courses_assigned = db.query(OrgCourse).filter(
        OrgCourse.organization_id == membership.organization_id
    ).count()
    
    return {
        "totalEmployees": total_employees,
        "activeLearners": total_employees,  # TODO: Calculate actual active learners
        "coursesAssigned": courses_assigned,
        "avgCompletion": 42  # TODO: Calculate actual average
    }
