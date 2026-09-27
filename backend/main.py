from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Task(BaseModel):
    title: str


@app.get("/")
def home():
    return {"message": "Task Manager API"}


@app.get("/tasks")
def get_tasks():
    return [
        {"id": 1, "title": "Learn FastAPI"},
        {"id": 2, "title": "Learn React"}
    ]


@app.post("/tasks")
def create_task(task: Task):
    return {
        "message": "Task created",
        "task": task
    }