import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const UptimeChart = () => {
  const [metrics, setMetrics] = useState([]);

  const fetchSaveMetrics = async () => {
    try {
      const response = await fetch(`http://localhost:5500/allMetrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ip: 'http://localhost:5500'
        })
      });
      const data = await response.json();

      // Extracting uptime with timestamp
      const uptimeData = data.map((item) => ({
        time: new Date().toLocaleTimeString(),
        uptime: item.system_info.UPTIME
      }));
      
      setMetrics(uptimeData);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  useEffect(() => {
    fetchSaveMetrics();
    const interval = setInterval(fetchSaveMetrics, 40000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={metrics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="uptime" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UptimeChart;
