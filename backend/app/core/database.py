from sqlmodel import SQLModel, create_engine
from config import settings

# Use the DATABASE_URL from config (Supabase/PostgreSQL)
# We need to replace postgres:// with postgresql:// for SQLAlchemy if needed
# Supabase usually gives postgresql:// but just in case
database_url = settings.DATABASE_URL
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

# connect_args={"check_same_thread": False} is ONLY for SQLite
# For PostgreSQL, we remove it.
engine = create_engine(database_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    from sqlmodel import Session
    with Session(engine) as session:
        yield session
