import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { progressService, type GameMode } from '../services/progress';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Progress: React.FC = () => {
  const [progress, setProgress] = useState(progressService.getProgress());
  const navigate = useNavigate();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Prepare data for the best scores bar chart
  const bestScoresData = {
    labels: Object.keys(progress.bestScores) as GameMode[],
    datasets: [
      {
        label: 'Best Scores',
        data: Object.values(progress.bestScores),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the progress line chart
  const history = progressService.getProgressHistory(7); // Last 7 days
  const historyData = {
    labels: history.map(entry => formatDate(entry.date)),
    datasets: [
      {
        label: 'Scores (Last 7 Days)',
        data: history.map(entry => entry.score),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      progressService.resetProgress();
      setProgress(progressService.getProgress());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Progress</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Best Scores Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Best Scores by Mode</h2>
          <Bar 
            data={bestScoresData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Score'
                  }
                }
              }
            }} 
          />
        </div>
        
        {/* Progress Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Progress</h2>
          {history.length > 0 ? (
            <Line 
              data={historyData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Score'
                    }
                  }
                }
              }} 
            />
          ) : (
            <p className="text-gray-500">No recent activity to display. Play some games to see your progress!</p>
          )}
        </div>
      </div>
      
      {/* Completed Levels */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Completed Levels</h2>
        {progress.completedLevels.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {progress.completedLevels.map(level => (
              <span 
                key={level} 
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                Level {level}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No levels completed yet. Keep practicing!</p>
        )}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {history.length > 0 ? (
          <div className="space-y-2">
            {history.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium capitalize">{entry.mode}</span>
                  {entry.level && <span className="text-sm text-gray-500 ml-2">(Level {entry.level})</span>}
                </div>
                <div className="text-right">
                  <div className="font-bold">{entry.score} pts</div>
                  <div className="text-sm text-gray-500">{formatDate(entry.date)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent activity. Start playing to track your progress!</p>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          Reset Progress
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Progress;
