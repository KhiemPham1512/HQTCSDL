# FILE: backend/app/database.py
import os
import urllib.parse
import pyodbc
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

load_dotenv()

DB_SERVER = os.getenv("DB_SERVER", r".\SQLEXPRESS")
DB_NAME = os.getenv("DB_NAME", "SmartHeritageDB")
USE_WINDOWS_AUTH = os.getenv("USE_WINDOWS_AUTH", "true").lower() == "true"
DB_USER = os.getenv("DB_USER", "sa")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

# Tự động chọn ODBC Driver của SQL Server có sẵn trên máy Windows
available_drivers = [d for d in pyodbc.drivers() if "SQL Server" in d]
DRIVER = available_drivers[-1] if available_drivers else "ODBC Driver 17 for SQL Server"

if USE_WINDOWS_AUTH:
    odbc_str = (
        f"DRIVER={{{DRIVER}}};"
        f"SERVER={DB_SERVER};"
        f"DATABASE={DB_NAME};"
        f"Trusted_Connection=yes;"
        f"TrustServerCertificate=yes;"
    )
else:
    odbc_str = (
        f"DRIVER={{{DRIVER}}};"
        f"SERVER={DB_SERVER};"
        f"DATABASE={DB_NAME};"
        f"UID={DB_USER};"
        f"PWD={DB_PASSWORD};"
        f"TrustServerCertificate=yes;"
    )

DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={urllib.parse.quote_plus(odbc_str)}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()