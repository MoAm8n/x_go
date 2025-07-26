import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface Location {
  id: number;
  location: string;
  latitude: string;
  longitude: string;
  is_active?: number;
}

interface LocationMapProps {
  locations: Location[];
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  fullscreen?: boolean;
  onLocationSelect?: (lat: string, lng: string) => void;
  onClose?: () => void;
}

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMap: React.FC<LocationMapProps> = ({ 
  locations, 
  pickupLocation, 
  dropoffLocation,
  fullscreen = false,
  onLocationSelect,
  onClose
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [clickedLocation, setClickedLocation] = useState<{lat: string, lng: string} | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0 || mapInstance.current) return;

    const firstLocation = locations[0];
    mapInstance.current = L.map(mapRef.current, {
      preferCanvas: true,
    }).setView(
      [parseFloat(firstLocation.latitude), parseFloat(firstLocation.longitude)], 
      12
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    if (onLocationSelect) {
      mapInstance.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setClickedLocation({ lat: lat.toString(), lng: lng.toString() });
        onLocationSelect(lat.toString(), lng.toString());
        
        if (selectionMarkerRef.current) {
          selectionMarkerRef.current.setLatLng([lat, lng]);
        } else {
          selectionMarkerRef.current = L.marker([lat, lng], {
            icon: new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
              shadowUrl: markerShadow,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          }).addTo(mapInstance.current!)
          .bindPopup('Selected Location');
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.off('click');
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      selectionMarkerRef.current = null;
    };
  }, [locations, onLocationSelect]);

  useEffect(() => {
    if (!mapInstance.current || !pickupLocation || !dropoffLocation) return;

    markersRef.current.forEach(marker => {
      if (marker && marker.remove && marker !== selectionMarkerRef.current) {
        marker.remove();
      }
    });
    markersRef.current = [];

    const pickupMarker = L.marker(
      [parseFloat(pickupLocation.latitude), parseFloat(pickupLocation.longitude)], 
      {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }
    )
    .addTo(mapInstance.current)
    .bindPopup(`Pickup: ${pickupLocation.location}`)
    .openPopup();

    const dropoffMarker = L.marker(
      [parseFloat(dropoffLocation.latitude), parseFloat(dropoffLocation.longitude)], 
      {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }
    )
    .addTo(mapInstance.current)
    .bindPopup(`Dropoff: ${dropoffLocation.location}`);

    markersRef.current.push(pickupMarker, dropoffMarker);

    const bounds = L.latLngBounds(
      [parseFloat(pickupLocation.latitude), parseFloat(pickupLocation.longitude)],
      [parseFloat(dropoffLocation.latitude), parseFloat(dropoffLocation.longitude)]
    );
    
    if (selectionMarkerRef.current) {
      bounds.extend(selectionMarkerRef.current.getLatLng());
    }
    
    mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
  }, [pickupLocation, dropoffLocation]);

  return (
    <div className="relative">
      {fullscreen && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-[#E6911E] text-white px-4 py-2 rounded-lg hover:bg-[#D6820E]"
        >
          Close Map
        </button>
      )}
      <div 
        ref={mapRef} 
        className={`rounded-xl ${fullscreen ? 'fixed inset-0 z-40' : 'h-full'}`}
        style={{ height: fullscreen ? '60vh' : '400px' }}
      />
    </div>
  );
};

export default LocationMap;