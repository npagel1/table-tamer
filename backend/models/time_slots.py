from backend.config import DATABASE_URL
from sqlalchemy import Table, Column, Integer, Time, Boolean, MetaData, create_engine

engine = create_engine(DATABASE_URL)
metadata = MetaData()

time_slots = Table(
    "time_slots",
    metadata,
    Column("slot_id", Integer, primary_key=True),
    Column("time_slot", Time, nullable=False),
    Column("is_available", Boolean, default=True)
)