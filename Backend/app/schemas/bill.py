from pydantic import BaseModel
from datetime import date
from typing import Optional

class BillBase(BaseModel):
    title: str
    amount: float
    due_date: date
    category: str

class BillCreate(BillBase):
    pass

class BillOut(BillBase):
    id: int
    is_paid: bool

class Config:
        from_attributes = True
        
class BillUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[date] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    reminder: Optional[bool] = None