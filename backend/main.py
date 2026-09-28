# from fastapi import FastAPI, Depends
# from pydantic import BaseModel
# from sqlalchemy.orm import Session

# from database import engine, Base, get_db
# from models import Task

# app = FastAPI()

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import Task

from models import Task, User
from auth import hash_password, verify_password, create_access_token
from schemas import UserCreate, UserLogin

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)



# Create database tables
Base.metadata.create_all(bind=engine)


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        return {"message": "Invalid email or password"}

    if not verify_password(
        user.password,
        existing_user.password_hash
    ):
        return {"message": "Invalid email or password"}

    access_token = create_access_token(existing_user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    
        

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        return {"message": "Email already registered"}

    hashed_password = hash_password(user.password)

    new_user = User(
        email=user.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "email": new_user.email
    }
    


# Pydantic schema
class TaskCreate(BaseModel):
    title: str


@app.get("/")
def home():
    return {"message": "Task Manager API"}


@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks    


@app.post("/tasks")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
):
    new_task = Task(title=task.title)

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


# update task -- put

@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    task_data: TaskCreate,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        return {"message": "Task not found"}

    task.title = task_data.title

    db.commit()
    db.refresh(task)

    return task


# delete task -- delete
@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        return {"message": "Task not found"}

    db.delete(task)
    db.commit()

    return {"message": "Task deleted"}