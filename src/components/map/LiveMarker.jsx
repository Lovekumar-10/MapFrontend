


import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useMemo } from "react";

const createMarkerIcon = (type, heading = 0) => {
  let svg = "";
  let size = [30, 30]; 
  let anchor = [15, 15]; // Center for dots

  switch (type) {
    case "START":
      size = [24, 24];
      anchor = [12, 12]; // Center anchor
      svg = `
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="white" stroke="#3B82F6" stroke-width="3"/>
          <circle cx="12" cy="12" r="5" fill="#3B82F6"/>
        </svg>`;
      break;

    case "DESTINATION":
      size = [40, 45];
      anchor = [20, 45]; // TIP anchor (Bottom of the pin)
      svg = `
        <svg width="40" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.7C16 18.5 20 15 20 10.5C20 6 16.4 2.5 12 2.5C7.6 2.5 4 6 4 10.5C4 15 8 18.5 12 21.7Z" fill="#EF4444" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="10.5" r="3" fill="white"/>
        </svg>`;
      break;

    case "LIVE":
      size = [50, 50];
      anchor = [25, 25];
      svg = `
        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="10" fill="#fe3b3b" opacity="0.3">
            <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
          </circle>
          <g transform="rotate(${heading}, 25, 25)">
             <path d="M25 10 L35 40 L25 35 L15 40 Z" fill="#fe3b3b" stroke="white" stroke-width="2"/>
          </g>
        </svg>`;
      break;
  }

  return new L.DivIcon({
    html: svg,
    className: `custom-marker-${type.toLowerCase()}`,
    iconSize: size,
    iconAnchor: anchor,
  });
};

const LiveMarker = ({ position, type = "LIVE", heading = 0, label = "" }) => {
  const markerRef = useRef(null);
  const icon = useMemo(() => createMarkerIcon(type, heading), [type, heading]);

  useEffect(() => {
    if (position && markerRef.current) {
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  return (
    <Marker ref={markerRef} position={position} icon={icon}>
      <Popup>
        <div className="text-xs font-bold">
            <p className="text-gray-400 uppercase text-[9px]">{type}</p>
            <p>{label || "Location Selected"}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default LiveMarker;