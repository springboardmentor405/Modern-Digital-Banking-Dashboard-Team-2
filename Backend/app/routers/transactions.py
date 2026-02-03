from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.db.session import get_db
from app.db.models import Transaction
from app.schemas.transaction import TransactionCreate

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


@router.post("/")
def add_transaction(tx: TransactionCreate, db: Session = Depends(get_db)):
    transaction = Transaction(
        type=tx.type,
        amount=tx.amount,
        category=tx.category,
        description=tx.description,
        date=tx.date or date.today(),
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction


@router.get("/")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).order_by(Transaction.date.desc()).all()