from backend.config import DATABASE_URL
from sqlalchemy import Table, Column, Integer, String, DateTime, ForeignKey, MetaData, create_engine

engine = create_engine(DATABASE_URL)
metadata = MetaData()

notifications = Table(
    "notifications",
    metadata,
    Column("notification_id", Integer, primary_key=True),
    Column("customer_id", Integer, ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False),
    Column("reservation_id", Integer, ForeignKey("reservations.reservation_id", ondelete="CASCADE"), nullable=False),
    Column("notification_type", String(50), nullable=False),
    Column("sent_at", DateTime, default="CURRENT_TIMESTAMP")
)