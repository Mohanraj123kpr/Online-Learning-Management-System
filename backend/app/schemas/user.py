from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    social_links: Optional[dict] = None


class UserPreferencesUpdate(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    emailNotifications: Optional[bool] = None
    pushNotifications: Optional[bool] = None
    courseUpdates: Optional[bool] = None
    weeklyDigest: Optional[bool] = None
    marketingEmails: Optional[bool] = None
    autoPlayVideos: Optional[bool] = None
    videoQuality: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    social_links: dict
    preferences: dict
    stats: dict
    created_at: datetime

    class Config:
        from_attributes = True


class LearningGoal(BaseModel):
    id: str
    title: str
    targetDate: datetime
    progress: int
    completed: bool


class LearningGoalCreate(BaseModel):
    title: str
    targetDate: datetime
    progress: int = 0
    completed: bool = False


class LearningGoalUpdate(BaseModel):
    title: Optional[str] = None
    targetDate: Optional[datetime] = None
    progress: Optional[int] = None
    completed: Optional[bool] = None
