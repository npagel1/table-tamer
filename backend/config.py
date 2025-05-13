from sqlalchemy import create_engine, MetaData

# Database configuration
DATABASE_URL = "postgresql://postgres:test1234@tabletamer.c5ygki0ec21d.us-east-2.rds.amazonaws.com:5432/tableTamer"  # Connection string for the database

# Application settings
DEBUG = True  # Enable or disable debug mode (use False in production)
APP_NAME = "Table Tamer"  # Name of the application
APP_VERSION = "1.0.0"  # Version of the application

# Logging configuration
LOGGING_LEVEL = "INFO"  # Logging level (e.g., DEBUG, INFO, WARNING, ERROR)

engine = create_engine(DATABASE_URL)
