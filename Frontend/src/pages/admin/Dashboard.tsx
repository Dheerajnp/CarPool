
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  // useRequireAuth();
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Rides',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'New Users',
        data: [33, 53, 85, 41, 44, 65, 90],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const pieData = {
    labels: ['Rider', 'Host'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Rides per Month</h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">New Users per Month</h2>
          <Line data={lineData} />
        </div>

        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">User Roles</h2>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <ul>
          <li className="mb-2">User John Doe joined as a rider</li>
          <li className="mb-2">User Jane Doe joined as a host</li>
          <li className="mb-2">Ride from NYC to Boston scheduled for tomorrow</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard