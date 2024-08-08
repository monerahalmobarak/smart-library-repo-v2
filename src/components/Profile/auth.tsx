// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/components/Profile/auth.tsx

import React, { useState, ChangeEvent, FormEvent, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminPage from './AdminPage.tsx';
import ProfilePage from './ProfilePage.tsx';
import styles from '../../App.module.css';

interface AuthPageProps {
  formType?: 'login' | 'register';
  setUserId: (userId: string) => void;
}

interface LoginForm {
  username: string;
  password: string;
}

interface DecodedToken {
  sub: string;
  role: string;
  user_id: string;
}

const AuthPage: FC<AuthPageProps> = ({ formType = 'login', setUserId }) => {
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState<LoginForm>({ username: '', password: '' });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [activeForm, setActiveForm] = useState<'login' | 'register'>(formType);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [localUserId, setLocalUserId] = useState<string>('');

  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error logging in');
      }
      localStorage.setItem('access_token', data.access_token);
      const decodedToken: DecodedToken = jwtDecode(data.access_token);
      setUserId(decodedToken.user_id);
      setIsAdmin(decodedToken.role === 'Admin');
      setLocalUserId(decodedToken.user_id);
      if (decodedToken.role === 'Admin') {
        navigate('/AdminPage');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerForm.username,
          password: registerForm.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error registering');
      }
      setSuccess('Registration successful! You can now log in.');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className={styles['auth-page']}>
      <button onClick={() => setActiveForm('login')}>Login</button>
      <button onClick={() => setActiveForm('register')}>Register</button>
      {isAdmin ? <AdminPage /> : (
        activeForm === 'login' ? (
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input
                type="text"
                value={loginForm.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={loginForm.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </label>
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <label>
              Username:
              <input
                type="text"
                value={registerForm.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterForm({ ...registerForm, username: e.target.value })}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={registerForm.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
            </label>
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
          </form>
        )
      )}

      {localUserId && !isAdmin && <ProfilePage userId={localUserId} />}
    </div>
  );
};

export default AuthPage;
