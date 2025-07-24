// import React, { useContext, useState, useRef } from 'react';
// import { FileContext } from './FileContext';
// import { useLocation } from 'react-router-dom';
// import annotationPlugin from 'chartjs-plugin-annotation';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// //export pdf
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

// const ACPSP_Chunks = () => {
//   const { fileDataXLI } = useContext(FileContext);
//   const query = new URLSearchParams(useLocation().search);
//   const chunkSize = parseInt(query.get('chunk') || '500');
//    // Allow user to add threshold values
//         const [threshold1, setThreshold1] = useState(30);


//         // Reference for PDF export
//          const chartContainerRef = useRef(null); 


//          //Recently Added
//           if (!fileDataXLI.length) {
//     return <div style={{ padding: '2rem' }}>⚠️ Please upload the XLI file first.</div>;
//   }

//   const filtered = fileDataXLI.filter(
//     (item) =>
//       item['VirtualDistance (m)'] &&
//       item['ACPSP_OnPotential'] &&
//       !isNaN(item['VirtualDistance (m)']) &&
//       !isNaN(item['ACPSP_OnPotential'])
//   );

//   const maxDist = Math.max(...filtered.map(row => Number(row['VirtualDistance (m)'])));
//   const chunks = [];

//   for (let start = 0; start < maxDist; start += chunkSize) {
//     const end = start + chunkSize;
//     const chunk = filtered.filter(row =>
//       Number(row['VirtualDistance (m)']) >= start &&
//       Number(row['VirtualDistance (m)']) < end
//     );

//     if (chunk.length > 0) {
//       const labels = chunk.map(item => Number(item['VirtualDistance (m)']).toFixed(2));
//       const dataOn = chunk.map(item => Number(item['ACPSP_OnPotential']));

//       chunks.push({
//         title: `${start}m - ${end}m`,
//         data: {
//           labels,
//           datasets: [
//             {
//               label: 'ACPSP_OnPotential',
//               data: dataOn,
//               borderColor: 'orange',
//               backgroundColor: 'orange',
//               tension: 0.4,
//               fill: false,
//             },
//           ],
//         },
//       });
//     }
//   }





