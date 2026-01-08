from pydantic import BaseModel

class BudgetCreate(BaseModel):
    category: str
    amount: float
    month: int
    year: int

class BudgetOut(BudgetCreate):
    id: int

    class Config:
        from_attributes = True
