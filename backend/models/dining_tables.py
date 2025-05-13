from backend.config import DATABASE_URL
from sqlalchemy import Table, Column, Integer, MetaData, create_engine

engine = create_engine(DATABASE_URL)
metadata = MetaData()

dining_tables = Table(
    "dining_tables",
    metadata,
    Column("table_id", Integer, primary_key=True),
    Column("capacity", Integer, nullable=False)
)