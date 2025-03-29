import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement } from 'chart.js';
import { useLocation } from 'react-router-dom';
import LongTerm from './LongTerm';


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

const baseurl = "http://localhost:5500"

const ServerMonitor = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

const location = useLocation();

const ip = location.state;

const getDeviceHistory = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${baseurl}/getDeviceHistory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        device_ip: ip.device_ip
      })
    });

    const data = await response.json();
    console.log("devicehistory",data);
    setMetrics(data?.data);
  } catch (error) {
    console.error("Error fetching metrics:", error);
 
  }

  setLoading(false);
};

  useEffect(() => {
    getDeviceHistory();

    setInterval(() => {
       getDeviceHistory();
    }, 30000);
  }, [ip]);


  if (loading) {
    return <div className='loadinUi'>
      <span class="loader"></span>
    </div>
  }

  console.log("ip" ,ip);

 
  return (
    
    <div className="wrapper">

    <div className="flexwrap">
       {
        ip?.status === "UP" ? 
        <>
         <div className="server-monitor-container">

      <h1 className="page-title">Server Metrics {ip?.device_ip}</h1>


      <div className="metrics-container">

        <div className="system-info">
          <h3>System Info</h3>
          {
            metrics && 
          <>
          <p><strong>device_name:</strong> {ip?.device_name}</p>
          <p><strong>device_type:</strong> {ip?.device_type}</p>
          <p><strong>Total memory_usage:</strong> {ip?.memory_usage}</p>
          <p><strong>last_up_time:</strong> {new Date(ip?.last_up_time).toLocaleString()}</p>
          <p><strong>last_down_time:</strong> {new Date(ip?.last_down_time).toLocaleString()}</p>
          <p><strong>status:</strong> {ip?.status}</p>
          <p><strong>Total uptime:</strong> {ip?.uptime}</p>
          </>
          }
        </div>

        {
          ip.device_type !== "server" &&
        
        <div className="system-info">
          <h3>Port Information</h3>
          {
            metrics &&

          <>
          <p><strong>port_1_name:</strong> {ip?.port_1_name}</p>
          <p><strong>port_1_status:</strong> {ip?.port_1_status}</p>
      
          </>
          }
        </div>

}

     
        
      </div>


      <div className="graphs">
        <LongTerm metrics={metrics} ip={ip}  />
      </div>
    
    </div>


        </>
        :
        <span className='loadinUi'>System Down</span>
       }
    </div>

    </div>

  );
};

export default ServerMonitor;
