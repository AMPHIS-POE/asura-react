import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RecordsChart = ({ records }) => {
  const formatTimeForAxis = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const pinkColor = '#D94C83';
  const pinkColorBg = 'rgba(217, 76, 131, 0.5)';
  const yellowColor = '#ffb700';
  const yellowColorBg = 'rgba(255, 183, 0, 0.5)';

  const backgroundColors = records.map((_, index) =>
    index === 0 ? pinkColorBg : yellowColorBg
  );
  const borderColors = records.map((_, index) =>
    index === 0 ? pinkColor : yellowColor
  );

  const data = {
    labels: records.map((r, index) => `#${index + 1}`),
    datasets: [
      {
        label: 'Clear Time (Seconds)',
        data: records.map(r => r.seconds),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Act Clear Time History',
        color: '#e0e0e0',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = 'Time: ';
            if (context.parsed.x !== null) {
              label += formatTimeForAxis(context.parsed.x);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: '#adb5bd',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#adb5bd',
          callback: function(value) {
            return formatTimeForAxis(value);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ position: 'relative', height: '400px' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default RecordsChart;