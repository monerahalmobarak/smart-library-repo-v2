// Importing React and necessary hooks and types from 'react'
import React, { useEffect, useState, FC } from 'react';
// Importing components
import BookItem from './components/BookItem/bookitem.tsx';
import SearchBar from './components/SearchBar/searchbar.tsx';
import Loader from './components/Loader/loader.tsx';
import ProfileIcon from './components/Profile/profile.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/Profile/auth.tsx';
import ProfilePage from './components/Profile/ProfilePage.tsx';
import Chatbot from './components/ChatBot/chatbot.tsx'; 
import AdminPage from './components/Profile/AdminPage.tsx';

// Importing CSS module for styling
import styles from './App.module.css';

// Defining interface for Book object
interface Book {
  id: number;
  title: string;
  authors: string[];
  published_year: number;
  thumbnail: string;
  categories: string;
  average_rating: number;
  description: string;
  num_pages: number;
}

// Functional Component App as the main application component
const App: FC = () => {
  // State to manage the search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  // State to manage all books
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  // State to manage the currently displayed books
  const [books, setBooks] = useState<Book[]>([]);
  // State to manage the loading status
  const [loading, setLoading] = useState<boolean>(false);
  // State to manage the user ID
  const [userId, setUserId] = useState<string>('');

  // Function to handle search and set the search query
  const search = (query: string): void => {
    setSearchQuery(query);
  };

  // useEffect hook to fetch all books when the component mounts
  useEffect(() => {
    const fetchAllBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/books/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Book[] = await response.json();
        setAllBooks(data);
      } catch (error) {
        console.error('Error:', error);
        setAllBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBooks();
  }, []);

  // useEffect hook to fetch books based on the search query or all books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        let url: string;
        if (searchQuery.startsWith("author:")) {
          const author = searchQuery.replace("author:", "").trim();
          url = `http://localhost:8000/books/authors/${author}`;
        } else if (searchQuery.startsWith("genre:")) {
          const genre = searchQuery.replace("genre:", "").trim();
          url = `http://localhost:8000/books/categories/${genre}`;
        } else {
          url = `http://localhost:8000/books/${searchQuery}`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Book[] | Book = await response.json();
        setBooks(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Error:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchBooks();
    } else {
      setBooks(allBooks);
    }
  }, [searchQuery, allBooks]);

  return (
    // Setting up the Router for navigation
    <Router>
      <div className={styles.App}>
        <div className="flex justify-center items-center space-x-2">
          <div className={styles['profile-icon-container']}>
            {/* Application header */}
            <h1 className="text-5xl">Library</h1>
            {/* Profile icon button */}
            <ProfileIcon />
          </div>
          {/* Defining routes */}
          <Routes>
            <Route path="/" element={
              <>
                {/* Search bar component */}
                <SearchBar onSearch={search} />
                <div className={`${styles['search-results']} ${styles['book-container']}`}>
                  {/* Loading indicator */}
                  {loading && <Loader />}
                  {/* Message when no results are found */}
                  {!loading && searchQuery && books.length === 0 && (
                    <p>No results found for "{searchQuery}"</p>
                  )}
                  {/* Displaying list of books */}
                  {!loading && books.map((book) => (
                    <BookItem key={book.id} book={book} />
                  ))}
                </div>
              </>
            } />
            {/* Profile page route */}
            <Route path="/profile" element={<ProfilePage userId={userId} />} />
            {/* Authentication page route */}
            <Route path="/auth" element={<AuthPage setUserId={setUserId} />} />
            {/* Admin page route */}
            <Route path="/AdminPage" element={<AdminPage />} />
          </Routes>
        </div>
        {/* Chatbot component */}
        <Chatbot />
      </div>
    </Router>
  );
}

// Exporting the App component as default
export default App;
