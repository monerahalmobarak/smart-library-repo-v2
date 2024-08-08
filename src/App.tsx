// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/App.tsx

import React, { useEffect, useState, FC } from 'react';
import BookItem from './components/BookItem/bookitem.tsx';
import SearchBar from './components/SearchBar/searchbar.tsx';
import Loader from './components/Loader/loader.tsx';
import ProfileIcon from './components/Profile/profile.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/Profile/auth.tsx';
import ProfilePage from './components/Profile/ProfilePage.tsx';
import Chatbot from './components/ChatBot/chatbot.tsx'; 
import AdminPage from './components/Profile/AdminPage.tsx';
import styles from './App.module.css';
import ProtectedRoute from './components/Profile/ProtectedRoute.tsx'
import {jwtDecode} from 'jwt-decode';

// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/App.tsx


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

interface DecodedToken {
  sub: string;
  role: string;
  user_id: string;
}

const App: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);

  const search = (query: string): void => {
    setSearchQuery(query);
  };

  const filterBooks = (filter: string): void => {
    let filteredBooks = [...allBooks];
    switch (filter) {
      case 'recent':
        filteredBooks.sort((a, b) => b.published_year - a.published_year);
        break;
      case 'earliest':
        filteredBooks.sort((a, b) => a.published_year - b.published_year);
        break;
      case 'top-rated':
        filteredBooks.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'least-rated':
        filteredBooks.sort((a, b) => a.average_rating - b.average_rating);
        break;
      case 'recently-added':
    
        break;
      default:
        break;
    }
    setBooks(filteredBooks);
  };

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
        setBooks(data); // Initialize with all books
      } catch (error) {
        console.error('Error:', error);
        setAllBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBooks();
  }, []);

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

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setUserId(decodedToken.user_id);
      setUserRole(decodedToken.role);
    }
  }, []);

  return (
    <Router>
      <div className={styles.App}>
        <div className="flex justify-center items-center space-x-2">
          <div className={styles['profile-icon-container']}>
            <h1 className="text-5xl">Library</h1>
            <ProfileIcon />
          </div>
          <Routes>
            <Route path="/" element={
              <>
                <SearchBar onSearch={search} onFilter={filterBooks} />
                <div className={`${styles['search-results']} ${styles['book-container']}`}>
                  {loading && <Loader />}
                  {!loading && searchQuery && books.length === 0 && (
                    <p>No results found for "{searchQuery}"</p>
                  )}
                  {!loading && books.map((book) => (
                    <BookItem key={book.id} book={book} />
                  ))}
                </div>
              </>
            } />
            <Route path="/profile" element={<ProfilePage userId={userId} />} />
            <Route path="/auth" element={<AuthPage setUserId={setUserId} />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute isAllowed={userRole === 'Admin'}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>          
        </div>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
