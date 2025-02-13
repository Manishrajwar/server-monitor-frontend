import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

function LongTerm({ ip }) {
  const [metrics, setMetrics] = useState([]);

  const fetchSaveMetrics = async () => {
    try {
      const response = await fetch(`${ip}/allMetrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ip: ip
        })
      });
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  useEffect(() => {
    fetchSaveMetrics();
    const interval = setInterval(fetchSaveMetrics, 40000);
    return () => clearInterval(interval);
  }, []);

  // Show only the last 14 data points
  const displayedMetrics = metrics;

  const memoryData = {
    labels: displayedMetrics.map((metric) => new Date(metric.timestamp).toLocaleTimeString()),
    datasets: [
      {
        data: displayedMetrics.map((metric) => metric?.MEMORY_INFO?.USED),
        label: 'Used Memory',
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1
      },
      {
        data: displayedMetrics.map((metric) => metric?.MEMORY_INFO?.FREE),
        label: 'Free Memory',
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1
      }
    ]
  };

  const uptimeData = {
    labels: displayedMetrics.map((metric) => new Date(metric?.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Uptime (hours)',
        data: displayedMetrics.map((metric) => metric?.system_info?.UPTIME),
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="long-term">

      <h1>Long Term Server Metrics</h1>

      <div className="chart-container2">
        <h3>Memory Usage (Line Chart)</h3>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <div style={{ width: `${displayedMetrics.length * 80}px` }}>
            <Line data={memoryData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="chart-container2">
        <h3>Uptime Info (Line Chart)</h3>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <div style={{ width: `${displayedMetrics.length * 80}px` }}>
            <Line  data={uptimeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default LongTerm;
