from pymongo import MongoClient

# MongoDB connection URL
client = MongoClient("mongodb://localhost:27017/")
db = client["studentdb"]
students_collection = db["students"]
