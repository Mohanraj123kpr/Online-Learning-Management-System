"""
Seed database with sample data for development.
Run: python scripts/seed_db.py
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.organization import Organization, OrgMembership, OrgCourse, OrgPlan, OrgRole
from app.models.course import Course, CourseLevel, CourseVisibility
from app.core.security import get_password_hash
import uuid


def seed_database():
    """Seed the database with sample data."""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        print("🧹 Clearing existing data...")
        db.query(OrgCourse).delete()
        db.query(OrgMembership).delete()
        db.query(Course).delete()
        db.query(User).delete()
        db.query(Organization).delete()
        db.commit()
        print("✅ Existing data cleared")
        
        # Create organizations
        org1 = Organization(
            id="org-1",
            name="Acme Corporation",
            slug="acme-corp",
            logo="https://via.placeholder.com/150/3b82f6/ffffff?text=ACME",
            domain="acme.com",
            plan=OrgPlan.PROFESSIONAL,
            settings={
                "maxUsers": 100,
                "maxCourses": 50,
                "allowSelfEnrollment": True,
                "requireApproval": False,
                "customBranding": True,
                "ssoEnabled": False
            }
        )
        
        org2 = Organization(
            id="org-2",
            name="TechStart Inc",
            slug="techstart",
            logo="https://via.placeholder.com/150/10b981/ffffff?text=TS",
            domain="techstart.io",
            plan=OrgPlan.STARTER,
            settings={
                "maxUsers": 25,
                "maxCourses": 10,
                "allowSelfEnrollment": False,
                "requireApproval": True,
                "customBranding": False,
                "ssoEnabled": False
            }
        )
        
        db.add_all([org1, org2])
        
        # Create users
        admin_user = User(
            id="user-1",
            email="admin@acme.com",
            hashed_password=get_password_hash("password"),
            name="John Doe",
            avatar="https://images.unsplash.com/photo-1629507208649-70919ca33793?w=200",
            preferences={
                "theme": "light",
                "language": "en",
                "emailNotifications": True
            },
            stats={
                "coursesEnrolled": 5,
                "coursesCompleted": 2,
                "totalHoursLearned": 48
            }
        )
        
        learner_user = User(
            id="user-2",
            email="learner@acme.com",
            hashed_password=get_password_hash("password"),
            name="Jane Smith",
            preferences={},
            stats={}
        )
        
        instructor_user = User(
            id="user-3",
            email="instructor@acme.com",
            hashed_password=get_password_hash("password"),
            name="Mike Johnson",
            preferences={},
            stats={}
        )
        
        db.add_all([admin_user, learner_user, instructor_user])
        
        # Create memberships
        admin_membership = OrgMembership(
            id="mem-1",
            user_id="user-1",
            organization_id="org-1",
            role=OrgRole.ADMIN,
            department="Engineering",
            active=True
        )
        
        learner_membership = OrgMembership(
            id="mem-2",
            user_id="user-2",
            organization_id="org-1",
            role=OrgRole.LEARNER,
            department="Marketing",
            active=True
        )
        
        instructor_membership = OrgMembership(
            id="mem-3",
            user_id="user-3",
            organization_id="org-1",
            role=OrgRole.INSTRUCTOR,
            department="Training",
            active=True
        )
        
        db.add_all([admin_membership, learner_membership, instructor_membership])
        
        # Create courses
        course1 = Course(
            id="1",
            title="Complete Web Development Bootcamp",
            description="Master HTML, CSS, JavaScript, React, Node.js, and more.",
            instructor={"name": "Sarah Johnson", "avatar": "https://via.placeholder.com/150"},
            thumbnail="https://images.unsplash.com/photo-1742072594003-abf6ca86e154?w=1080",
            category="Development",
            level=CourseLevel.BEGINNER,
            duration="42h",
            students_enrolled=15678,
            rating=4.8,
            modules=[],
            organization_id="org-1",
            visibility=CourseVisibility.ASSIGNED,
            created_by="user-3"
        )
        
        course2 = Course(
            id="2",
            title="Data Science & Machine Learning",
            description="Learn Python, statistics, and machine learning algorithms.",
            instructor={"name": "Dr. Michael Chen", "avatar": "https://via.placeholder.com/150"},
            thumbnail="https://images.unsplash.com/photo-1718241905916-1f9786324de9?w=1080",
            category="Data Science",
            level=CourseLevel.INTERMEDIATE,
            duration="56h",
            students_enrolled=12450,
            rating=4.9,
            modules=[],
            organization_id="org-1",
            visibility=CourseVisibility.ASSIGNED,
            created_by="user-3"
        )
        
        db.add_all([course1, course2])
        
        # Create course assignments
        assignment1 = OrgCourse(
            id="oc-1",
            organization_id="org-1",
            course_id="1",
            assigned_to="all",
            mandatory=False,
            added_by="user-1"
        )
        
        assignment2 = OrgCourse(
            id="oc-2",
            organization_id="org-1",
            course_id="2",
            assigned_to="specific",
            assigned_departments=["Engineering"],
            mandatory=False,
            added_by="user-1"
        )
        
        db.add_all([assignment1, assignment2])
        
        db.commit()
        print("✅ Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
