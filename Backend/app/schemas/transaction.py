from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionBase(BaseModel):
    description: str
    amount: float
    type: str
    category: Optional[str] = None
    date: datetime

class TransactionCreate(TransactionBase):
    pass

class TransactionOut(TransactionBase):
    id: int

    class Config:
        from_attributes = True


class CategoryUpdate(BaseModel):
    category: str
