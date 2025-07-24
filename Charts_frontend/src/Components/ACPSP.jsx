import React, { useContext, useEffect, useState } from 'react';
import { FileContext } from './FileContext';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {useNavigate} from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

function ACPSP() {
  const { fileDataXLI } = useContext(FileContext);
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});
  // Allow user to add threshold values
  const [threshold1, setThreshold1] = useState(30);

  const navigate = useNavigate();

  // Chunk Charts
  // const [showChunks, setShowChunks] = useState(false);
  // const [chunkSize, setChunkSize] = useState(500);

  useEffect(() => {
    if (fileDataXLI.length === 0) {
      console.warn('fileDataXLI is empty');
      return;
    }

    // Check if expected columns exist (case-insensitive)
    const hasVirtualDistance = fileDataXLI.some(item =>
      Object.keys(item).some(key => key.trim().toLowerCase() === 'virtualdistance (m)'));
    const hasACVG = fileDataXLI.some(item =>
      Object.keys(item).some(key => key.trim().toLowerCase() === 'acpsp_onpotential'));

    if (!hasVirtualDistance || !hasACVG) {
      console.error('Required columns "VirtualDistance (m)" or "ACPSP_OnPotential" not found in data');
      return;
    }

    // Filter out rows where either label or data is missing or invalid
    const filteredData = fileDataXLI.filter(
      (item) => {
        const vdKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'virtualdistance (m)');
        const acpspKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'acpsp_onpotential');
        return (
          item[vdKey] !== undefined &&
          item[vdKey] !== null &&
          item[vdKey].toString().trim() !== '' &&
          !isNaN(Number(item[vdKey])) &&
          item[acpspKey] !== undefined &&
          item[acpspKey] !== null &&
          item[acpspKey].toString().trim() !== '' &&
          !isNaN(Number(item[acpspKey]))
        );
      }
    );

    const labels = filteredData
      .map((item) => {
        const vdKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'virtualdistance (m)');
        return Number(item[vdKey]);
      })
      .map((val) => {
        if (val >= 1000) {
          return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
          return val.toFixed(2);
        }
      });

    const dataOn = filteredData.map((item) => {
      const acpspKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'acpsp_onpotential');
      return Number(item[acpspKey]);
    });

    if (labels.length === dataOn.length) {
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'ACPSP_OnPotential',
            data: dataOn,
            borderColor: 'orange',
            backgroundColor: 'orange',
            borderWidth: 1,
            fill: false,
            tension: 0.4,
          },
        ],
      });
    } else {
      console.warn('Labels and data length mismatch');
    }
  }, [fileDataXLI]);

  useEffect(() => {
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Virtual Distance vs ACPSP_OnPotential',
        },
        // Adding 2 solid lines in chart
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: threshold1,
              yMax: threshold1,
              borderColor: 'black',
              borderWidth: 2,
              label: {
                display: true,
                content: `Threshold ${threshold1}`,
                position: 'start',
                color: 'red',
                font: 5,
              },
            },
          },
        },
      },

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
            text: 'ACPSP_OnPotential',
          },
        },
      },
    });
  }, [threshold1]);

  // Section-wise charts rendering
  // const renderChunksCharts = () => {
  //   const validData = fileDataXLI.filter((item) =>
  //     item['VirtualDistance (m)'] !== undefined && item['ACPSP_OnPotential'] !== undefined &&
  //     !isNaN(Number(item['VirtualDistance (m)'])) && !isNaN(Number(item['ACPSP_OnPotential']))
  //   );

  //   const maxDistance = Math.max(...validData.map((row) => Number(row['VirtualDistance (m)'])));

  //   const charts = [];

  //   for (let start = 0; start < maxDistance; start += chunkSize) {
  //     const end = start + chunkSize;
  //     const chunk = validData.filter(
  //       (row) =>
  //         Number(row['VirtualDistance (m)']) >= start && Number(row['VirtualDistance (m)']) < end
  //     );

  //     const labels = chunk.map((item) =>
  //       Number(item['VirtualDistance (m)']).toFixed(2)
  //     );

  //     const dataOn = chunk.map((item) =>
  //       Number(item['ACPSP_OnPotential'])
  //     );

  //     if (labels.length && dataOn.length) {
  //       charts.push({
  //         label: `${start}m - ${end}m`,
  //         data: {
  //           labels,
  //           datasets: [
  //             {
  //               label: 'ACPSP_OnPotential',
  //               data: dataOn,
  //               borderColor: 'skyblue',
  //               backgroundColor: 'lightblue',
  //              : tension: 0.4,
  //               fill: false,
  //             },
  //           ],
  //         },
  //       });
  //     }
  //   }
  //   return charts;
  // };

  return (
    <div  style={{
      maxWidth: '100%',
      margin: '21px auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    }}>
      <h1>ACPSP_OnPotential</h1>
       <h3>Adjust Threshold Value according to yourself</h3>

       <div style={{ marginBottom: '1rem' }}>
        <label>
          Threshold:
          <input type="number"
            value={threshold1}
            onChange={(e) => setThreshold1(Number(e.target.value))} />
        </label>
      </div> 



      {chartData.datasets.length > 0 ? (
        <div>
          <Line options={chartOptions} data={chartData} />
        </div>
      ) : (
        <div>Loading...</div>
      )}

      {/* Button to show chunks */}

       <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <button style={{fontSize: '18px', cursor: 'pointer'}} onClick={() => {
          const input = prompt('Enter chunk size in meters: ');
          if (input && !isNaN(input)) {
            window.open(`/acpsp-chunks?chunk=${input}`, '_blank');
          }
        }}>
          Show Section-wise Charts
        </button>
      </div> 

      


      {/* Chunk Wise Charts */}
      {/* {showChunks && (
        <div id='chunk-section' style={{ marginTop: '2rem' }}>
          <h2>Section-wise Charts (Every {chunkSize} meters)</h2>

          {renderChunksCharts().map((chart, index) => (
            <div key={index} style={{ marginBottom: '3rem' }}>
              <h3>{chart.label}</h3>

              <Line
                data={chart.data}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'top' } }
                }} />
            </div>
          ))}
        </div>
      )}*/}
    </div> 
  );
}

export default ACPSP;
