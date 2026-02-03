import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email: str, subject: str, body: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")

    # ✅ DEBUG PRINTS (NOW CORRECT)
    print("SMTP_HOST:", smtp_host)
    print("SMTP_PORT:", smtp_port)
    print("SMTP_EMAIL:", smtp_email)
    print("SMTP_PASSWORD SET:", bool(smtp_password))

    if not all([smtp_host, smtp_port, smtp_email, smtp_password]):
        raise RuntimeError("SMTP environment variables are not fully set")

    smtp_port = int(smtp_port)

    msg = MIMEMultipart()
    msg["From"] = smtp_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.send_message(msg)

    print(f"✅ Email sent to {to_email}")