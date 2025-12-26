import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# 🔐 Load from .env
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


def send_otp_email(to_email: str, otp: str):
    """
    Sends OTP email for password reset
    """

    if not SMTP_EMAIL or not SMTP_PASSWORD:
        raise Exception("SMTP credentials not configured in .env")

    # 📧 Create email
    msg = MIMEMultipart()
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg["Subject"] = "Password Reset OTP"

    body = f"""
Hello,

Your OTP for password reset is:

👉 {otp}

This OTP is valid for 5 minutes.
Do not share it with anyone.

If you did not request this, please ignore this email.

— Banking Dashboard Team
"""
    msg.attach(MIMEText(body, "plain"))

    server = None

    try:
        # 🔗 Connect to Gmail SMTP
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)

        # 📤 Send email
        server.send_message(msg)

    except Exception as e:
        print("Email sending failed:", e)
        raise Exception("Failed to send OTP email")

    finally:
        if server:
            server.quit()
