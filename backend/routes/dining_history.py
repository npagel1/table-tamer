from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from databases import Database
from pydantic import BaseModel
from datetime import date
from ..models.dining_history import dining_history
from ..dependencies import get_database

router = APIRouter()

class DiningHistory(BaseModel):
    customer_id: int
    reservation_id: int
    visit_date: date

# Create a new dining history entry
@router.post("/dining_history/")
async def create_dining_history(dining_history_entry: DiningHistory, database: Database = Depends(get_database)):
    query = dining_history.insert().values(dining_history_entry.dict())
    last_record_id = await database.execute(query)
    return {"id": last_record_id}

# Read all dining history entries
@router.get("/dining_history/")
async def read_dining_history(database: Database = Depends(get_database)):
    query = dining_history.select()
    return await database.fetch_all(query)

# Get a specific dining history entry by ID
@router.get("/dining_history/{history_id}")
async def read_dining_history_entry(history_id: int, database: Database = Depends(get_database)):
    query = dining_history.select().where(dining_history.c.history_id == history_id)
    return await database.fetch_one(query)

# Update a dining history entry by ID
@router.put("/dining_history/{history_id}")
async def update_dining_history(history_id: int, dining_history_entry: DiningHistory, database: Database = Depends(get_database)):
    query = dining_history.update().where(dining_history.c.history_id == history_id).values(dining_history_entry.dict())
    await database.execute(query)
    return {"message": "Dining history updated successfully"}

# Delete a dining history entry by ID
@router.delete("/dining_history/{history_id}")
async def delete_dining_history(history_id: int, database: Database = Depends(get_database)):
    query = dining_history.delete().where(dining_history.c.history_id == history_id)
    await database.execute(query)
    return {"message": "Dining history deleted successfully"}