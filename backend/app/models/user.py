from sqlalchemy import Column, String, Boolean, DateTime, JSON
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    title = Column(String, nullable=True)
    location = Column(String, nullable=True)
    website = Column(String, nullable=True)
    social_links = Column(JSON, default={})
    preferences = Column(JSON, default={})
    stats = Column(JSON, default={})
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
