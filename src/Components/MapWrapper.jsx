import React from "react";
// import Papa from "papaparse";
import MapView from "./MapView";

function MapWrapper({markers}) {
  // const [markers, setMarkers] = useState([]);

  // useEffect(() => {
  //   Papa.parse("/MergeCustomExport.csv", {
  //     download: true,
  //     header: true,
  //     dynamicTyping: true,
  //     complete: (result) => {
  //       const filteredMarkers = result.data
  //         .filter(
  //           (item) =>
  //             item.Latitude !== undefined &&
  //             item.Longitude !== undefined &&
  //             !isNaN(item.Latitude) &&
  //             !isNaN(item.Longitude)
  //         )
  //         .map((item) => ({
  //           lat: item.Latitude,
  //           lng: item.Longitude,
  //         }));

  //       setMarkers(filteredMarkers);
  //     },
  //   });
  // }, []);

  return <MapView markers={markers} />;
}

export default MapWrapper;
