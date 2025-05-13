from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from databases import Database
from pydantic import BaseModel, EmailStr
from ..models.staff import staff
from ..dependencies import get_database

router = APIRouter()

class Staff(BaseModel):
    staff_name: str
    email: EmailStr
    staff_role: str
    password_hash: str
    phone: str
    staff_pic: str
    language: str

# Create a new staff member
@router.post("/staff/")
async def create_staff(staff_member: Staff, database: Database = Depends(get_database)):
    query = staff.insert().values(staff_member.dict())
    last_record_id = await database.execute(query)
    return {"id": last_record_id}

# Read all staff members
@router.get("/staff/")
async def read_staff(database: Database = Depends(get_database)):
    query = staff.select()
    return await database.fetch_all(query)

# Get a specific staff member by ID
@router.get("/staff/{staff_id}")
async def read_staff_member(staff_id: int, database: Database = Depends(get_database)):
    query = staff.select().where(staff.c.staff_id == staff_id)
    return await database.fetch_one(query)

# Update a staff member by ID
@router.put("/staff/{staff_id}")
async def update_staff(staff_id: int, staff_member: Staff, database: Database = Depends(get_database)):
    query = staff.update().where(staff.c.staff_id == staff_id).values(staff_member.dict())
    await database.execute(query)
    return {"message": "Staff member updated successfully"}

# Delete a staff member by ID
@router.delete("/staff/{staff_id}")
async def delete_staff(staff_id: int, database: Database = Depends(get_database)):
    query = staff.delete().where(staff.c.staff_id == staff_id)
    await database.execute(query)
    return {"message": "Staff member deleted successfully"}