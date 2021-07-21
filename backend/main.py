from fastapi import FastAPI
from fastapi_users import FastAPIUsers, models
from fastapi_users.db import MongoDBUserDatabase
import uvicorn
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

from fastapi.middleware.cors import CORSMiddleware
from fastapi_users.authentication import JWTAuthentication
from apps.user.models import User, UserCreate, UserUpdate, UserDB
from apps.user.routers import get_users_router
from apps.todo.routers import get_todo_router

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET = "SECRET"

auth_backends = []

jwt_authentication = JWTAuthentication(secret=SECRET, lifetime_seconds=3600, tokenUrl="auth/jwt/login")


@app.on_event("startup")
async def configure_db_and_routes():
    app.mongodb_client = AsyncIOMotorClient(
        'mongodb://localhost:27017', uuidRepresentation="standard"
    )
    app.db = app.mongodb_client.todo_db

    user_db = MongoDBUserDatabase(UserDB, app.db["users"])

    app.fastapi_users = FastAPIUsers(
        user_db,
        [jwt_authentication],
        User,
        UserCreate,
        UserUpdate,
        UserDB,
    )

    app.include_router(get_users_router(app))
    app.include_router(get_todo_router(app), prefix="/tasks")


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()


@app.get('/run-after-raj-register-to-make-first-admin')
async def generate_first_admin():

    email = 'raj@gmail.com'
    admin_in_db = await app.db["users"].update_one({"email": email}, {"$set": {"is_superuser": True}})
    return {'success': 'Raj is now first admin'}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )
