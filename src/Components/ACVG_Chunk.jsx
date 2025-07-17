import React, { useContext } from 'react';
import { FileContext } from './FileContext';
import { useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ACVG_Chunks = () => {
  const { fileDataXLI } = useContext(FileContext);
  const query = new URLSearchParams(useLocation().search);
  const chunkSize = parseInt(query.get('chunk') || '500');

  const filtered = fileDataXLI.filter(
    (item) =>
      item['VirtualDistance (m)'] &&
      item['ACVG_VSS_DB'] &&
      !isNaN(item['VirtualDistance (m)']) &&
      !isNaN(item['ACVG_VSS_DB'])
  );

  const maxDist = Math.max(...filtered.map(row => Number(row['VirtualDistance (m)'])));
  const chunks = [];

  for (let start = 0; start < maxDist; start += chunkSize) {
    const end = start + chunkSize;
    const chunk = filtered.filter(row =>
      Number(row['VirtualDistance (m)']) >= start &&
      Number(row['VirtualDistance (m)']) < end
    );

    if (chunk.length > 0) {
      const labels = chunk.map(item => Number(item['VirtualDistance (m)']).toFixed(2));
      const dataOn = chunk.map(item => Number(item['ACVG_VSS_DB']));

      chunks.push({
        title: `${start}m - ${end}m`,
        data: {
          labels,
          datasets: [
            {
              label: 'ACVG_VSS_DB',
              data: dataOn,
              borderColor: 'skyblue',
              backgroundColor: 'lightblue',
              tension: 0.4,
              fill: false,
            },
          ],
        },
      });
    }
  }

  return (
    <div>
      <h2>Section-wise Charts (Every {chunkSize}m)</h2>
      {chunks.map((chunk, i) => (
        <div key={i} style={{ marginBottom: '2rem' }}>
          <h3>{chunk.title}</h3>
          <Line data={chunk.data} options={{ responsive: true, plugins: { legend: { position: 'top' } },
        
        scales: {
          x: {
            title: {
              display: true,
              text: 'Virtual Distance (m)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'ACVG_VSS_DB',
            },
          },
        },
        }} />
        </div>
      ))}
    </div>
  );
};

export default ACVG_Chunks;
