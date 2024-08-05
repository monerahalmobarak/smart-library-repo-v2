// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/components/BookItem/bookitem.tsx
import React, { useState, FC } from 'react';

interface StarProps {
  fillPercentage: number;
}

const Star: FC<StarProps> = ({ fillPercentage }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset={`${fillPercentage}%`} style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
        <stop offset={`${fillPercentage}%`} style={{ stopColor: '#ccc', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#grad1)"
      d="M22,9.81a1,1,0,0,0-.83-.69l-5.7-.78L12.88,3.53a1,1,0,0,0-1.76,0L8.57,8.34l-5.7.78a1,1,0,0,0-.82.69,1,1,0,0,0,.28,1l4.09,3.73-1,5.24A1,1,0,0,0,6.88,20.9L12,18.38l5.12,2.52a1,1,0,0,0,.44.1,1,1,0,0,0,1-1.18l-1-5.24,4.09-3.73A1,1,0,0,0,22,9.81Z"
    />
  </svg>
);

interface StarRatingProps {
  rating: number;
}

const StarRating: FC<StarRatingProps> = ({ rating }) => {
  const fillPercentage = (rating / 5) * 100;
  return (
    <div className="star-rating">
      <Star fillPercentage={fillPercentage} />
      <span className="rating-number">{rating}</span>
    </div>
  );
};

interface Book {
  title: string;
  authors: string[];
  published_year: number;
  thumbnail: string;
  categories: string;
  average_rating: number;
  description: string;
  num_pages: number;
}

interface BookItemProps {
  book: Book;
}

const BookItem: FC<BookItemProps> = ({ book }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="book-container">
      <div className={`book-card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="book-card-inner">
          <div className="book-card-front">
            <div className="book-title">{book.title}</div>
            <div className="book-subtitle">
              <div className="book-authors">{book.authors.join(', ')}</div>
              <div className="book-published-year">{book.published_year}</div>
            </div>
            <div className="cover-photo" style={{ backgroundImage: `url(${book.thumbnail})` }}></div>
            <div className="book-subtitle1">
              <div className="book-categories">{book.categories}</div>
              <div className="book-average-rating">
                <StarRating rating={Math.round(book.average_rating)} />
              </div>
            </div>
          </div>
          <div className="book-card-back">
            <div className="book-description">{book.description}</div>
            <div className="book-num-pages">{book.num_pages}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
