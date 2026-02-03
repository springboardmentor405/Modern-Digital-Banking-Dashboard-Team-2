from app.utils.email import send_email

def send_bill_overdue_email(to_email: str, bill_title: str, amount: float, due_date):
    subject = "Overdue Bill Reminder"
    body = (
        f"Your bill '{bill_title}' of amount ₹{amount} "
        f"was due on {due_date}. Please pay it as soon as possible."
    )

    send_email(to_email, subject, body)