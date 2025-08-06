import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Polyline  } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
}

interface LocationMapProps {
  pickupLocation: Location;
  dropoffLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  className?: string;
  zoom?: number;
}

const markerIcons = {
  pickup: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  dropoff: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
};

const MapController: React.FC<{ onLocationSelect: (location: Location) => void }> = ({ 
  onLocationSelect 
}) => {
  const map = useMap();

  useMapEvents({
  click: (e) => {
    const { lat, lng } = e.latlng;
    if (typeof lat === 'number' && typeof lng === 'number') {
      onLocationSelect(lat, lng);
      map.flyTo(e.latlng, map.getZoom());
    } else {
      console.error('Invalid coordinates received:', e.latlng);
    }
  },
  });

  return null;
};

const LocationMap: React.FC<LocationMapProps> = ({
  pickupLocation,
  dropoffLocation,
  onLocationSelect,
  className = 'h-[500px] w-full rounded-xl',
  zoom = 13
}) => {
  const mapRef = React.useRef<L.Map | null>(null);

  React.useEffect(() => {
    const handleResize = () => {
      mapRef.current?.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={className}>
      <MapContainer
        center={pickupLocation}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => { 
          mapRef.current = map;
          if (isNaN(pickupLocation.lat) || isNaN(pickupLocation.lng)) {
            console.error('إحداثيات أولية غير صالحة:', pickupLocation);
            map.setView([24.7136, 46.6753], zoom); 
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={pickupLocation} icon={markerIcons.pickup}>
          <Popup>مكان الاستلام</Popup>
        </Marker>

        {dropoffLocation && (
          <Marker position={dropoffLocation} icon={markerIcons.dropoff}>
            <Popup>مكان التسليم</Popup>
          </Marker>
        )}
        {pickupLocation && dropoffLocation && (
        <Polyline 
          positions={[
            [pickupLocation.lat, pickupLocation.lng],
            [dropoffLocation.lat, dropoffLocation.lng]
          ]}
          color="#E6911E"
          weight={3}
          opacity={0.7}
        />
      )}

        <MapController onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default React.memo(LocationMap); 