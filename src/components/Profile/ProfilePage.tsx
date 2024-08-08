import React, { useEffect, useState, FC, FormEvent } from 'react';

interface User {
  username: string;
}

interface ProfilePageProps {
  userId: string;
}

const ProfilePage: FC<ProfilePageProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

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

  const handleFeedbackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ userId, feedback }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello.. {user.username}</h1>
      {feedbackSubmitted ? (
        <div>Thank you for your feedback!</div>
      ) : (
        <form onSubmit={handleFeedbackSubmit}>
          <div>
            <label htmlFor="feedback">Your Feedback:</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Submit Feedback</button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
