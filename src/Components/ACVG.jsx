import React, { useContext, useEffect, useState } from 'react';
import { FileContext } from './FileContext';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {useNavigate} from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

function ACVG() {
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
      Object.keys(item).some(key => key.trim().toLowerCase() === 'acvg_vss_db'));

    if (!hasVirtualDistance || !hasACVG) {
      console.error('Required columns "VirtualDistance (m)" or "ACVG_VSS_DB" not found in data');
      return;
    }

    // Filter out rows where either label or data is missing or invalid
    const filteredData = fileDataXLI.filter(
      (item) => {
        const vdKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'virtualdistance (m)');
        const acvgKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'acvg_vss_db');
        return (
          item[vdKey] !== undefined &&
          item[vdKey] !== null &&
          item[vdKey].toString().trim() !== '' &&
          !isNaN(Number(item[vdKey])) &&
          item[acvgKey] !== undefined &&
          item[acvgKey] !== null &&
          item[acvgKey].toString().trim() !== '' &&
          !isNaN(Number(item[acvgKey]))
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
      const acvgKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'acvg_vss_db');
      return Number(item[acvgKey]);
    });

    if (labels.length === dataOn.length) {
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'ACVG_VSS_DB',
            data: dataOn,
            borderColor: 'lightgreen',
            backgroundColor: 'green',
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
          text: 'Virtual Distance vs ACVG',
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
            text: 'ACVG_VSS_DB',
          },
        },
      },
    });
  }, [threshold1]);

  // Section-wise charts rendering
  // const renderChunksCharts = () => {
  //   const validData = fileData.filter((item) =>
  //     item['VirtualDistance (m)'] !== undefined && item['ACVG_VSS_DB'] !== undefined &&
  //     !isNaN(Number(item['VirtualDistance (m)'])) && !isNaN(Number(item['ACVG_VSS_DB']))
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
  //       Number(item['ACVG_VSS_DB'])
  //     );

  //     if (labels.length && dataOn.length) {
  //       charts.push({
  //         label: `${start}m - ${end}m`,
  //         data: {
  //           labels,
  //           datasets: [
  //             {
  //               label: 'ACVG_VSS_DB',
  //               data: dataOn,
  //               borderColor: 'skyblue',
  //               backgroundColor: 'lightblue',
  //               tension: 0.4,
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
    <div>
      <h1>ACVG_VSS_DB</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Threshold1:
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
        <button onClick={() => {
          const input = prompt('Enter chunk size in meters: ');
          if (input && !isNaN(input)) {
            window.open(`/acvg-chunks?chunk=${input}`, '_blank');
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

export default ACVG;
