
import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  // const [year, setYear] = useState(new Date().getFullYear());
  // useRequireAuth();
  const barData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Rides",
        data: [0, 0, 0, 0, 0, 0, 0,0,1,0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "New Users",
        data: [0, 0, 0, 0, 0, 0, 0,0,2],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };


  const [pieData, setPieData] = useState({
    labels: ["Rider", "Host"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rideResponse = await axios.get(`/ride/ride-stats?year=${2024}`);
        const rideStats = rideResponse.data;
        console.log(rideStats);
        const userResponse = await axios.get("/admin/user-roles-stats");
        const userRoles = userResponse.data;
        console.log(userRoles);
        setPieData({
          labels: ["User", "Driver"],
          datasets: [
            {
              data: [userRoles.rider, userRoles.host],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

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
          {pieData && <Pie data={pieData} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
