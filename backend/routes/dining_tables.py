from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from databases import Database
from pydantic import BaseModel
from ..models.dining_tables import dining_tables
from ..dependencies import get_database

router = APIRouter()

class DiningTable(BaseModel):
    table_id: int
    capacity: int

# Create a new dining table
@router.post("/dining_tables/")
async def create_dining_table(dining_table: DiningTable, database: Database = Depends(get_database)):
    query = dining_tables.insert().values(dining_table.dict())
    last_record_id = await database.execute(query)
    return {"id": last_record_id}

# Read all dining tables
@router.get("/dining_tables/")
async def read_dining_tables(database: Database = Depends(get_database)):
    query = dining_tables.select()
    return await database.fetch_all(query)

# Get a specific dining table by ID
@router.get("/dining_tables/{table_id}")
async def read_dining_table(table_id: int, database: Database = Depends(get_database)):
    query = dining_tables.select().where(dining_tables.c.table_id == table_id)
    return await database.fetch_one(query)

# Update a dining table by ID
@router.put("/dining_tables/{table_id}")
async def update_dining_table(table_id: int, dining_table: DiningTable, database: Database = Depends(get_database)):
    query = dining_tables.update().where(dining_tables.c.table_id == table_id).values(dining_table.dict())
    await database.execute(query)
    return {"message": "Dining table updated successfully"}

# Delete a dining table by ID
@router.delete("/dining_tables/{table_id}")
async def delete_dining_table(table_id: int, database: Database = Depends(get_database)):
    query = dining_tables.delete().where(dining_tables.c.table_id == table_id)
    await database.execute(query)
    return {"message": "Dining table deleted successfully"}