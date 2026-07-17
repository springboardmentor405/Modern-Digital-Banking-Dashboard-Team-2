from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Shared fields
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

# Used when creating a user (request body)
class UserCreate(UserBase):
    password: str

# Used when returning user data (response)
class UserResponse(UserBase):
    id: int
    kyc_status: str
    created_at: datetime

    class Config:
        from_attributes = True
