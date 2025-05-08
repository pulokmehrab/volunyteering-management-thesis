import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import './statistics.css';

const Statistics = () => {
  useEffect(() => {
    let volunteersChart, hoursChart, participationChart, topVolunteersChart;

    // Chart initialization functions (unchanged)...

    const initVolunteersByCategoryChart = () => {
      const ctx1 = document.getElementById('volunteersByCategory').getContext('2d');
      if (volunteersChart) volunteersChart.destroy();
      volunteersChart = new Chart(ctx1, {
        type: 'pie',
        data: {
          labels: ['Ticketing', 'Accreditation', 'Bar/Service', 'Shop', 'Technical Support', 'Airport Welcome', 'Runner'],
          datasets: [{
            label: 'Volunteers',
            data: [20, 30, 15, 10, 5, 12, 8],
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
      const ctx2 = document.getElementById('hoursByCategory').getContext('2d');
      if (hoursChart) hoursChart.destroy();
      hoursChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Ticketing', 'Accreditation', 'Bar/Service', 'Shop', 'Technical Support', 'Airport Welcome', 'Runner'],
          datasets: [{
            label: 'Hours',
            data: [50, 80, 30, 40, 10, 20, 60],
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
      const ctx3 = document.getElementById('participationByCategory').getContext('2d');
      if (participationChart) participationChart.destroy();
      participationChart = new Chart(ctx3, {
        type: 'bar',
        data: {
          labels: ['Ticketing', 'Accreditation', 'Bar/Service', 'Shop', 'Technical Support', 'Airport Welcome', 'Runner'],
          datasets: [{
            label: 'Volunteer Participation %',
            data: [45, 30, 35, 25, 20, 15, 10],
            backgroundColor: ['#ff6347', '#4682b4', '#32cd32', '#ffa500', '#2e8b57', '#da70d6', '#8b0000'],
          }]
        },
        options: {
          scales: {
            x: {
              ticks: { color: '#ffffff' }
            },
            y: {
              ticks: { color: '#ffffff' }
            }
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
      const ctx4 = document.getElementById('topVolunteersChart').getContext('2d');
      if (topVolunteersChart) topVolunteersChart.destroy();
      topVolunteersChart = new Chart(ctx4, {
        type: 'bar',
        data: {
          labels: ['Volunteer 1', 'Volunteer 2', 'Volunteer 3', 'Volunteer 4', 'Volunteer 5', 'Volunteer 6', 'Volunteer 7', 'Volunteer 8', 'Volunteer 9', 'Volunteer 10'],
          datasets: [{
            label: 'Hours Worked',
            data: [40, 38, 37, 35, 34, 33, 31, 30, 29, 28],
            backgroundColor: '#c4b47c',
            borderColor: '#b1a46f',
            borderWidth: 1,
          }]
        },
        options: {
          scales: {
            x: {
              ticks: { color: '#ffffff' }
            },
            y: {
              ticks: { color: '#ffffff' }
            }
          },
          plugins: {
            legend: {
              labels: { color: '#ffffff' }
            }
          }
        }
      });
    };

    // Run chart inits
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
  }, []);

  return (
    <div className="statistics-container">
      <h1 className="page-title">Volunteer Statistics Dashboard</h1>

      <div className="statistics-boxes">
        <div className="stat-box">👥 Volunteers: <strong>120</strong></div>
        <div className="stat-box">✅ Shifts Completed: <strong>350</strong></div>
        <div className="stat-box">⏳ Shifts Left: <strong>40</strong></div>
        <div className="stat-box">⏱ Avg Volunteering Hours: <strong>30 hrs</strong></div>
        <div className="stat-box">⭐ Avg Shift Rating: <strong>4.5</strong></div>
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
