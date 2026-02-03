from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, DateTime, Float, Date 
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime
from datetime import date

# ======================
# REWARDS
# ======================
class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    points = Column(Integer, default=0)

# ======================
# BILLS
# ======================

class Bill(Base):
    __tablename__ = "bills"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=True)
    category = Column(String, nullable=True)

    frequency = Column(String, default="One-time")  # ✅ ADD THIS

    reminder = Column(Boolean, default=False)
    is_paid = Column(Boolean, default=False)

# ======================
# USERS TABLE
# ======================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    accounts = relationship("Account", back_populates="user")


# ======================
# BUDGETS
# ======================

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# ======================
# TRANSACTIONS 
# ======================

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)   # link later to user
    date = Column(DateTime, default=datetime.utcnow)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False)   # Income / Expense
    category = Column(String, default="Uncategorized")


# ======================
# ACCOUNTS TABLE
# ======================
class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    account_name = Column(String(100), nullable=False)
    account_type = Column(String(50), nullable=False)
    balance = Column(Numeric, default=0)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="accounts")


# ======================
# PASSWORD RESET (OTP)
# ======================
class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), index=True, nullable=False)
    otp = Column(String(6), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
