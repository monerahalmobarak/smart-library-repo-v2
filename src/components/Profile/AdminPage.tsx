// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/components/Profile/AdminPage.tsx

import React, { FC, useEffect, useState } from 'react';
import styles from '../../App.module.css';

interface Book {
  book_id: number;
  title: string;
  subtitle: string;
  authors: string[];
  published_year: number;
  thumbnail: string;
  categories: string;
  average_rating: number;
  num_pages: number;
  description: string;
  ratings_count: number;
}

interface User {
  id: string;
  username: string;
  role: string;
}

const AdminPage: FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8000/books');
        const data = await response.json();
        if (response.ok) {
          console.log("Books fetched:", data);
          setBooks(data);
        } else {
          throw new Error(data.message || "Failed to fetch books.");
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/all');
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          throw new Error(data.message || "Failed to fetch users.");
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchBooks();
    fetchUsers();
  }, []);

  const truncate = (str: string, num: number) => {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  const deleteBook = async (bookId: number) => {
    console.log(`Attempting to delete book with ID: ${bookId}`);
    if (!bookId) {
      console.error("Book ID is undefined. Cannot proceed with delete.");
      return;
    }
    try {
      const url = `http://localhost:8000/books/${bookId}`;
      console.log(`Sending DELETE request to: ${url}`);
      const response = await fetch(url, { method: 'DELETE' });
      console.log("Response status:", response.status);
      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(`Failed to delete the book. Status: ${response.status}, Body: ${responseBody}`);
      }
      // Updating the state to remove the deleted book
      setBooks(prevBooks => prevBooks.filter(book => book.book_id !== bookId));
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    console.log(`Attempting to delete user with ID: ${userId}`);
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        console.log(`User with ID: ${userId} has been deleted.`);
      } else {
        throw new Error('Failed to delete the user.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles['admin-panel']}>
      <h1 className={styles['admin-header']}>Admin Panel</h1>
      <div className={styles['tables-container']}>
        <div>
          <h2 className={styles['admin-header']}>Books</h2>
          <table className={styles['admin-table']}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Authors</th>
                <th>Publish Year</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.book_id}>
                  <td>{book.title}</td>
                  <td>{book.authors.join(", ")}</td>
                  <td>{book.published_year}</td>
                  <td className={styles['description-cell']}>{truncate(book.description, 50)}</td>
                  <td>{book.average_rating.toFixed(1)}</td>
                  <td>
                    <button onClick={() => deleteBook(book.book_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className={styles['admin-header']}>Users</h2>
          <table className={styles['admin-table']}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
