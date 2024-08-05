// import React, { useEffect, useState } from 'react';
// import './App.css';
// import BookItem from './components/BookItem/bookitem';
// import SearchBar from './components/SearchBar/searchbar';
// import Loader from './components/Loader/loader';
// import ProfileIcon from './components/Profile/profile';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AuthPage from './components/Profile/auth';
// import ProfilePage from './components/Profile/ProfilePage'; 

// function App() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [allBooks, setAllBooks] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const search = (query) => {
//     setSearchQuery(query);
//   };

//   useEffect(() => {
//     const fetchAllBooks = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch('http://localhost:8000/books/');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setAllBooks(data);
//       } catch (error) {
//         console.error('Error:', error);
//         setAllBooks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllBooks();
//   }, []);

//   useEffect(() => {
//     if (searchQuery) {
//       const fetchBooks = async () => {
//         setLoading(true);
//         try {
//           let url;
//           if (searchQuery.startsWith("author:")) {
//             const author = searchQuery.replace("author:", "").trim();
//             url = `http://localhost:8000/books/authors/${author}`;
//           } else if (searchQuery.startsWith("genre:")) {
//             const genre = searchQuery.replace("genre:", "").trim();
//             url = `http://localhost:8000/books/categories/${genre}`;
//           } else {
//             url = `http://localhost:8000/books/${searchQuery}`;
//           }

//           const response = await fetch(url);
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           const data = await response.json();
//           setBooks(Array.isArray(data) ? data : [data]);
//         } catch (error) {
//           console.error('Error:', error);
//           setBooks([]);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchBooks();
//     } else {
//       setBooks(allBooks);
//     }
//   }, [searchQuery, allBooks]);

//   return (
//     <Router>
//       <div className="App">
//         <div className="flex justify-center items-center space-x-2">
//           <div className="profile-icon-container">
//             <h1 className="text-5xl">Library</h1>
//             <ProfileIcon />
//           </div>
//           <Routes>
//             <Route path="/" element={
//               <>
//                 <SearchBar onSearch={search} />
//                 <div className="search-results book-container">
//                   {loading && <Loader />}
//                   {!loading && searchQuery && books.length === 0 && (
//                     <p>No results found for "{searchQuery}"</p>
//                   )}
//                   {!loading && books.map((book) => (
//                     <BookItem key={book.id} book={book} />
//                   ))}
//                 </div>
//               </>
//             } />
//             <Route path="/auth" element={<AuthPage />} />
//             <Route path="/profile" element={<ProfilePage />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;


// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/App.tsx
import React, { useEffect, useState, FC } from 'react';
import './App.css';
import BookItem from './components/BookItem/bookitem.tsx';
import SearchBar from './components/SearchBar/searchbar.tsx';
import Loader from './components/Loader/loader.tsx';
import ProfileIcon from './components/Profile/profile.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/Profile/auth.tsx';
import ProfilePage from './components/Profile/ProfilePage.tsx';
import Chatbot from './components/ChatBot/chatbot.tsx'; 


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

const App:FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const search = (query: string): void => {
    setSearchQuery(query);
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

        const response = await fetch(url);
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
    <Router>
      <div className="App">
        <div className="flex justify-center items-center space-x-2">
          <div className="profile-icon-container">
            <h1 className="text-5xl">Library</h1>
            <ProfileIcon />
          </div>
          <Routes>
            <Route path="/" element={
              <>
                <SearchBar onSearch={search} />
                <div className="search-results book-container">
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
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
        <Chatbot/>
      </div>
    </Router>
  );
}

export default App;
