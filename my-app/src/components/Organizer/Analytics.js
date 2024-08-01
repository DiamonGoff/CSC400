import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

// Register the necessary components
Chart.register(...registerables);

const Analytics = ({ events }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy previous chart instance if exists
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    
    // Ensure events and attendees array are properly defined
    const eventNames = events ? events.map(event => event.name) : [];
    const attendeesCounts = events ? events.map(event => (event.attendees ? event.attendees.length : 0)) : [];

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: eventNames,
        datasets: [{
          label: '# of Attendees',
          data: attendeesCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Clean up the chart instance on component unmount
      }
    };
  }, [events]);

  return (
    <div>
      <h2>Event Analytics</h2>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default Analytics;
