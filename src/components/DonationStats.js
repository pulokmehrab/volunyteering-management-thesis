import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import './DonationStats.css';

const DonationStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/donations/statistics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="stats-loading">Loading statistics...</div>;
    if (error) return <div className="stats-error">Error: {error}</div>;
    if (!stats) return null;

    const chartData = {
        labels: stats.charityStats.map(stat => stat._id),
        datasets: [{
            data: stats.charityStats.map(stat => stat.totalAmount),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ]
        }]
    };

    return (
        <div className="donation-stats">
            <div className="stats-header">
                <h2>Donation Statistics</h2>
                <div className="total-donated">
                    Total Donated: ${stats.totalDonated.toLocaleString()}
                </div>
            </div>

            <div className="stats-grid">
                <div className="chart-container">
                    <h3>Donations by Charity</h3>
                    <Pie data={chartData} />
                </div>

                <div className="recent-donations">
                    <h3>Recent Donations</h3>
                    <div className="donations-list">
                        {stats.recentDonations.map((donation, index) => (
                            <div key={donation._id} className="donation-item">
                                <div className="donor-info">
                                    <span className="donor-name">{donation.donorName}</span>
                                    <span className="donation-amount">${donation.amount}</span>
                                </div>
                                <div className="donation-details">
                                    <span className="charity-name">{donation.charity}</span>
                                    <span className="donation-date">
                                        {new Date(donation.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationStats; 