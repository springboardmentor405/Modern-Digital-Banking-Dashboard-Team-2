from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import SessionLocal
from app.db.models import User, PasswordReset
from app.schemas.user import UserCreate
from app.schemas.token import Token
from app.schemas.password_reset import (
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest
)
from app.core.security import hash_password, verify_password, create_access_token
from app.core.otp_utils import generate_otp, otp_expiry

from app.core.mailer import send_otp_email


router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- SIGNUP ----------------
@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}


# ---------------- LOGIN ----------------
@router.post("/login", response_model=Token)
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


# ---------------- FORGOT PASSWORD ----------------
@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()
    expiry = otp_expiry()

    db.query(PasswordReset).filter(
        PasswordReset.email == data.email
    ).delete()

    reset = PasswordReset(
        email=data.email,
        otp=otp,
        expires_at=expiry
    )
    db.add(reset)
    db.commit()

    send_otp_email(data.email, otp)
    return {"message": "OTP sent to email"}


# ---------------- VERIFY OTP ----------------
@router.post("/verify-otp")
def verify_otp(data: VerifyOTPRequest, db: Session = Depends(get_db)):
    record = db.query(PasswordReset).filter(
        PasswordReset.email == data.email,
        PasswordReset.otp == data.otp
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")

    return {"message": "OTP verified"}


# ---------------- RESET PASSWORD ----------------
@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(data.new_password)
    db.commit()

    db.query(PasswordReset).filter(
        PasswordReset.email == data.email
    ).delete()
    db.commit()

    return {"message": "Password reset successful"}
