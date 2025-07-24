import React, { useContext } from 'react';
import { FileContext } from './FileContext';
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
import annotationPlugin from 'chartjs-plugin-annotation';
import {useNavigate} from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const ElevationChart = () => {
  const { fileDataICE } = useContext(FileContext);
  const navigate = useNavigate();

  console.log('ElevationChart fileDataICE:', fileDataICE);

  const xKey = 'Chainage (m)';
  const yKey1 = 'Elevation (m)';
  const yKey2 = 'HL (Abbls)';

  // Clean and trim column headers (just in case)
  const cleanData = fileDataICE.map(row => {
    const cleaned = {};
    Object.keys(row).forEach(key => {
      cleaned[key.trim()] = row[key];
    });
    return cleaned;
  });

  const labels = cleanData.map((row) => row[xKey]);
  const elevationValues = cleanData.map((row) => row[yKey1]);
  const hlValues = cleanData.map((row) => row[yKey2]);

  console.log('ElevationChart labels:', labels);
  console.log('ElevationChart elevationValues:', elevationValues);
  console.log('ElevationChart hlValues:', hlValues);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${yKey1} vs ${xKey}`,
        data: elevationValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        yAxisID: 'y', //Primary Axis
      },

       {
        label: `${yKey2} vs ${xKey}`,
        data: hlValues,
        fill: false,
        borderColor: 'lightpink',
        tension: 0.4,
        yAxisID: 'y1', //Secondary Axis
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Elevation & HL vs Chainage`,
      },
      legend: {
        display: true,
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: xKey,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: yKey1,  //Elevation
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: yKey2, //HL
        },
        grid: {
          drawOnChartArea: false,  //avoids overlaps of grid lines
        },
      },
    },
  };

  return (
    <div style = {{ maxWidth: '100%',
      margin: '21px auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    }}>
      <h2>Chart Of Rolled-up</h2>
      {fileDataICE.length > 0 ? <Line data={chartData} options={options} /> :null}

       {/* Button to show chunks */}

      <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <button style={{fontSize: '18px', cursor: 'pointer'}} onClick={() => {
          const input = prompt('Enter chunk size in meters: ');
          if (input && !isNaN(input)) {
            window.open(`/rolledUp-chunks?chunk=${input}`, '_blank');
          }
        }}>
          Show Section-wise Charts
        </button>
      </div>
  </div>
  );
};

export default ElevationChart;
