import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface LocationMapProps {
  pickupLocation: { lat: number; lng: number };
  onDropoffSelect: (lat: number, lng: number) => void;
  dropoffLocation: { lat: number; lng: number } | null;
  className?: string;
  zoom?: number;
}

const MapClickHandler: React.FC<{ 
  onDropoffSelect: (lat: number, lng: number) => void;
}> = ({ onDropoffSelect }) => {
  const map = useMap();
  const [clickedPosition, setClickedPosition] = React.useState<L.LatLng | null>(null);
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setClickedPosition(L.latLng(lat, lng));
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return clickedPosition ? (
    <>
      <Marker 
        position={clickedPosition} 
        icon={dropoffIcon}
        interactive={false}
      >
        <Popup>موقع التسليم المقترح</Popup>
      </Marker>
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control leaflet-bar p-2 bg-white shadow-lg rounded">
          <p className="mb-2">تأكيد موقع التسليم؟</p>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => {
                console.log("Confirming dropoff:", { lat: clickedPosition.lat, lng: clickedPosition.lng });
                onDropoffSelect(clickedPosition.lat, clickedPosition.lng);
                setClickedPosition(null);
              }}
            >
              تأكيد
            </button>
            <button 
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => {
                console.log("Cancelling dropoff selection");
                setClickedPosition(null);
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

const FitBounds: React.FC<{
  pickupLocation: { lat: number; lng: number };
  dropoffLocation: { lat: number; lng: number } | null;
}> = ({ pickupLocation, dropoffLocation }) => {
  const map = useMap();

  React.useEffect(() => {
    if (dropoffLocation) {
      const bounds = L.latLngBounds(
        [pickupLocation.lat, pickupLocation.lng],
        [dropoffLocation.lat, dropoffLocation.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.flyTo([pickupLocation.lat, pickupLocation.lng], 15);
    }
  }, [pickupLocation, dropoffLocation, map]);

  return null;
};

const LocationMap: React.FC<LocationMapProps> = React.memo(({ 
  pickupLocation,
  onDropoffSelect,
  dropoffLocation,
  className = "h-[500px] w-full rounded-xl",
  zoom = 13,
}) => {
  const mapRef = useRef<L.Map>(null);

  React.useEffect(() => {
    const leafletContainer = mapRef.current?.getContainer();
    if (leafletContainer) {
      leafletContainer.style.height = '100%';
      leafletContainer.style.width = '100%';
    }
  }, []);

  const routePoints = React.useMemo(() => {
    if (dropoffLocation) {
      return [
        [pickupLocation.lat, pickupLocation.lng],
        [dropoffLocation.lat, dropoffLocation.lng]
      ] as L.LatLngExpression[];
    }
    return [];
  }, [pickupLocation, dropoffLocation]);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <MapContainer 
        center={pickupLocation} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        whenCreated={(map) => {
          map.invalidateSize();
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapClickHandler onDropoffSelect={onDropoffSelect} />

        <FitBounds 
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
        />

        <Marker 
          position={[pickupLocation.lat, pickupLocation.lng]} 
          icon={pickupIcon}
          interactive={false}
        >
          <Popup>مكان الاستلام الثابت</Popup>
        </Marker>

        {dropoffLocation && (
          <Marker 
            position={[dropoffLocation.lat, dropoffLocation.lng]} 
            icon={dropoffIcon}
            interactive={false}
          >
            <Popup>مكان التسليم</Popup>
          </Marker>
        )}

        {routePoints.length === 2 && (
          <Polyline 
            positions={routePoints}
            color="#E6911E"
            weight={3}
            dashArray="5, 5"
          />
        )}
      </MapContainer>
    </div>
  );
});

export default LocationMap;