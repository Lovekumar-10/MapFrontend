

// import React, { useEffect, useRef } from "react";
// import { MapContainer, TileLayer, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const RecenterMap = ({ center, isTracking }) => {
//   const map = useMap();
//   const prevCenter = useRef(null);

//   useEffect(() => {
//     if (!center) return;
//     const [lat, lng] = center;

//     // Prevent redundant updates
//     if (prevCenter.current && prevCenter.current[0] === lat && prevCenter.current[1] === lng) {
//       return;
//     }
//     prevCenter.current = center;

//     if (isTracking) {
//       // SMART ZOOM: If the user manually zooms out, keep their zoom level.
//       // If they are zoomed way out, snap to 17 for tracking.
//       const currentZoom = map.getZoom();
//       const targetZoom = currentZoom > 10 ? currentZoom : 17; 
      
//       map.flyTo(center, targetZoom, { duration: 1.2 });
//     } else {
//       // Pan smoothly without forcing a specific zoom level
//       map.panTo(center, { animate: true, duration: 1 });
//     }
//   }, [center, isTracking, map]);

//   return null;
// };

// const MapView = ({ children, tileUrl, center, isTracking }) => {
//   return (
//     <div className="fixed inset-0 w-full h-screen z-0 bg-slate-100 overflow-hidden">
//       <MapContainer
//         center={[28.6139, 77.209]}
//         zoom={13}
//         minZoom={2}     // FIXED: Allows world-view zoom out
//         maxZoom={18}    // FIXED: Street-level detail
//         zoomControl={false}
//         scrollWheelZoom={true}
//         doubleClickZoom={true}
//         worldCopyJump={true}
//         className="h-full w-full outline-none"
//       >
//         <TileLayer
//           attribution='&copy; CARTO'
//           url={tileUrl || "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
//         />
//         <RecenterMap center={center} isTracking={isTracking} />
//         {children}
//       </MapContainer>
//     </div>
//   );
// };

// export default MapView;










// import React, { useEffect, useRef } from "react";
// import { MapContainer, TileLayer, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const RecenterMap = ({ center, isTracking, setMap }) => {
//   const map = useMap();
//   const prevCenter = useRef(null);
//   const wasTracking = useRef(false); // Helps detect the exact moment crosshair is clicked

//   // 1. Send the map instance back to parent
//   useEffect(() => {
//     if (map && setMap) {
//       setMap(map);
//     }
//   }, [map, setMap]);

//   // 2. Updated Logic for Auto-Zoom and Smooth Tracking
//   useEffect(() => {
//     if (!center || !map) return;
//     const [lat, lng] = center;

//     // Detect if tracking was JUST turned on
//     const justStartedTracking = isTracking && !wasTracking.current;
//     wasTracking.current = isTracking;

//     // Prevent redundant updates
//     if (
//       prevCenter.current && 
//       prevCenter.current[0] === lat && 
//       prevCenter.current[1] === lng && 
//       !justStartedTracking
//     ) {
//       return;
//     }
//     prevCenter.current = center;

//     if (isTracking) {
//       const currentZoom = map.getZoom();
      
//       // If we just started tracking OR we are zoomed too far out (city level),
//       // snap in to street level (Zoom 17).
//       if (justStartedTracking || currentZoom < 15) {
//         map.flyTo(center, 17, { 
//           animate: true, 
//           duration: 1.5 
//         });
//       } else {
//         // If we're already close enough, just slide the map smoothly
//         map.panTo(center, { 
//           animate: true, 
//           duration: 0.5 
//         });
//       }
//     } else {
//       // Normal pan for search results or manual moves
//       map.panTo(center, { 
//         animate: true, 
//         duration: 1 
//       });
//     }
//   }, [center, isTracking, map]);

//   return null;
// };
// const MapView = ({ children, tileUrl, center, isTracking, setMap }) => {
//   return (
//     <div className="fixed inset-0 w-full h-screen z-0 bg-slate-100 overflow-hidden">
//       <MapContainer
//         center={[28.6139, 77.209]}
//         zoom={13}
//         minZoom={2}
//         maxZoom={19} // Increased to 19 for better detail
//         zoomControl={false}
//         scrollWheelZoom={true}
//         doubleClickZoom={true}
//         worldCopyJump={true}
//         className="h-full w-full outline-none"
//       >
//         <TileLayer
//           attribution='&copy; CARTO'
//           url={tileUrl || "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
//         />
        
//         {/* Pass setMap here so LiveTracking can use it too */}
//         <RecenterMap center={center} isTracking={isTracking} setMap={setMap} />
        
//         {children}
//       </MapContainer>
//     </div>
//   );
// };

// export default MapView;



import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Important: This plugin enables the .setBearing() method on the map
import "leaflet-rotate"; 

const RecenterMap = ({ center, isTracking, heading, setMap }) => {
  const map = useMap();
  const wasTracking = useRef(false);

  useEffect(() => {
    if (map && setMap) setMap(map);
  }, [map, setMap]);

  useEffect(() => {
    if (!center || !map) return;

    const justStartedTracking = isTracking && !wasTracking.current;
    wasTracking.current = isTracking;

    if (isTracking) {
      // 1. HANDLE ROTATION (The "Heading Up" fix)
      // If heading is provided (0-360), rotate the map to that degree.
      // We use negative heading because we rotate the map *under* the user.
      if (heading !== undefined) {
        map.setBearing(heading); 
      }

      // 2. HANDLE MOVEMENT
      const currentZoom = map.getZoom();
      if (justStartedTracking || currentZoom < 15) {
        map.flyTo(center, 17, { animate: true, duration: 1.5 });
      } else {
        map.panTo(center, { animate: true, duration: 0.5 });
      }
    } else {
      // If tracking is OFF, reset map to North-Up
      map.setBearing(0);
      map.panTo(center, { animate: true, duration: 1 });
    }
  }, [center, isTracking, heading, map]);

  return null;
};

const MapView = ({ children, tileUrl, center, isTracking, heading, setMap }) => {
  return (
    <div className="fixed inset-0 w-full h-screen z-0 bg-slate-100 overflow-hidden">
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={13}
        rotate={true} // Enable the rotate plugin feature
        touchRotate={true} // Allow users to rotate with two fingers
        zoomControl={false}
        className="h-full w-full outline-none"
      >
        <TileLayer
          attribution='&copy; CARTO'
          url={tileUrl || "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
        />
        
        {/* Pass the 'heading' prop here */}
        <RecenterMap 
            center={center} 
            isTracking={isTracking} 
            heading={heading} 
            setMap={setMap} 
        />
        
        {children}
      </MapContainer>
    </div>
  );
};

export default MapView;