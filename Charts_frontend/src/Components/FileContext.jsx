import React, { createContext, useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [fileDataXLI, setFileDataXLI] = useState([]);
  const [fileNameXLI, setFileNameXLI] = useState('');
  const [fileDataICE, setFileDataICE] = useState([]);
  const [fileNameICE, setFileNameICE] = useState('');
  const [markersXLI, setMarkersXLI] = useState([]);

  // Function to rename duplicate headers uniquely
  const renameDuplicateHeaders = (headers) => {
    const seen = {};
    return headers.map((header) => {
      let newHeader = header;
      if (seen[header]) {
        newHeader = header + '_' + seen[header];
        seen[header] += 1;
      } else {
        seen[header] = 1;
      }
      return newHeader;
    });
  };

  // ✅ Function to extract markers from data
  const extractMarkers = (data) => {
    const latKey = Object.keys(data[0] || {}).find(k => k.toLowerCase() === 'latitude');
    const lngKey = Object.keys(data[0] || {}).find(k => k.toLowerCase() === 'longitude');
    if (!latKey || !lngKey) return [];

    return data
      .map(row => {
        const lat = parseFloat(row[latKey]);
        const lng = parseFloat(row[lngKey]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
        return null;
      })
      .filter(Boolean);
  };

  const handleFileUpload = (file, fileType) => {
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const supported = ['csv', 'xls', 'xlsx'];

    if (!supported.includes(ext)) {
      alert('Unsupported file format. Please upload a .csv, .xls, or .xlsx file.');
      return;
    }

    if (fileType === 'XLI') {
      setFileNameXLI(file.name);
    } else if (fileType === 'ICE') {
      setFileNameICE(file.name);
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;

      if (ext === 'csv') {
        Papa.parse(fileContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header) => {
            return header.trim();
          },
          complete: (result) => {
            if (result.meta && result.meta.fields) {
              const renamedHeaders = renameDuplicateHeaders(result.meta.fields);
              const renamedData = result.data.map(row => {
                const newRow = {};
                renamedHeaders.forEach((newHeader, index) => {
                  const oldHeader = result.meta.fields[index];
                  newRow[newHeader] = row[oldHeader];
                });
                return newRow;
              });
              if (fileType === 'XLI') {
                setFileDataXLI(renamedData);
                setMarkersXLI(extractMarkers(renamedData));
              } else if (fileType === 'ICE') {
                setFileDataICE(renamedData);
              }
            } else {
              if (fileType === 'XLI') {
                setFileDataXLI(result.data);
                setMarkersXLI(extractMarkers(result.data));
              } else if (fileType === 'ICE') {
                setFileDataICE(result.data);
              }
            }
          },
        });
      } else if (ext === 'xls' || ext === 'xlsx') {
        const workbook = XLSX.read(fileContent, { type: 'binary' });
        const sheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheet];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '', range: 1 });
        if (fileType === 'XLI') {
          setFileDataXLI(jsonData);
          setMarkersXLI(extractMarkers(jsonData));
        } else if (fileType === 'ICE') {
          setFileDataICE(jsonData);
        }
      }
    };

    if (ext === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  return (
    <FileContext.Provider value={{ fileDataXLI, fileNameXLI, fileDataICE, fileNameICE,markersXLI, handleFileUpload }}>
      {children}
    </FileContext.Provider>
  );
};
