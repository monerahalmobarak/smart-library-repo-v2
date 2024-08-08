from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.common.config.database import Base
from fastapi import APIRouter, Depends, HTTPException ,Response
from sqlalchemy.orm import Session
from app.common.config.database import get_db
from typing import List


app = APIRouter()


# SQLAlchemy model
class BookDB(Base):
    __tablename__ = "books"
    book_id = Column(Integer, primary_key=True, autoincrement=True)
    isbn13 = Column(String, index=True, unique=True)
    isbn10 = Column(String, index=True, unique=True)
    title = Column(String, index=True)
    subtitle = Column(String)
    authors = Column(String)  # Storing authors as comma-separated string
    categories = Column(String)
    thumbnail = Column(String)
    description = Column(String)
    published_year = Column(Integer)
    average_rating = Column(Float)
    num_pages = Column(Integer)
    ratings_count = Column(Integer)

# Pydantic models
class BookCreate(BaseModel):
    isbn13: str
    isbn10: str
    title: str
    subtitle: str
    authors: list[str]  # List of author names
    categories: str
    thumbnail: str
    description: str
    published_year: int
    average_rating: float
    num_pages: int
    ratings_count: int

    class Config:
        orm_mode = True  # Use orm_mode to serialize SQLAlchemy models

class Book(BaseModel):
    book_id: int
    isbn13: str
    isbn10: str
    title: str
    subtitle: str
    authors: list[str]  
    categories: str
    thumbnail: str
    description: str
    published_year: int
    average_rating: float
    num_pages: int
    ratings_count: int

    class Config:
        from_attribute = True

class User_preferences(BaseModel):
    preference_id: int
    user_id: str
    preferences: str


class User_preferences_create(BaseModel):
    user_id: str
    preferences: str

# CRUD operations
def create_book(db: Session, book: BookCreate) -> BookDB:
    db_book = BookDB(
        isbn13=book.isbn13,
        isbn10=book.isbn10,
        title=book.title,
        subtitle=book.subtitle,
        authors=",".join(book.authors),  
        categories=book.categories,
        thumbnail=book.thumbnail,
        description=book.description,
        published_year=book.published_year,
        average_rating=book.average_rating,
        num_pages=book.num_pages,
        ratings_count=book.ratings_count
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def get_book_by_isbn13(db: Session, isbn13: str) -> BookDB:
    return db.query(BookDB).filter(BookDB.isbn13 == isbn13).first()

def fetch_all_books(db: Session) -> list[BookDB]:
    return db.query(BookDB).all()

def get_books_by_date(db: Session, published_year: int) -> list[BookDB]:
    return db.query(BookDB).filter(BookDB.published_year == published_year).all()

def get_single_book(db: Session, title: str) -> BookDB:
    book = db.query(BookDB).filter(BookDB.title == title).first()
    if book:
        book.authors = book.authors.split(',') if book.authors else []
    return book

def get_books(db: Session, start: int = 0, limit: int = 100) -> list[BookDB]:
    start = abs(start)
    limit = min(max(limit, 1), 100)
    list_of_books = db.query(BookDB).offset(start).limit(limit).all()

    for book in list_of_books:
        book.authors = book.authors.split(',') if book.authors else []
    return list_of_books

def get_by_authors(db: Session, authors: str) -> BookDB:
    book = db.query(BookDB).filter(BookDB.authors == authors).first()
    if book:
        book.authors = book.authors.split(',') if book.authors else []
    return book

def get_books_by_genre(db: Session, categories: str) -> BookDB:
    book = db.query(BookDB).filter(BookDB.categories == categories).first()
    if book:
        book.authors = book.authors.split(',') if book.authors else []
    return book


def delete_book_by_id(db: Session, book_id: int):
    db_book = db.query(BookDB).filter(BookDB.book_id == book_id).first()
    if db_book:
        db.delete(db_book)
        db.commit()
        return True
    return False


@app.get("/books/{title}", response_model=Book, tags=["books"])
async def retrieve_single_book(title: str, db: Session = Depends(get_db)):
    book = get_single_book(db, title)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.get("/books/", response_model=List[Book])
def get_books_route(db: Session = Depends(get_db), start: int = 0, limit: int = 100):
    books = get_books(db, start, limit)
    return books

@app.get("/books/authors/{authors}", response_model=Book, tags=["books"])
async def retrieve_books_by_authors(authors: str, db: Session = Depends(get_db)):
    books = get_by_authors(db, authors)
    if not books:
        raise HTTPException(status_code=404, detail="Books not found")
    return books

@app.get("/books/categories/{categories}", response_model=Book, tags=["books"])
async def retrieve_books_by_categories(categories: str, db: Session = Depends(get_db)):
    books = get_books_by_genre(db, categories)
    if not books:
        raise HTTPException(status_code=404, detail="Books not found")
    return books


@app.delete("/books/{book_id}", status_code=204)
def delete_book_route(book_id: int, db: Session = Depends(get_db)):
    success = delete_book_by_id(db, book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    return Response(status_code=204)
