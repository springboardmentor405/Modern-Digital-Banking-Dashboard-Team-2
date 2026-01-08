from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.db.models import Budget, Transaction
from app.schemas.budget import BudgetCreate, BudgetOut

router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"]
)

@router.post("/", response_model=BudgetOut)
def create_budget(payload: BudgetCreate, db: Session = Depends(get_db)):
    budget = Budget(**payload.dict())
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.get("/", response_model=List[BudgetOut])
def get_budgets(db: Session = Depends(get_db)):
    return db.query(Budget).all()


@router.put("/{budget_id}", response_model=BudgetOut)
def update_budget(
    budget_id: int,
    payload: BudgetCreate,
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        return {"error": "Budget not found"}

    for key, value in payload.dict().items():
        setattr(budget, key, value)

    db.commit()
    db.refresh(budget)
    return budget


from sqlalchemy import extract

@router.get("/summary/{month}/{year}")
def budget_summary(month: int, year: int, db: Session = Depends(get_db)):
    budgets = db.query(Budget).filter(
        Budget.month == month,
        Budget.year == year
    ).all()

    result = []

    for b in budgets:
        spent = db.query(Transaction).filter(
            Transaction.category == b.category,
            Transaction.type == "Expense",
            extract("month", Transaction.date) == month,
            extract("year", Transaction.date) == year
        ).all()

        total_spent = sum(abs(t.amount) for t in spent)

        result.append({
            "category": b.category,
            "budget": b.amount,
            "spent": total_spent,
            "remaining": b.amount - total_spent,
            "exceeded": total_spent > b.amount
        })

    return result
