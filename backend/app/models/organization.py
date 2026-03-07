from sqlalchemy import Column, String, Integer, Boolean, DateTime, JSON, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class OrgPlan(str, enum.Enum):
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class OrgRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    INSTRUCTOR = "instructor"
    LEARNER = "learner"


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    logo = Column(String, nullable=True)
    domain = Column(String, nullable=True)
    plan = Column(SQLEnum(OrgPlan), default=OrgPlan.STARTER)
    settings = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    memberships = relationship("OrgMembership", back_populates="organization", cascade="all, delete-orphan")
    courses = relationship("OrgCourse", back_populates="organization", cascade="all, delete-orphan")


class OrgMembership(Base):
    __tablename__ = "org_memberships"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False, index=True)
    role = Column(SQLEnum(OrgRole), default=OrgRole.LEARNER)
    department = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    joined_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="memberships")


class OrgCourse(Base):
    __tablename__ = "org_courses"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False, index=True)
    course_id = Column(String, nullable=False, index=True)
    assigned_to = Column(String, default="all")  # 'all' or 'specific'
    assigned_user_ids = Column(JSON, default=[])
    assigned_departments = Column(JSON, default=[])
    mandatory = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=True)
    added_by = Column(String, nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="courses")
