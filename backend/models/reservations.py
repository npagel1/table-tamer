from backend.config import DATABASE_URL
from sqlalchemy import Table, Column, Integer, String, Date, Time, ForeignKey, MetaData, UniqueConstraint, CheckConstraint, Sequence, create_engine

engine = create_engine(DATABASE_URL)
metadata = MetaData()

reservations = Table(
    "reservations",
    metadata,
    Column("reservation_id", Integer, Sequence('reservations_reservation_id_seq'), primary_key=True),
    Column("customer_id", Integer, ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False),
    Column("slot_id", Integer, ForeignKey("time_slots.slot_id", ondelete="CASCADE"), nullable=False),
    Column("reservation_date", Date, nullable=False),
    Column("status", String(20), nullable=False),
    Column("time_slot", Time, ForeignKey("time_slots.time_slot", ondelete="CASCADE"), nullable=False),
    Column("customer_name", String(50), ForeignKey("customers.customer_name", onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
)