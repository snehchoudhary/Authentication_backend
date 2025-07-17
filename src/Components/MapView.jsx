import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

function MapView({ markers }) {
  const GOOGLE_MAPS_API_KEY = "AIzaSyBGbJzKewQxP8AG3pxM-pOHC7DE35Xt_-M"; // Replace with your API key


  // const customIcon ={
  // url: "google-map-csv/src/circled.png",
  // scaledSize: new window.google.maps.Size(20, 20),
  // origin: new window.google.maps.Point(0, 0),
  // anchor: new window.google.maps.Point(10, 10),
  // };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} title={`Lat: ${marker.lat}, Lng: ${marker.lng}`} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapView;
