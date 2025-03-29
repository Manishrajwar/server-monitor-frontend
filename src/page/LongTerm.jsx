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

function LongTerm({  metrics }) {

  const displayedMetrics = metrics;

  const memoryData = {
    labels: displayedMetrics?.map((metric) => new Date(metric.timestamp).toLocaleTimeString()),
    datasets: [
      {
        data: displayedMetrics?.map((metric) => metric.memory_usage),
        label: 'Memory Usage (%)',
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1
      }
    ]
  };

  const cpuData = {
    labels: displayedMetrics?.map((metric) => new Date(metric.timestamp).toLocaleTimeString()),
    datasets: [
      {
        data: displayedMetrics?.map((metric) => metric.cpu_load),
        label: 'CPU Load (%)',
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1
      }
    ]
  };

  const uptimeData = {
    labels: displayedMetrics?.map((metric) => new Date(metric.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Uptime (Hours)',
        data: displayedMetrics?.map((metric) => {
          const match = metric.uptime.match(/(\d+) days (\d+) hours/);
          return match ? parseInt(match[1]) * 24 + parseInt(match[2]) : 0;
        }),
        fill: false,
        borderColor: '#28A745',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="long-term">
      <h1>Long Term Server Metrics</h1>

      <div className="make_flex">

        <div className="chart-container">
          <h3>Memory Usage</h3>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ width: `${displayedMetrics?.length * 80}px` }}>
              <Line data={memoryData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>CPU Load</h3>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ width: `${displayedMetrics?.length * 80}px` }}>
              <Line data={cpuData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Uptime Info</h3>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ width: `${displayedMetrics?.length * 80}px` }}>
              <Line data={uptimeData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LongTerm;
