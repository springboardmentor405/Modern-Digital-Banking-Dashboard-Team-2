from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import csv
from datetime import datetime

from app.db.session import get_db
from app.db.models import Transaction
from app.schemas.transaction import (
    TransactionOut,
    TransactionCreate,
    CategoryUpdate,
)
from app.core.category_rules import auto_categorize

router = APIRouter(prefix="/transactions", tags=["Transactions"])


# =========================
# CREATE TRANSACTION
# =========================
@router.post("/", response_model=TransactionOut)
def create_transaction(
    payload: TransactionCreate,
    db: Session = Depends(get_db),
):
    txn = Transaction(
        description=payload.description,
        amount=payload.amount if payload.type == "Income" else -abs(payload.amount),
        type=payload.type,
        category=payload.category or auto_categorize(payload.description),
        date=payload.date or datetime.utcnow(),
        user_id=1,  # temp
    )

    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


# =========================
# GET TRANSACTIONS
# =========================
@router.get("/", response_model=List[TransactionOut])
def get_transactions(db: Session = Depends(get_db)):
    return (
        db.query(Transaction)
        .order_by(Transaction.date.desc())
        .all()
    )


# =========================
# UPDATE CATEGORY
# =========================
@router.put("/{transaction_id}/category")
def update_transaction_category(
    transaction_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
):
    txn = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not txn:
        return {"error": "Transaction not found"}

    txn.category = payload.category
    db.commit()
    return {"message": "Category updated"}


# =========================
# AUTO CATEGORIZE
# =========================
@router.post("/auto-categorize")
def auto_categorize_all(db: Session = Depends(get_db)):
    txns = db.query(Transaction).all()
    updated = 0

    for txn in txns:
        if txn.category == "Uncategorized":
            new_cat = auto_categorize(txn.description)
            if new_cat != "Uncategorized":
                txn.category = new_cat
                updated += 1

    db.commit()
    return {"message": f"{updated} transactions auto-categorized"}


# =========================
# CSV IMPORT
# =========================
@router.post("/import-csv")
def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    reader = csv.DictReader((line.decode() for line in file.file))
    count = 0

    for row in reader:
        # Parse date safely (CSV: YYYY-MM-DD)
        try:
            parsed_date = datetime.strptime(row["Date"], "%Y-%m-%d")
        except Exception:
            parsed_date = datetime.utcnow()

        txn = Transaction(
            description=row["Description"],
            amount=float(row["Amount"])
            if row["Type"] == "Income"
            else -abs(float(row["Amount"])),
            type=row["Type"],
            category=auto_categorize(row["Description"]),
            date=parsed_date,
            user_id=1,
        )

        db.add(txn)
        count += 1

    db.commit()
    return {"message": f"{count} transactions imported"}
