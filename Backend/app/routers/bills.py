from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
from datetime import date
from app.services.bill_reminder_service import send_single_bill_reminder
from app.db.models import Transaction
from datetime import datetime
from app.services.bill_reminder_service import check_and_send_overdue_reminders



from app.db.session import get_db
from app.db.models import Bill
from app.schemas.bill import BillCreate, BillUpdate
from app.db.models import Reward


# ✅ router MUST be defined BEFORE using it
router = APIRouter(prefix="/bills", tags=["Bills"])


@router.get("/")
def get_bills(db: Session = Depends(get_db)):
    return db.query(Bill).all()


@router.post("/")
def create_bill(bill: BillCreate, db: Session = Depends(get_db)):
    new_bill = Bill(
        title=bill.title,
        amount=bill.amount,
        due_date=bill.due_date,
        category=bill.category,

        # backend-controlled fields
        is_paid=False,
        reminder=False
    )
    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)

    # ✅ IMMEDIATE CHECK AFTER CREATION
    if new_bill.due_date <= date.today() and not new_bill.is_paid:
        send_single_bill_reminder(new_bill)

    return new_bill

@router.patch("/{bill_id}/mark-paid")
def mark_bill_paid(bill_id: int, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    if bill.is_paid:
        return {"message": "Bill already paid"}

    # 1️⃣ Mark bill as paid
    bill.is_paid = True
    bill.reminder = True

    # 2️⃣ Create transaction
    transaction = Transaction(
        user_id=1,
        description=bill.title,
        amount=bill.amount,
        type="Expense",     # ✅ MATCHES DB
        category=bill.category,
        date=datetime.utcnow()
    )
    db.add(transaction)

    # 3️⃣ Rewards
    reward = db.query(Reward).filter(Reward.user_id == 1).first()
    if not reward:
        reward = Reward(user_id=1, points=0)
        db.add(reward)
    reward.points += 10

    db.commit()
    db.refresh(bill)

    return {"message": "Bill marked as paid successfully"}


@router.delete("/{bill_id}")
def delete_bill(bill_id: int, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    db.delete(bill)
    db.commit()
    return {"message": "Bill deleted"}


@router.get("/bills")
def get_bills(db: Session = Depends(get_db)):
    check_and_send_overdue_reminders(db)
    return db.query(Bill).all()




# ✅ THIS IS THE UPDATE ROUTE (ADD THIS AT THE END)
@router.put("/{bill_id}")
def update_bill(bill_id: int, bill_data: BillUpdate, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()

    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    bill.title = bill_data.title
    bill.amount = bill_data.amount
    bill.due_date = bill_data.due_date  # 🔴 THIS LINE MUST EXIST
    bill.category = bill_data.category
    bill.frequency = bill_data.frequency
    bill.reminder = bill_data.reminder

    db.commit()
    db.refresh(bill)

    return bill

@router.post("/send-overdue-reminders")
def send_overdue_reminders(db: Session = Depends(get_db)):
    check_and_send_overdue_reminders(db)
    return {"message": "Overdue reminder emails sent"}

  # ✅ Commit ONCE at the end
    db.commit()
    db.refresh(bill)