from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from databases import Database
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
from typing import Optional
from ..models.customers import customers
from ..dependencies import get_database
from ..models.reservations import reservations

router = APIRouter()

class Customer(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    password_hash: str
    created_at: datetime
    customer_pic: Optional[str] = None
    language: Optional[str] = None

    @validator("password_hash")
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one number.")
        if not any(char.isupper() for char in value):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not any(char.islower() for char in value):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not any(char in "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~" for char in value):
            raise ValueError("Password must contain at least one special character.")
        return value

# Create a new customer
@router.post("/customers/")
async def create_customer(customer: Customer, database: Database = Depends(get_database)):
    # Check if the phone number or email already exists
    query = customers.select().where(
        (customers.c.phone == customer.phone) | (customers.c.email == customer.email)
    )
    existing_customer = await database.fetch_one(query)
    
    if existing_customer:
        if existing_customer["phone"] == customer.phone:
            raise HTTPException(
                status_code=400,
                detail="A customer with this phone number already exists."
            )
        if existing_customer["email"] == customer.email:
            raise HTTPException(
                status_code=400,
                detail="A customer with this email address already exists."
            )
    
    # Insert the new customer if both phone and email are unique
    query = customers.insert().values(customer.dict())
    last_record_id = await database.execute(query)
    return {"id": last_record_id}

# Read all customers
@router.get("/customers/")
async def read_customers(database: Database = Depends(get_database)):
    query = customers.select()
    return await database.fetch_all(query)

# Get a specific customer by ID
@router.get("/customers/{customer_id}")
async def read_customer(customer_id: int, database: Database = Depends(get_database)):
    query = customers.select().where(customers.c.customer_id == customer_id)
    return await database.fetch_one(query)

# Update a customer by ID
@router.put("/customers/{customer_id}")
async def update_customer(customer_id: int, customer: Customer, database: Database = Depends(get_database)):
    query = customers.update().where(customers.c.customer_id == customer_id).values(customer.dict())
    await database.execute(query)
    return {"message": "Customer updated successfully"}

# Delete a customer by ID
@router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: int, database: Database = Depends(get_database)):
    query = customers.delete().where(customers.c.customer_id == customer_id)
    await database.execute(query)
    return {"message": "Customer deleted successfully"}

# Check if a customer has a reservation
@router.get("/customers/{customer_id}/has-reservation")
async def customer_has_reservation(customer_id: int, database: Database = Depends(get_database)):
    query = select(reservations.c.customer_id) \
        .where(reservations.c.customer_id == customer_id).limit(1) \
        .where(reservations.c.status == "Confirmed")
    result = await database.fetch_one(query)
    return {"hasReservation": result is not None}

# Get customer reservation count
@router.get("/customers/{customer_id}/reservation-count")
async def customer_reservation_count(customer_id: int, database: Database = Depends(get_database)):
    query = select(reservations.c.customer_id) \
        .where(reservations.c.customer_id == customer_id) \
        .where(reservations.c.status == "Confirmed")
    result = await database.fetch_all(query)
    return {"reservationCount": len(result)}