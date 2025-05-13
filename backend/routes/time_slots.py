from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from databases import Database
from pydantic import BaseModel
from datetime import time
from ..models.time_slots import time_slots
from ..dependencies import get_database

router = APIRouter()

class TimeSlot(BaseModel):
    time_slot: time
    is_available: bool = True

# Create a new time slot
@router.post("/time_slots/")
async def create_time_slot(time_slot: TimeSlot, database: Database = Depends(get_database)):
    query = time_slots.insert().values(time_slot.dict())
    last_record_id = await database.execute(query)
    return {"id": last_record_id}

# Read all time slots
@router.get("/time_slots/")
async def read_time_slots(database: Database = Depends(get_database)):
    query = time_slots.select()
    return await database.fetch_all(query)

# Get a specific time slot by ID
@router.get("/time_slots/{slot_id}")
async def read_time_slot(slot_id: int, database: Database = Depends(get_database)):
    query = time_slots.select().where(time_slots.c.slot_id == slot_id)
    return await database.fetch_one(query)

# Update a time slot by ID
@router.put("/time_slots/{slot_id}")
async def update_time_slot(slot_id: int, time_slot: TimeSlot, database: Database = Depends(get_database)):
    query = time_slots.update().where(time_slots.c.slot_id == slot_id).values(time_slot.dict())
    await database.execute(query)
    return {"message": "Time slot updated successfully"}

# Delete a time slot by ID
@router.delete("/time_slots/{slot_id}")
async def delete_time_slot(slot_id: int, database: Database = Depends(get_database)):
    query = time_slots.delete().where(time_slots.c.slot_id == slot_id)
    await database.execute(query)
    return {"message": "Time slot deleted successfully"}