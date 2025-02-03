import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement } from 'chart.js';
import io from 'socket.io-client';
import LongTerm from './LongTerm';

// let ip = "http://192.168.0.138:5000";
let ip = 'http://localhost:5000'

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

const ServerMonitor = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(`${ip}`);

    socket.on('server_metrics', async (data) => {
      setMetrics(data);
      setLoading(false);

      // Send data to the backend to save in MongoDB
        if(data ){
          try {
            const response = await fetch(`${ip}/save-metrics`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                system_info: data?.system_info,
                MEMORY_INFO: data?.MEMORY_INFO
              })
            });
    
            if (!response.ok) {
              throw new Error('Failed to save metrics');
            }
    
             console.log("esonse",response);
            const result = await response.json();
            console.log('Metrics saved:', result);
          } catch (error) {
            console.error('Error saving metrics to backend:', error);
          }
        }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchDetails = async () => {
    try {
      const resp = await fetch(`${ip}/metric`);
      if (!resp.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const data = await resp.json();
      setMetrics(data?.metrics);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const memoryData = {
    labels: ['Used', 'Free'],
    datasets: [
      {
        data: [metrics?.MEMORY_INFO?.USED, metrics?.MEMORY_INFO?.FREE],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB']
      }
    ]
  };

 
  return (
    <div className="flexwrap">
       {
        metrics ? 
        <>
         <div className="server-monitor-container">
      <h1 className="page-title">Server Metrics</h1>
      <div className="metrics-container">
        <div className="system-info">
          <h3>System Info</h3>
          {
            metrics?.system_info && 
          <>
          <p><strong>Host:</strong> {metrics?.system_info?.HOST_NAME}</p>
          <p><strong>Architecture:</strong> {metrics?.system_info?.ARCHITECTURE}</p>
          <p><strong>Platform:</strong> {metrics?.system_info?.PLATFORM}</p>
          <p><strong>Uptime:</strong> {metrics?.system_info?.UPTIME} hours</p>
          <p><strong>Version:</strong> {metrics?.system_info?.VERSION}</p>
          <p><strong>Release:</strong> {metrics?.system_info?.RELEASE}</p>
          </>
          }
        </div>

        <div className="chart-container">
          <h3>Memory Info</h3>
             {
              metrics?.MEMORY_INFO && 
          <Doughnut data={memoryData} options={{ responsive: true }} />
             }
        </div>
        

      </div>


      
    </div>


<LongTerm />
        </>
        :
        <span>System Down</span>
       }
    </div>

  );
};

export default ServerMonitor;
