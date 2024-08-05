import pandas as pd
from sqlalchemy.orm import Session
from app.authors.authors_info import create_author, AuthorAdd, get_author_by_name
from app.Books.books_info import create_book, BookCreate
from app.common.config.database import get_db

# Load data
df = pd.read_csv('/Users/malmobarak001/All_Vscode/myprojectforbooks/books_cleaned.csv')

# Ensure all columns are treated as strings and replace NaN values with empty strings or appropriate defaults
df['isbn13'] = df['isbn13'].astype(str).fillna('')
df['isbn10'] = df['isbn10'].astype(str).fillna('')
df['title'] = df['title'].fillna('')
df['subtitle'] = df['subtitle'].fillna('')
df['authors'] = df['authors'].fillna('')
df['categories'] = df['categories'].fillna('')
df['thumbnail'] = df['thumbnail'].fillna('')
df['description'] = df['description'].fillna('')
df['published_year'] = df['published_year'].fillna(0).astype(int)  # Default to 0 if NaN
df['average_rating'] = df['average_rating'].fillna(0.0).astype(float)  # Default to 0.0 if NaN
df['num_pages'] = df['num_pages'].fillna(0).astype(int)  # Default to 0 if NaN
df['ratings_count'] = df['ratings_count'].fillna(0).astype(int)  # Default to 0 if NaN

def add_authors_to_db(authors_list, db: Session):
    for author_name in authors_list:
            author_data = AuthorAdd(author_name=author_name.strip())
            create_author(db, author_data)

def add_books_to_db(book_data, db: Session):
    book_data = BookCreate(
        isbn13=book_data['isbn13'],
        isbn10=str(book_data['isbn10']),  # Ensure isbn10 is treated as string
        title=book_data['title'],
        subtitle=book_data['subtitle'],
        authors=[author.strip() for author in book_data['authors'].split(',')],  # Split authors by comma
        categories=book_data['categories'],
        thumbnail=book_data['thumbnail'],
        description=book_data['description'],
        published_year=book_data['published_year'],
        average_rating=book_data['average_rating'],
        num_pages=book_data['num_pages'],
        ratings_count=book_data['ratings_count']
    )
    create_book(db, book_data)

# Get the database session
db = next(get_db())

# Iterate over the DataFrame and process authors and books
for index, row in df.iterrows():
    authors = row['authors'].split(',')  # Split authors by comma
    add_authors_to_db(authors, db)
    add_books_to_db(row, db)

print("Authors and Books have been added to the database.")



# from sqlalchemy import Column, Integer, String, Float
# from sqlalchemy.orm import Session
# from pydantic import BaseModel
# from app.common.config.database import Base

# # SQLAlchemy model
# class BookDB(Base):
#     __tablename__ = "books"
#     book_id = Column(Integer, primary_key=True, autoincrement=True)
#     isbn13 = Column(String, index=True)
#     isbn10 = Column(String, index=True)
#     title = Column(String, index=True)
#     subtitle = Column(String, index=True)
#     authors = Column(String)  # Storing authors as comma-separated string
#     categories = Column(String)
#     thumbnail = Column(String)
#     description = Column(String)
#     published_year = Column(Integer)
#     average_rating = Column(Float)
#     num_pages = Column(Integer)
#     ratings_count = Column(Integer)

# # Pydantic models
# class BookCreate(BaseModel):
#     isbn13: str
#     isbn10: str
#     title: str
#     subtitle: str
#     authors: list[str]  # List of author names
#     categories: str
#     thumbnail: str
#     description: str
#     published_year: int
#     average_rating: float
#     num_pages: int
#     ratings_count: int

#     class Config:
#         from_attributes = True  # Use from_attributes instead of orm_mode

# class Book(BaseModel):
#     book_id: int
#     isbn13: str
#     isbn10: str
#     title: str
#     subtitle: str
#     authors: list[str]  # List of author names
#     categories: str
#     thumbnail: str
#     description: str
#     published_year: int
#     average_rating: float
#     num_pages: int
#     ratings_count: int

#     class Config:
#         from_attributes = True

# # CRUD operation
# def create_book(db: Session, book: BookCreate):
#     db_book = BookDB(
#         isbn13=book.isbn13,
#         isbn10=book.isbn10,
#         title=book.title,
#         subtitle=book.subtitle,
#         authors=",".join(book.authors),  # Convert list of authors to comma-separated string
#         categories=book.categories,
#         thumbnail=book.thumbnail,
#         description=book.description,
#         published_year=book.published_year,
#         average_rating=book.average_rating,
#         num_pages=book.num_pages,
#         ratings_count=book.ratings_count
#     )
#     db.add(db_book)
#     db.commit()
#     db.refresh(db_book)
#     return db_book

# def get_book_by_isbn13(db: Session, isbn13: str):
#     return db.query(BookDB).filter(BookDB.isbn13 == isbn13).first()

# def fetch_all_books(db: Session):
#     return db.query(BookDB).all()
