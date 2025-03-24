from pydantic import BaseModel

class Message(BaseModel):
    username: str
    content: str
    timestamp: str
