import React, { useContext, useEffect, useState } from 'react';
import { FileContext } from './FileContext';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {useNavigate} from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

function DCVG() {
  const { fileDataXLI } = useContext(FileContext);
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});
  // Allow user to add threshold values
  // const [threshold1, setThreshold1] = useState(30);

  const [thresholdMin, setThresholdMin] = useState(0);
    const [thresholdMax, setThresholdMax] = useState(100);
    const [error, setError] = useState('');

  const navigate = useNavigate();

  // Chunk Charts
  // const [showChunks, setShowChunks] = useState(false);
  // const [chunkSize, setChunkSize] = useState(500);

  useEffect(() => {
    if (fileDataXLI.length === 0) {
      console.warn('fileDataXLI is empty');
      return;
    }

     // Validate thresholds
    if (thresholdMin < 0 || thresholdMax > 100 || thresholdMin > thresholdMax) {
      setError('Thresholds must be between 0 and 100, and min ≤ max');
      return;
    } else {
      setError('');
    }

    // Check if expected columns exist (case-insensitive)
    const hasVirtualDistance = fileDataXLI.some(item =>
      Object.keys(item).some(key => key.trim().toLowerCase() === 'virtualdistance (m)'));
    const hasDCVG = fileDataXLI.some(item =>
      Object.keys(item).some(key => key.trim().toLowerCase() === 'dcvgpercentir'));

    if (!hasVirtualDistance || !hasDCVG) {
      console.error('Required columns "VirtualDistance (m)" or "DCVGPercentIR" not found in data');
      return;
    }

    // Filter out rows where either label or data is missing or invalid
    const filteredData = fileDataXLI.filter(
      (item) => {
        const vdKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'virtualdistance (m)');
        const dcvgKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'dcvgpercentir');
        return (
          item[vdKey] !== undefined &&
          item[vdKey] !== null &&
          item[vdKey].toString().trim() !== '' &&
          !isNaN(Number(item[vdKey])) &&
          item[dcvgKey] !== undefined &&
          item[dcvgKey] !== null &&
          item[dcvgKey].toString().trim() !== '' &&
          !isNaN(Number(item[dcvgKey]))&&
            Number(item[dcvgKey]) >= thresholdMin &&
            Number(item[dcvgKey]) <= thresholdMax
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
      const dcvgKey = Object.keys(item).find(key => key.trim().toLowerCase() === 'dcvgpercentir');
      return Number(item[dcvgKey]);
    });

    if (labels.length === dataOn.length) {
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'DCVGPercentIR',
            data: dataOn,
            borderColor: '#f542dd',
            backgroundColor: '#f542dd',
            borderWidth: 1,
            fill: false,
            tension: 0.4,
          },
        ],
      });
    } else {
      console.warn('Labels and data length mismatch');
    }
  }, [fileDataXLI, thresholdMin, thresholdMax]);

  useEffect(() => {
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Virtual Distance vs DCVGPercentIR',
        },

        // Adding 2 solid lines in chart
        // annotation: {
        //   annotations: {
        //     line1: {
        //       type: 'line',
        //       yMin: threshold1,
        //       yMax: threshold1,
        //       borderColor: 'black',
        //       borderWidth: 2,
        //       label: {
        //         display: true,
        //         content: `Threshold ${threshold1}`,
        //         position: 'start',
        //         color: 'red',
        //         font: 5,
        //       },
        //     },
        //   },
        // },
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
            text: 'DCVGPercentIR',
          },
        },
      },
    });
  }, [thresholdMin, thresholdMax]);

  // Section-wise charts rendering
  // const renderChunksCharts = () => {
  //   const validData = fileDataXLI.filter((item) =>
  //     item['VirtualDistance (m)'] !== undefined && item['DCVGPercentIR'] !== undefined &&
  //     !isNaN(Number(item['VirtualDistance (m)'])) && !isNaN(Number(item['DCVGPercentIR']))
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
  //       Number(item['DCVGPercentIR'])
  //     );

  //     if (labels.length && dataOn.length) {
  //       charts.push({
  //         label: `${start}m - ${end}m`,
  //         data: {
  //           labels,
  //           datasets: [
  //             {
  //               label: 'DCVGPercentIR',
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
    <div style = {{ maxWidth: '100%',
      margin: '21px auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    }}>
      <h1>DCVGPercentIR</h1>
      <h2>Extract data for Min and Max Threshold Values</h2>

      <div style={{ marginBottom: '1rem'}}>
    <label>
      Min Threshold:
      <input type="number"
       value={thresholdMin}
       onChange={(e) => setThresholdMin(Number(e.target.value))} style={{ marginLeft: '0.5rem', marginRight: '1rem'}}
      />
    </label>

    <label>
      Max Threshold:
      <input type="number"
       value={thresholdMax}
       onChange={(e) => setThresholdMax(Number(e.target.value))} style={{ marginLeft: '0.5rem', marginRight: '1rem'}}
      />
    </label>
    </div>

    {error && <p style={{ color: 'red' }}>{error}</p>}



      {chartData.datasets.length > 0 ? (
        <div>
          <Line options={chartOptions} data={chartData} />
        </div>
      ) : (
        <div>Loading...</div>
      )}

      {/* Button to show chunks */}

      <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <button style={{fontSize: '18px', cursor: 'pointer'}}    onClick={() => {
          const input = prompt('Enter chunk size in meters: ');
          if (input && !isNaN(input)) {
            window.open(`/dcvg-chunks?chunk=${input}`, '_blank');
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

export default DCVG;
