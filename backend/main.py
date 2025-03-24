from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
from pydantic import BaseModel
from bson import ObjectId
from database import students_collection
import uuid
import json
from datetime import datetime
from collections import defaultdict

app = FastAPI()

# Enable CORS for Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connected users and pairs for WebSocket
connected_users: Dict[str, WebSocket] = {}
connected_pairs: Dict[str, str] = {}

@app.get("/generate-id")
def generate_id():
    user_id = str(uuid.uuid4())[:8]
    return {"userId": user_id}

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    connected_users[user_id] = websocket
    print(f"User {user_id} connected")

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            target_user_id = message.get("targetUserId")
            message_text = message.get("message")

            if message.get("connect_request"):
                if target_user_id in connected_users:
                    connected_pairs[user_id] = target_user_id
                    connected_pairs[target_user_id] = user_id
                    await connected_users[user_id].send_text(f"Connected with {target_user_id}")
                    await connected_users[target_user_id].send_text(f"Connected with {user_id}")
                else:
                    await websocket.send_text(f"User {target_user_id} is not connected")

            elif (
                user_id in connected_pairs
                and connected_pairs[user_id] == target_user_id
            ):
                if target_user_id in connected_users:
                    await connected_users[target_user_id].send_text(f"{user_id}: {message_text}")
                    await websocket.send_text(f"Me: {message_text}")
            else:
                await websocket.send_text("You are not connected to any user.")

    except WebSocketDisconnect:
        print(f"User {user_id} disconnected")
        if user_id in connected_users:
            del connected_users[user_id]
        if user_id in connected_pairs:
            pair = connected_pairs.pop(user_id)
            connected_pairs.pop(pair, None)
            if pair in connected_users:
                await connected_users[pair].send_text(f"User {user_id} has disconnected")

# ✅ Student Model
class Student(BaseModel):
    name: str
    class_: str
    marks: int

# ✅ Add Student
# ✅ Add student to MongoDB
@app.post("/add-student/")
async def add_student(student: Student):
    student_dict = student.dict()
    students_collection.insert_one(student_dict)
    return {"message": "Student added successfully"}

# ✅ Get all students
@app.get("/students/", response_model=List[Student])
async def get_students():
    students = list(students_collection.find({}, {'_id': 0}))
    return students

# ✅ Filter students by query (name or class)
@app.get("/students/filter/")
async def filter_students(query: str):
    students = list(students_collection.find(
        {
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"class_": {"$regex": query, "$options": "i"}}
            ]
        },
        {'_id': 0}
    ))
    return students


tracking_data = []

# Model for incoming data
class TrackingData(BaseModel):
    url: str
    time_spent: int  # Time spent in seconds

# Endpoint to store tracking data
@app.post("/add-tracking-data")
async def add_tracking_data(data: TrackingData):
    tracking_data.append(data)
    return {"status": "success"}

# Endpoint to get tracking data
@app.get("/get-tracking-data")
async def get_tracking_data():
    return tracking_data


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
