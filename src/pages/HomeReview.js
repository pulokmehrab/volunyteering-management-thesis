import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const HomeReview = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${API_URL}/feedback`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFeedback(response.data || []);
      } catch (err) {
        setError('Failed to load feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <section style={styles.container}>
        <h1 style={styles.title}>Reviews by Volunteer!</h1>
        <p style={styles.message}>Loading feedback...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section style={styles.container}>
        <h1 style={styles.title}>Reviews by Volunteer!</h1>
        <p style={{ ...styles.message, color: 'red' }}>{error}</p>
      </section>
    );
  }

  return (
    <section style={styles.container}>
      <h1 style={styles.title}>Reviews by Volunteer!</h1>
      {feedback.length === 0 ? (
        <p style={styles.message}>No feedback available yet.</p>
      ) : (
        <ul style={styles.list}>
          {feedback.map(({ _id, feedback, userId }) => (
            <li key={_id} style={styles.listItem}>
              <p style={styles.feedbackText}>"{feedback}"</p>
              <p style={styles.userInfo}>
                — {userId?.name ?? 'Anonymous'} (<a href={`mailto:${userId?.email}`} style={styles.email}>{userId?.email ?? 'No email'}</a>)
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#222',
  },
  message: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#555',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  feedbackText: {
    fontSize: '1.1rem',
    lineHeight: '1.4',
    color: '#333',
    fontStyle: 'italic',
    marginBottom: '8px',
  },
  userInfo: {
    fontSize: '0.9rem',
    color: '#666',
  },
  email: {
    color: '#1a73e8',
    textDecoration: 'none',
  },
};

export default HomeReview;
