from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from databases import Database
from pydantic import BaseModel, EmailStr
from datetime import datetime
from ..models.notifications import notifications
from ..dependencies import get_database

router = APIRouter()

class Notification(BaseModel):
    customer_id: int
    reservation_id: int
    notification_type: str
    sent_at: datetime = None

# Notifications routes
router = APIRouter(prefix="/notifications")

# Create a new notification
@router.post("/notifications/")
async def create_notification(notification: Notification, database: Database = Depends(get_database)):
    if notification.sent_at is None:
        notification.sent_at = datetime.utcnow()
    query = notifications.insert().values(notification.dict())
    last_record_id = await database.execute(query)
    return {"id": last_record_id}

# Get all notifications
@router.get("/notifications/")
async def read_notifications(database: Database = Depends(get_database)):
    query = notifications.select()
    return await database.fetch_all(query)

# Get notification by ID
@router.get("/notifications/{notification_id}")
async def read_notification(notification_id: int, database: Database = Depends(get_database)):
    query = notifications.select().where(notifications.c.notification_id == notification_id)
    return await database.fetch_one(query)

# Update notification by ID
@router.put("/notifications/{notification_id}")
async def update_notification(notification_id: int, notification: Notification, database: Database = Depends(get_database)):
    query = notifications.update().where(notifications.c.notification_id == notification_id).values(notification.dict())
    await database.execute(query)
    return {"message": "Notification updated successfully"}

# Delete notification by ID
@router.delete("/notifications/{notification_id}")
async def delete_notification(notification_id: int, database: Database = Depends(get_database)):
    query = notifications.delete().where(notifications.c.notification_id == notification_id)
    await database.execute(query)
    return {"message": "Notification deleted successfully"}