//    const handleExportPDF = async () => {
//     const input = chartContainerRef.current;
//     const canvas = await html2canvas(input, { scale: 2 });
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF({
//       orientation: 'portrait',
//       unit: 'pt',
//       format: 'a4',
//     });

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const imgProps = pdf.getImageProperties(imgData);

//     const imgWidth = pageWidth - 40;
//     const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

//     let y = 20;

//     // If the image is taller than one page
//     if (imgHeight < pageHeight - 40) {
//       pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight);
//     } else {
//       // For long content, split into multiple pages
//       let position = 0;
//       while (position < imgHeight) {
//         pdf.addImage(imgData, 'PNG', 20, -position + 20, imgWidth, imgHeight);
//         position += pageHeight - 40;
//         if (position < imgHeight) {
//           pdf.addPage();
//         }
//       }
//     }

//     pdf.save('ACPSP_Sectionwise_Charts.pdf');
//   };






//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Section-wise Charts of ACPSP_OnPotential for (Every {chunkSize}m)</h2>

//       <h3>Adjust Threshold Value according to yourself</h3>

//       <div style={{ marginBottom: '1rem' }}>
//         <label>
//           Threshold:
//           <input type="number"
//             value={threshold1}
//             onChange={(e) => setThreshold1(Number(e.target.value))} />
//         </label>
    



//       <button onClick={handleExportPDF} style={{ padding: '6px 12px', cursor: 'pointer' }}>
//           📄 Export All Charts as PDF
//         </button>
//       </div>




// {/* 
//       {chunks.map((chunk, i) => (
//         <div key={i} style={{ marginBottom: '2rem' }}>
//           <h3>{chunk.title}</h3>
//           <Line data={chunk.data} options={{ responsive: true, plugins: { legend: { position: 'top' },
          
//          // Adding 2 solid lines in chart
//         annotation: {
//           annotations: {
//             line1: {
//               type: 'line',
//               yMin: threshold1,
//               yMax: threshold1,
//               borderColor: 'black',
//               borderWidth: 2,
//               label: {
//                 display: true,
//                 content: `Threshold ${threshold1}`,
//                 position: 'start',
//                 color: 'red',
//                 font: 5,
//               },
//             },
//           },
//         },
//         },
        
//         scales: {
//           x: {
//             title: {
//               display: true,
//               text: 'Virtual Distance (m)',
//             },
//           },
//           y: {
//             title: {
//               display: true,
//               text: 'ACPSP_OnPotential',
//             },
//           },
//         },
//         }} />
//         </div>
//       ))} */}

//       <div ref={chartContainerRef}>
//         {chunks.map((chunk, i) => (
//           <div
//             key={i}
//             style={{
//               marginBottom: '2rem',
//               padding: '1rem',
//               border: '1px solid #ccc',
//               borderRadius: '8px',
//               boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//               backgroundColor: '#fff'
//             }}
          
//           >
            
//             <h3>{chunk.title}</h3>
//             <Line
//               data={chunk.data}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: { position: 'top' },
//                   annotation: {
//                     annotations: {
//                       line1: {
//                         type: 'line',
//                         yMin: threshold1,
//                         yMax: threshold1,
//                         borderColor: 'black',
//                         borderWidth: 2,
//                         label: {
//                           display: true,
//                           content: `Threshold ${threshold1}`,
//                           position: 'start',
//                           color: 'red',
//                         },
//                       },
//                     },
//                   },
//                 },
//                 scales: {
//                   x: {
//                     title: {
//                       display: true,
//                       text: 'Virtual Distance (m)',
//                     },
//                   },
//                   y: {
//                     title: {
//                       display: true,
//                       text: 'ACPSP_OnPotential',
//                     },
//                   },
//                 },
//               }}
            
//             />
//           </div>
//         ))}
//     </div>
//   );
// };

// export default ACPSP_Chunks;


import React, { useContext, useState, useRef } from 'react';
import { FileContext } from './FileContext';
import { useLocation } from 'react-router-dom';
import annotationPlugin from 'chartjs-plugin-annotation';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const ACPSP_Chunks = () => {
  const { fileDataXLI } = useContext(FileContext);
  const query = new URLSearchParams(useLocation().search);
  const chunkSize = parseInt(query.get('chunk') || '500');
  const [threshold1, setThreshold1] = useState(30);

  const chartContainerRef = useRef(null); // Reference for PDF export

  const getKeyInsensitive = (obj, key) => {
    return Object.keys(obj).find(k => k.trim().toLowerCase() === key.toLowerCase());
  };

  if (!fileDataXLI.length) {
    return <div style={{ padding: '2rem' }}>⚠️ Please upload the XLI file first.</div>;
  }

  const distKey = getKeyInsensitive(fileDataXLI[0], 'VirtualDistance (m)');
  const potKey = getKeyInsensitive(fileDataXLI[0], 'ACPSP_OnPotential');

  const filtered = fileDataXLI.filter(item =>
    item[distKey] !== undefined &&
    item[potKey] !== undefined &&
    !isNaN(item[distKey]) &&
    !isNaN(item[potKey])
  );

  const maxDist = Math.max(...filtered.map(row => Number(row[distKey])));
  const chunks = [];

  for (let start = 0; start < maxDist; start += chunkSize) {
    const end = start + chunkSize;
    const chunk = filtered.filter(row =>
      Number(row[distKey]) >= start && Number(row[distKey]) < end
    );

    if (chunk.length > 0) {
      const labels = chunk.map(item => Number(item[distKey]).toFixed(2));
      const dataOn = chunk.map(item => Number(item[potKey]));

      chunks.push({
        title: `${start}m - ${end}m`,
        data: {
          labels,
          datasets: [
            {
              label: 'ACPSP_OnPotential',
              data: dataOn,
              borderColor: 'orange',
              backgroundColor: 'orange',
              tension: 0.4,
              fill: false,
            },
          ],
        },
      });
    }
  }

  const handleExportPDF = async () => {
    const input = chartContainerRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);

    const imgWidth = pageWidth - 40;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let y = 20;

    // If the image is taller than one page
    if (imgHeight < pageHeight - 40) {
      pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight);
    } else {
      // For long content, split into multiple pages
      let position = 0;
      while (position < imgHeight) {
        pdf.addImage(imgData, 'PNG', 20, -position + 20, imgWidth, imgHeight);
        position += pageHeight - 40;
        if (position < imgHeight) {
          pdf.addPage();
        }
      }
    }

    pdf.save('ACPSP_Sectionwise_Charts.pdf');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Section-wise Charts of ACPSP_OnPotential (Every {chunkSize}m)</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Threshold:&nbsp;
          <input
            type="number"
            value={threshold1}
            onChange={(e) => setThreshold1(Number(e.target.value))}
          />
        </label>
        &nbsp;&nbsp;
        {/* <button onClick={handleExportPDF} style={{ padding: '6px 12px', cursor: 'pointer' }}>
          📄 Export All Charts as PDF
        </button> */}
      </div>

      <div ref={chartContainerRef}>
        {chunks.map((chunk, i) => (
          <div
            key={i}
            style={{
              marginBottom: '2rem',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}
          >
            <h3>{chunk.title}</h3>
            <Line
              data={chunk.data}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
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
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ACPSP_Chunks;
