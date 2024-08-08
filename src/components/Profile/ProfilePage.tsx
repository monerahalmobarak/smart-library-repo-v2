// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/components/Profile/ProfilePage.tsx

import React, { useEffect, useState, FC } from 'react';

interface User {
  username: string;
}

interface ProfilePageProps {
  userId: string;
}

const ProfilePage: FC<ProfilePageProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${userId}/username`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [userId]); 

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello.. {user.username}</h1>
    </div>
  );
};

export default ProfilePage;
