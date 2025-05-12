import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './statistics.css';

const API_URL = 'http://localhost:5000/api';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVolunteers, setActiveVolunteers] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${API_URL}/users/statistics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
        setActiveVolunteers(response.data.activeVolunteers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStatistics();
    const interval = setInterval(fetchStatistics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!stats) return;

    let volunteersChart, hoursChart, participationChart, topVolunteersChart;

    const initVolunteersByCategoryChart = () => {
      const ctx1 = document.getElementById('volunteersByCategory')?.getContext('2d');
      if (!ctx1) return;
      if (volunteersChart) volunteersChart.destroy();

      const data = stats.volunteersByCategory.map(cat => ({
        label: cat._id,
        count: cat.count
      }));

      volunteersChart = new Chart(ctx1, {
        type: 'pie',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            label: 'Volunteers',
            data: data.map(d => d.count),
            backgroundColor: ['#ff6347', '#4682b4', '#32cd32', '#ffa500', '#2e8b57', '#da70d6', '#8b0000'],
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: { color: '#ffffff' }
            }
          }
        }
      });
    };

    const initHoursByCategoryChart = () => {
      const ctx2 = document.getElementById('hoursByCategory')?.getContext('2d');
      if (!ctx2) return;
      if (hoursChart) hoursChart.destroy();

      const data = stats.hoursByCategory.map(cat => ({
        label: cat._id,
        hours: cat.totalHours
      }));

      hoursChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            label: 'Hours',
            data: data.map(d => d.hours),
            backgroundColor: ['#ff6347', '#4682b4', '#32cd32', '#ffa500', '#2e8b57', '#da70d6', '#8b0000'],
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: { color: '#ffffff' }
            }
          }
        }
      });
    };

    const initParticipationByCategoryChart = () => {
      const ctx3 = document.getElementById('participationByCategory')?.getContext('2d');
      if (!ctx3) return;
      if (participationChart) participationChart.destroy();

      const data = stats.participationByCategory;

      participationChart = new Chart(ctx3, {
        type: 'bar',
        data: {
          labels: data.map(d => d.category),
          datasets: [{
            label: 'Volunteer Participation %',
            data: data.map(d => d.percentage),
            backgroundColor: ['#ff6347', '#4682b4', '#32cd32', '#ffa500', '#2e8b57', '#da70d6', '#8b0000'],
          }]
        },
        options: {
          scales: {
            x: { ticks: { color: '#ffffff' } },
            y: { ticks: { color: '#ffffff' } }
          },
          plugins: {
            legend: {
              labels: { color: '#ffffff' }
            }
          }
        }
      });
    };

    const initTopVolunteersChart = () => {
      const ctx4 = document.getElementById('topVolunteersChart')?.getContext('2d');
      if (!ctx4) return;
      if (topVolunteersChart) topVolunteersChart.destroy();

      const data = stats.topVolunteers;

      topVolunteersChart = new Chart(ctx4, {
        type: 'bar',
        data: {
          labels: data.map(v => v.name),
          datasets: [{
            label: 'Hours Worked',
            data: data.map(v => v.hours),
            backgroundColor: '#c4b47c',
            borderColor: '#b1a46f',
            borderWidth: 1,
          }]
        },
        options: {
          scales: {
            x: { ticks: { color: '#ffffff' } },
            y: { ticks: { color: '#ffffff' } }
          },
          plugins: {
            legend: {
              labels: { color: '#ffffff' }
            }
          }
        }
      });
    };

    initVolunteersByCategoryChart();
    initHoursByCategoryChart();
    initParticipationByCategoryChart();
    initTopVolunteersChart();

    return () => {
      if (volunteersChart) volunteersChart.destroy();
      if (hoursChart) hoursChart.destroy();
      if (participationChart) participationChart.destroy();
      if (topVolunteersChart) topVolunteersChart.destroy();
    };
  }, [stats]);

  if (loading) return <div className="statistics-container">Loading statistics...</div>;
  if (error) return <div className="statistics-container">Error: {error}</div>;
  if (!stats) return <div className="statistics-container">No statistics available</div>;

  return (
    <div className="statistics-container">
      <h1 className="page-title">Volunteer Statistics Dashboard</h1>

      <div className="statistics-boxes">
        <div className="stat-box">👥 Total Volunteers: <strong>{stats.totalVolunteers}</strong></div>
        <div className="stat-box">✅ Completed Shifts: <strong>{stats.completedShifts}</strong></div>
        <div className="stat-box">⏳ Open Shifts: <strong>{stats.openShifts}</strong></div>
        <div className="stat-box">⏱ Avg Volunteering Hours: <strong>{stats.avgHours.toFixed(1)} hrs</strong></div>
        <div className="stat-box">🟢 Active Volunteers: <strong>{activeVolunteers.length}</strong></div>
      </div>

      <div className="active-volunteers-section">
        <h2>Currently Active Volunteers</h2>
        <div className="active-volunteers-list">
          {activeVolunteers.map(volunteer => (
            <div key={volunteer._id} className="active-volunteer-card">
              <h3>{volunteer.name}</h3>
              <p>Categories: {volunteer.categories.join(', ')}</p>
              <p>Last Active: {new Date(volunteer.lastLogin).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="statistics-charts">
        <div className="chart-box">
          <h3>Volunteers by Category</h3>
          <canvas id="volunteersByCategory"></canvas>
        </div>
        <div className="chart-box">
          <h3>Hours by Category</h3>
          <canvas id="hoursByCategory"></canvas>
        </div>
        <div className="chart-box">
          <h3>Participation % by Category</h3>
          <canvas id="participationByCategory"></canvas>
        </div>
      </div>

      <div className="third-row">
        <div className="chart-card">
          <h3>Top 10 Volunteers (Hours Worked)</h3>
          <canvas id="topVolunteersChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
