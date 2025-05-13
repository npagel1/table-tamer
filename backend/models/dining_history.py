from backend.config import DATABASE_URL
from sqlalchemy import Table, Column, Integer, Date, ForeignKey, MetaData, create_engine

engine = create_engine(DATABASE_URL)
metadata = MetaData()

dining_history = Table(
    "dining_history",
    metadata,
    Column("history_id", Integer, primary_key=True),
    Column("customer_id", Integer, ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False),
    Column("reservation_id", Integer, ForeignKey("reservations.reservation_id", ondelete="CASCADE"), nullable=False),
    Column("visit_date", Date, nullable=False)
)