#/Users/malmobarak001/All_Vscode/myprojectforbooks/Smart-Library/app/user/user_router.py

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.common.config.database import get_db
from app.user import user_crud, user_model 
from app.user.user_schema import User_create
from app.common.utils.auth import authenticate_user, access_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from app.user.user_crud import delete_user_by_id

app = APIRouter()

@app.post("/users/register", tags=["users"])
def register_user(user: User_create, db: Session = Depends(get_db)):
    """
    Register a new user in the system.
    """
    return user_crud.create_user(db, user)

@app.post("/users/login", tags=["users"])
async def login_user(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate user and return a JWT token.
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    token = access_token(response, db, user.username, form_data.password)
    return token

@app.get("/users/me/", tags=["users"])
async def get_current_user(
    current_user: Annotated[user_model.User, Depends(get_current_user)],
):
    """
    Retrieve the currently authenticated user's data.
    """
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "role": current_user.role
    }

@app.put("/users/me/{user_id}", tags=["users"])
async def update_current_user(
    user_id: str,
    user: User_create,
    db: Session = Depends(get_db)
):
    """
    Update the authenticated user's data.
    """
    return user_crud.update_user(db, user, user_id)

@app.get("/users/all", tags=["users"])
async def get_all_users(db: Session = Depends(get_db)):
    """
    Retrieve all user's data.
    """
    users = db.query(user_model.User).all()
    return [{"id": user.user_id, "username": user.username, "role": user.role} for user in users]

@app.delete("/users/{user_id}", status_code=204)
def delete_user_route(user_id: str, db: Session = Depends(get_db)):
    print(f"Attempting to delete user with ID: {user_id}")
    success = delete_user_by_id(db, user_id)
    if not success:
        print("User not found or could not be deleted")
        raise HTTPException(status_code=404, detail="User not found")
    print("User deleted successfully")
    return Response(status_code=204)

# New route to get username by user_id
@app.get("/users/{user_id}/username", tags=["users"])
async def get_username(user_id: str, db: Session = Depends(get_db)):
    """
    Retrieve the username of a user by their user_id.
    """
    user = db.query(user_model.User).filter(user_model.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"username": user.username}


# @router.post("/users/login", tags=["users"])
# async def login_user(
#     response: Response,
#     form_data: OAuth2PasswordRequestForm = Depends(),
#     db: Session = Depends(get_db),
# ) -> auth.Token:
#     return auth.access_token(response, db, form_data.username, form_data.password)
