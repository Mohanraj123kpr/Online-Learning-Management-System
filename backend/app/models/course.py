from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, Text, Enum as SQLEnum
from datetime import datetime
import enum
from app.core.database import Base


class CourseLevel(str, enum.Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class CourseVisibility(str, enum.Enum):
    PUBLIC = "public"
    ORGANIZATION = "organization"
    ASSIGNED = "assigned"


class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    instructor = Column(JSON, nullable=False)  # {name, avatar}
    thumbnail = Column(String, nullable=True)
    category = Column(String, nullable=False, index=True)
    level = Column(SQLEnum(CourseLevel), default=CourseLevel.BEGINNER)
    duration = Column(String, nullable=False)
    students_enrolled = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    modules = Column(JSON, default=[])
    price = Column(Float, nullable=True)
    organization_id = Column(String, nullable=True, index=True)
    visibility = Column(SQLEnum(CourseVisibility), default=CourseVisibility.ASSIGNED)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    course_id = Column(String, nullable=False, index=True)
    completed_lessons = Column(JSON, default=[])
    last_accessed_lesson = Column(String, nullable=True)
    progress = Column(Integer, default=0)
    video_timestamps = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Note(Base):
    __tablename__ = "notes"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    course_id = Column(String, nullable=False, index=True)
    lesson_id = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    course_id = Column(String, nullable=False, index=True)
    course_name = Column(String, nullable=False)
    student_name = Column(String, nullable=False)
    completion_date = Column(DateTime, default=datetime.utcnow)
    instructor = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
