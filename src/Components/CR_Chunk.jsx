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

const CR_Chunk = () => {
  const { fileDataICE } = useContext(FileContext);
  const query = new URLSearchParams(useLocation().search);
  const chunkSize = parseInt(query.get('chunk') || '500');

  const filtered = fileDataICE.filter(
    (item) =>
      item['Chainage (m)'] &&
      item['Sce-1 CCR - Worst mmpy'] &&
      item['Sce-1 CCR - Realistic mmpy']&&
      !isNaN(item['Chainage (m)']) &&
      !isNaN(item['Sce-1 CCR - Worst mmpy'])&&
      !isNaN(item['Sce-1 CCR - Realistic mmpy'])
  );

  const maxDist = Math.max(...filtered.map(row => Number(row['Chainage (m)'])));
  const chunks = [];

  for (let start = 0; start < maxDist; start += chunkSize) {
    const end = start + chunkSize;
    const chunk = filtered.filter(row =>
      Number(row['Chainage (m)']) >= start &&
      Number(row['Chainage (m)']) < end
    );

    if (chunk.length > 0) {
      const labels = chunk.map(item => Number(item['Chainage (m)']).toFixed(2));
      const dataOn = chunk.map(item => Number(item['Sce-1 CCR - Worst mmpy']));
      const dataOff = chunk.map(item => Number(item['Sce-1 CCR - Realistic mmpy']));

      chunks.push({
        title: `${start}m - ${end}m`,
        data: {
          labels,
          datasets: [
            {
              label: 'Sce-1 CCR - Worst mmpy',
              data: dataOn,
              borderColor: 'skyblue',
              backgroundColor: 'lightblue',
              tension: 0.4,
              fill: false,
            },
             {
              label: 'Sce-1 CCR - Worst mmpy',
              data: dataOff,
              borderColor: 'lightgreen',
              backgroundColor: 'green',
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
              text: 'Chainage (m)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Corrosion Rate (Worst+Realistic)'
            }
          }
        }
        }} />
        </div>
      ))}
    </div>
  );
};

export default CR_Chunk;
