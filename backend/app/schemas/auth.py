from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    title: Optional[str] = None


class UserCreate(UserBase):
    password: str
    organization_id: Optional[str] = None


class UserResponse(UserBase):
    id: str
    organization_id: Optional[str] = None
    org_role: Optional[str] = None
    department: Optional[str] = None
    preferences: dict
    stats: dict
    created_at: datetime

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    user: UserResponse
    organization: Optional[dict] = None
    membership: Optional[dict] = None
    org_courses: list = []
    token: str
