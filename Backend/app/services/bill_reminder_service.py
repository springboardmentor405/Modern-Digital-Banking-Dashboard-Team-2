from datetime import date
from sqlalchemy.orm import Session
from app.db.models import Bill
from app.emails.bill_overdue import send_bill_overdue_email

ADMIN_EMAIL = "polojutarun7@gmail.com"  # temporary for testing

def check_and_send_overdue_reminders(db: Session):
    today = date.today()

    overdue_bills = db.query(Bill).filter(
        Bill.due_date <= today,
        Bill.is_paid == False
    ).all()

    for bill in overdue_bills:
        send_bill_overdue_email(
            to_email=ADMIN_EMAIL,   # fixed target
            bill_title=bill.title,
            amount=bill.amount,
            due_date=bill.due_date
        )

def send_single_bill_reminder(bill):
    send_bill_overdue_email(
        to_email=ADMIN_EMAIL,
        bill_title=bill.title,
        amount=bill.amount,
        due_date=bill.due_date
    )