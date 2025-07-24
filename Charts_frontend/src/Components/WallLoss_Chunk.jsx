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

const WallLoss_Chunk = () => {
  const { fileDataICE } = useContext(FileContext);
  const query = new URLSearchParams(useLocation().search);
  const chunkSize = parseInt(query.get('chunk') || '500');

  const filtered = fileDataICE.filter(
    (item) =>
      item['Chainage (m)'] &&
      item['%Wall Loss - Worst'] &&
      item['%Wall Loss -  Realistic']&&
      !isNaN(item['Chainage (m)']) &&
      !isNaN(item['%Wall Loss - Worst'])&&
      !isNaN(item['%Wall Loss -  Realistic'])
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
      const dataOn = chunk.map(item => Number(item['%Wall Loss - Worst']));
      const dataOff = chunk.map(item => Number(item['%Wall Loss -  Realistic']));

      chunks.push({
        title: `${start}m - ${end}m`,
        data: {
          labels,
          datasets: [
            {
              label: '%Wall Loss - Worst',
              data: dataOn,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgb(75, 192, 192)',
              tension: 0.4,
              fill: false,
            },
             {
              label: '%Wall Loss - Realistic',
              data: dataOff,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 1)',
              tension: 0.4,
              fill: false,
            },
          ],
        },
      });
    }
  }

  return (
    <div style={{padding: '2rem'}}>
      <h2>Section-wise Charts of %Wall Loss (Worst + Realistic) for (Every {chunkSize}m)</h2>
      {chunks.map((chunk, i) => (
        <div key={i} style={{ marginBottom: '2rem',
           padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
         }}>
          <h3>{chunk.title}</h3>

          <Line data={chunk.data} options={{ responsive: true, plugins: { legend: { position: 'top' } }
        
        // scales: {
        //   x: {
        //     title: {
        //       display: true,
        //       text: 'Chainage (m)',
        //     },
        //   },
        //   y: {
        //     title: {
        //       display: true,
        //       text: '%Wall-Loss (Worst+Realistic)',
        //     },
        //   },
        // },
        }} />
        </div>
      ))}
    </div>
  );
};

export default WallLoss_Chunk;
