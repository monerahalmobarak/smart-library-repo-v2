#/Users/malmobarak001/All_Vscode/myprojectforbooks/Smart-Library/app/user/user_schema.py

from pydantic import BaseModel


class User_create(BaseModel):
    username: str
    password: str | None = None