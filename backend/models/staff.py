from backend.config import DATABASE_URL
from sqlalchemy import Table, Column, Integer, String, MetaData, create_engine

engine = create_engine(DATABASE_URL)
metadata = MetaData()

staff = Table(
    "staff",
    metadata,
    Column("staff_id", Integer, primary_key=True),
    Column("staff_name", String(50), nullable=False),
    Column("email", String(50), unique=True, nullable=False),
    Column("staff_role", String(15), nullable=False),
    Column("password_hash", String, nullable=False),
    Column("phone", String(20), nullable=False),
    Column("staff_pic", String, nullable=True),
    Column("language", String, nullable=True),
)