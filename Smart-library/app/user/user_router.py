#/Users/malmobarak001/All_Vscode/myprojectforbooks/Smart-Library/app/user/user_router.py

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import Annotated
from app.user import user_crud
from app.user.user_schema import User_create
from app.common.utils import auth
from app.common.config.database import get_db
from fastapi.security import OAuth2PasswordRequestForm
from app.user import user_model
router = APIRouter()


@router.get("/users/me/", tags=["users"])
async def get_current_user(
    current_user: Annotated[user_model.User, Depends(auth.get_current_user)],
):
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
    }

@router.put("/users/me/{user_id}", tags=["users"])
async def update_current_user(
    user_id: str, user: User_create, db: Session = Depends(get_db)
):
    return user_crud.update_user(db, user, user_id)

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.user import user_crud
from app.user.user_schema import User_create
from app.common.utils import auth
from app.common.config.database import get_db
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/users/register", tags=["users"])
def register_user(user: User_create, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user)

@router.post("/users/login", tags=["users"])
async def login_user(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> auth.Token:
    return auth.access_token(response, db, form_data.username, form_data.password)
