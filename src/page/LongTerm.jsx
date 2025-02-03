import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement } from 'chart.js';
import io from 'socket.io-client';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement
);

// let ip = "http://13.232.151.17:5000";
let ip = 'http://localhost:5000'


function LongTerm() {
  const [metricsData, setMetricsData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const socket = io(`${ip}`);

    socket.on('allMetrics', async (data) => {
      console.log("data",data);
      setMetricsData(data);
      setLoading(false);

    });

    return () => {
      socket.disconnect();
    };
  }, []);


  const fetchDetails = async () => {
    try {
      const resp = await fetch(`${ip}/allMetrics`);
      if (!resp.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const data = await resp.json();
      setMetricsData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // Format the data for charts
  const memoryData = {
    labels: metricsData.map((metric) => new Date(metric.timestamp).toLocaleTimeString()), 
    datasets: [
      {
        data: metricsData.map((metric) => metric?.MEMORY_INFO?.USED),
        label: 'Used Memory',
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1
      },
      {
        data: metricsData.map((metric) => metric?.MEMORY_INFO?.FREE),
        label: 'Free Memory',
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1
      }
    ]
  };

  const uptimeData = {
    labels: metricsData.map((metric) => new Date(metric?.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Uptime (hours)',
        data: metricsData.map((metric) => metric?.system_info?.UPTIME),
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1
      }
    ]
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="long-term">
      <h1>Long Term Server Metrics</h1>

      <div className="chart-container">
        <h3>Memory Usage (Line Chart)</h3>
       {
        metricsData &&   <Line data={memoryData} options={{ responsive: true }} />
       }
      </div>

      <div className="chart-container">
        <h3>Uptime Info (Line Chart)</h3>
        {
          metricsData &&  <Line data={uptimeData} options={{ responsive: true }} />
        }
      </div>
    </div>
  );
}

export default LongTerm;
