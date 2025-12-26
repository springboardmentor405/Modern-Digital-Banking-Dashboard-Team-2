from datetime import datetime, timedelta
import random

OTP_EXPIRY_MINUTES = 5


def generate_otp() -> str:
    """Generate 6-digit OTP"""
    return str(random.randint(100000, 999999))


def otp_expiry() -> datetime:
    """Return OTP expiry time"""
    return datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
