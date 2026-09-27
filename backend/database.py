from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:%40ditya2104@localhost:5432/taskdb"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# Every request needs a database connection/session:
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()