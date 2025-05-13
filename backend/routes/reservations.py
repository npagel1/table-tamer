from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from databases import Database
from pydantic import BaseModel, Field
from datetime import date, datetime, time
from typing import List, Dict, Optional

from ..models.reservations import reservations
from ..dependencies import get_database

router = APIRouter()

class Reservation(BaseModel):
    customer_id: int
    slot_id: int
    reservation_date: date
    status: str
    time_slot: time
    customer_name: str

async def check_availability(db: Database, reservation_date: date, time_slot: time):
    """
    Checks if the table is available at the requested date and slot.

    Returns:
        bool: True if available, False if not available.
    """
    query = select(reservations.c.reservation_id).where(
        reservations.c.reservation_date == reservation_date,
        reservations.c.time_slot == time_slot,
        reservations.c.status == "Confirmed"  # Only consider confirmed reservations
    )
    existing_reservation = await db.fetch_one(query)
    
    return existing_reservation is None  # If None, the slot is available

# Create a new reservation
@router.post("/reservations/")
async def create_reservation(reservation: Reservation, database: Database = Depends(get_database)):
    # Check if the requested table and slot are available
    is_available = await check_availability(database, reservation.reservation_date, reservation.time_slot)
    
    if not is_available:
        raise HTTPException(status_code=400, detail="This time slot is already booked. Please choose another one.")
    
    query = reservations.insert().values(
        customer_id=reservation.customer_id,
        slot_id=reservation.slot_id,
        time_slot=reservation.time_slot,
        reservation_date=reservation.reservation_date,
        status=reservation.status,
        customer_name=reservation.customer_name
    )
    last_record_id = await database.execute(query)
    return {"id": last_record_id}

# Read all reservations
@router.get("/reservations/")
async def read_reservations(database: Database = Depends(get_database)):
    query = reservations.select()
    return await database.fetch_all(query)

# Get a specific reservation by ID
@router.get("/reservations/{reservation_id}")
async def read_reservation(reservation_id: int, database: Database = Depends(get_database)):
    query = reservations.select().where(reservations.c.reservation_id == reservation_id)
    return await database.fetch_one(query)

# Update a reservation by ID
@router.put("/reservations/{reservation_id}")
async def update_reservation(reservation_id: int, reservation: Reservation, database: Database = Depends(get_database)):
    query = reservations.update().where(reservations.c.reservation_id == reservation_id).values(reservation.dict())
    await database.execute(query)
    return {"message": "Reservation updated successfully"}

# Delete a reservation by ID
@router.delete("/reservations/{reservation_id}")
async def delete_reservation(reservation_id: int, database: Database = Depends(get_database)):
    query = reservations.delete().where(reservations.c.reservation_id == reservation_id)
    await database.execute(query)
    return {"message": "Reservation deleted successfully"}

# Get all of the reservations for a single customer
@router.get("/reservations/customer/{customer_id}")
async def read_customer_reservations(customer_id: int, database: Database = Depends(get_database)):
    query = reservations.select().where(reservations.c.customer_id == customer_id)
    return await database.fetch_all(query)

