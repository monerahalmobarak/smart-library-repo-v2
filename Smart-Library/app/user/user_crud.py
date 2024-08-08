#/Users/malmobarak001/All_Vscode/myprojectforbooks/Smart-Library/app/user/user_crud.py

from sqlalchemy.orm import Session
from fastapi import HTTPException
import uuid
from app.common.utils import auth
from app.user.user_model import User
from app.user.user_schema import User_create

def update_user(db: Session, user: User_create, user_id: str):
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.username = user.username
    db_user.password_hash = auth.get_password_hash(user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"id": db_user.user_id, "username": db_user.username, "role": db_user.role}


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: User_create):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")

    new_user = User(
        user_id=str(uuid.uuid4()),
        username=user.username,
        password_hash=auth.get_password_hash(user.password),
        role="User"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.user_id, "username": new_user.username, "role": new_user.role}

def delete_user_by_id(db: Session, user_id: str):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        print(f"Deleted user: {user_id}")
        return True
    else:
        print(f"No user found with ID: {user_id}")
        return False
