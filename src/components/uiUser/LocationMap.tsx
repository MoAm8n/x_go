import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const selectedLocationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

interface LocationMapProps {
  currentPos: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number; lng: number } | null;
  className?: string;
  zoom?: number;
  showCurrentLocation?: boolean;
}

const MapClickHandler: React.FC<{ 
  onLocationSelect: (lat: number, lng: number) => void 
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationMap: React.FC<LocationMapProps> = ({ 
  currentPos, 
  onLocationSelect, 
  selectedLocation,
  className = "h-full w-full rounded-xl",
  zoom = 13,
  showCurrentLocation = true
}) => {
  return (
    <MapContainer
      center={[currentPos.lat, currentPos.lng]}
      zoom={zoom}
      scrollWheelZoom
      className={className}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapClickHandler onLocationSelect={onLocationSelect} />

      {showCurrentLocation && (
        <Marker position={[currentPos.lat, currentPos.lng]} icon={currentLocationIcon}>
          <Popup>Your current location</Popup>
        </Marker>
      )}

      {selectedLocation && (
        <>
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={selectedLocationIcon}>
            <Popup>Selected location</Popup>
          </Marker>

          {showCurrentLocation && (
            <Polyline
              positions={[
                [currentPos.lat, currentPos.lng],
                [selectedLocation.lat, selectedLocation.lng],
              ]}
              color="orange"
              weight={4}
              opacity={0.8}
            />
          )}
        </>
      )}
    </MapContainer>
  );
};

export default LocationMap;