from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.common.config.database import Base

# SQLAlchemy model
class AuthorDB(Base):
    __tablename__ = "authors"
    author_id = Column(Integer, primary_key=True)
    author_name = Column(String, unique=True, index=True)


# Pydantic models
class AuthorAdd(BaseModel):
    author_name: str

    class Config:
        from_attributes = True  # Use from_attributes instead of orm_mode


class Author(BaseModel):
    author_id: int
    author_name: str

    class Config:
        from_attributes = True


# CRUD operation
def create_author(db: Session, author: AuthorAdd):
    db_author = AuthorDB(author_name=author.author_name)
    db.add(db_author)
    db.commit()
    db.refresh(db_author)
    return db_author

def get_author_by_name(db: Session, author_name: str):
    return db.query(AuthorDB).filter(AuthorDB.author_name == author_name).first()
