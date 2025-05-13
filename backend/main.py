import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from databases import Database
from .config import DATABASE_URL  # Use relative import
from .dependencies import database
from .routes import customers as customers_routes
from .routes import dining_tables as dining_tables_routes
from .routes import reservations as reservations_routes
from .routes import dining_history as dining_history_routes
from .routes import time_slots as time_slots_routes
from .routes import staff as staff_routes
from .routes import notifications as notifications_routes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
async def read_root():
    return {"Hello": "World"}


# Include routes
logger.info("Including routes")
app.include_router(customers_routes.router, prefix="/api")
app.include_router(dining_tables_routes.router, prefix="/api")
app.include_router(reservations_routes.router, prefix="/api")
app.include_router(dining_history_routes.router, prefix="/api")
app.include_router(time_slots_routes.router, prefix="/api")
app.include_router(staff_routes.router, prefix="/api")
app.include_router(notifications_routes.router, prefix="/api")
logger.info("Routes included")