import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker,  useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './fallmap.css';

const fallIcon = new L.Icon({
  iconUrl: 'pin.png',
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const currentLocationIcon = new L.Icon({
  iconUrl: 'current.png',
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationMarker = ({ setPosition }) => {
    const map = useMap();
  
    const onLocationFound = (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    };
  
    useMapEvents({
      locationfound: onLocationFound,
    });
  
    return null;
  };
  
  const GoToLocationButton = ({ setPosition }) => {
    const map = useMap();
  
    const handleClick = () => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
    };
  
    return (
      <button className="go-to-location-button" onClick={handleClick}>
        &#10012;
      </button>
    );
  };
  
  const FitBoundsToFallLocations = ({ areaFallData }) => {
    const map = useMap();
  
    useEffect(() => {
      if (areaFallData.length > 0) {
        const validAreas = areaFallData.filter(area => area.latitude && area.longitude);
        if (validAreas.length > 0) {
          const bounds = L.latLngBounds(validAreas.map(area => [area.latitude, area.longitude]));
          map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 15
          });
        }
      }
    }, [map, areaFallData]);
  
    return null;
  };
  
  const FallMap = ({ areaFallData }) => {
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [mapZoom, setMapZoom] = useState(2);
    const [position, setPosition] = useState(null);
  
    useEffect(() => {
      if (areaFallData.length > 0) {
        const validAreas = areaFallData.filter(area => area.latitude && area.longitude);
        if (validAreas.length > 0) {
          const latitudes = validAreas.map(area => area.latitude);
          const longitudes = validAreas.map(area => area.longitude);
          const avgLat = latitudes.reduce((a, b) => a + b) / latitudes.length;
          const avgLng = longitudes.reduce((a, b) => a + b) / longitudes.length;
          setMapCenter([avgLat, avgLng]);
          
          const latRange = Math.max(...latitudes) - Math.min(...latitudes);
          const lngRange = Math.max(...longitudes) - Math.min(...longitudes);
          const maxRange = Math.max(latRange, lngRange);
          const zoom = Math.floor(14 - Math.log2(maxRange));
          setMapZoom(zoom);
        }
      }
    }, [areaFallData]);
  
    return (
      <div className="fall-map-container">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          className="fall-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {areaFallData.map((area, index) => (
            area.latitude && area.longitude ? (
              <React.Fragment key={index}>
                <Marker position={[area.latitude, area.longitude]} icon={fallIcon}>
                  <Popup>
                    <strong>{area.area}</strong><br />
                    Falls: {area.falls}
                  </Popup>
                </Marker>
                <CircleMarker 
                  center={[area.latitude, area.longitude]}
                  radius={Math.sqrt(area.falls) * 5}
                  fillColor="#ff7800"
                  color="#000"
                  weight={1}
                  opacity={1}
                  fillOpacity={0.8}
                >
                  <Popup>
                    <strong>{area.area}</strong><br />
                    Falls: {area.falls}
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            ) : null
          ))}
          {position && (
            <Marker position={position} icon={currentLocationIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}
          <LocationMarker setPosition={setPosition} />
          <FitBoundsToFallLocations areaFallData={areaFallData} />
          <GoToLocationButton setPosition={setPosition} />
        </MapContainer>
      </div>
    );
  };
  
  export default FallMap;