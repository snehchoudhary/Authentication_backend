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

const Elevation_Chunks = () => {
  const { fileDataICE } = useContext(FileContext);
  const query = new URLSearchParams(useLocation().search);
  const chunkSize = parseInt(query.get('chunk') || '500');

  const filtered = fileDataICE.filter(
    (item) =>
      item['Chainage (m)'] &&
      item['Elevation (m)'] &&
      item['HL (Abbls)']&&
      !isNaN(item['Chainage (m)']) &&
      !isNaN(item['Elevation (m)'])&&
      !isNaN(item['HL (Abbls)'])
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
      const dataOn = chunk.map(item => Number(item['Elevation (m)']));
      const dataOff = chunk.map(item => Number(item['HL (Abbls)']));

      chunks.push({
        title: `${start}m - ${end}m`,
        data: {
          labels,
          datasets: [
            {
              label: 'Elevation (m)',
              data: dataOn,
              borderColor: 'skyblue',
              backgroundColor: 'lightblue',
              tension: 0.4,
              fill: false,
              yAxisID: 'y',  //Primary Y-Axis
            },
             {
              label: 'HL (Abbls)',
              data: dataOff,
              borderColor: 'lightgreen',
              backgroundColor: 'green',
              tension: 0.4,
              fill: false,
              yAxisID: 'y1', //Secondary Y-Axis
            },
          ],
        },
        options: {
          responsive: true,
          plugin: {
            legend:{
              position: 'top',
            },
            title: {
              display: true,
              text: `Elevation & HL vs Chainage (${start}m - ${end}m)`
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Chainage (m)',
              },
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Elevation (m)',
              },
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'HL (Abbls)',
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
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
          <Line data={chunk.data} options={chunk.options} />
        </div>
      ))}
    </div>
  );
};

export default Elevation_Chunks;
