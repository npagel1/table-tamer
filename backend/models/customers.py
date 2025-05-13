from backend.config import DATABASE_URL
from sqlalchemy import Table, Column, Integer, String, DateTime, MetaData, create_engine, func
from sqlalchemy.dialects.postgresql import JSON

engine = create_engine(DATABASE_URL)
metadata = MetaData()

customers = Table(
    "customers",
    metadata,
    Column("customer_id", Integer, primary_key=True, autoincrement=True),
    Column("customer_name", String(50), unique=True, nullable=False),
    Column("email", String(50), unique=True, nullable=False),
    Column("phone", String(20), unique=True, nullable=False),
    Column("password_hash", String, nullable=False),
    Column("created_at", DateTime, default="CURRENT_TIMESTAMP"),
    Column("customer_pic", String, nullable=True),
    Column("language", String, nullable=True)
)