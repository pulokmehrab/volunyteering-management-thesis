import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const HomeReview = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchFeedback = async () => {
            const response = await axios.get(`${API_URL}/feedback`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFeedback(response?.data);
            setLoading(false);
        }
        fetchFeedback();
    }, []);
    return (
        <div>
            <h1>Home Review</h1>
            {feedback?.map((item) => (
                <div key={item._id}>
                    <p>{item.feedback}</p>
                </div>
            ))}
        </div>
    )
}


export default HomeReview;