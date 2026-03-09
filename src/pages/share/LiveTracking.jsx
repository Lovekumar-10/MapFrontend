// import React, { useState, useEffect, useMemo } from "react";
// import MapView from "../../components/map/MapView";
// import SearchBar from "../../components/UI/SearchBar";
// import MapControls from "../../components/UI/MapControls";
// import LiveMarker from "../../components/map/LiveMarker";
// import LocationCard from "../../components/UI/LocationCard";
// import RoutingPanel from "../../components/UI/RoutingPanel";
// import Notification from "../../components/UI/Notification";
// import RoutePath from "../../components/Map/RoutePath";
// import GenerateLinkButton from "../../components/share/GenerateLinkButton";
// import { useGeolocation } from "../../components/UI/hooks/useGeolocation";
// import { ArrowLeft } from "lucide-react";

// // API & socket
// import { getRoute } from "../../services/socket";
// import socket from "../../services/socket";

// const LiveTracking = () => {
//   // --- UI States ---
//   const [uiState, setUiState] = useState("SEARCH");
//   const [mapType, setMapType] = useState("default");
//   const [isLoading, setIsLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // --- Session States ---
//   const [sessionId, setSessionId] = useState(null);
//   const [isSharing, setIsSharing] = useState(false);

//   // --- Location States ---
//   const [destination, setDestination] = useState(null);
//   const [startPoint, setStartPoint] = useState(null);
//   const [activeSearchSlot, setActiveSearchSlot] = useState(null);
//   const [isGpsActive, setIsGpsActive] = useState(false);

//   // --- Route & Travel Mode ---
//   const [routeData, setRouteData] = useState({
//     path: [],
//     distance: 0,
//     duration: 0,
//     speedInfo: null,
//   });
//   const [travelMode, setTravelMode] = useState("driving-car");

//   const { position, heading } = useGeolocation(isGpsActive);

//   // --- Session Handlers ---
//   const startSharingSession = () => {
//     if (!startPoint || !destination) {
//       setToast({
//         type: "ERROR",
//         message: "Please select start and destination first!",
//       });
//       return;
//     }

//     const newSessionId = `SESSION-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;
//     setSessionId(newSessionId);
//     setIsSharing(true);

//     socket.emit("join-session", { sessionId: newSessionId });

//     // Send first point as start of route simulation
//     socket.emit("share-live-location", {
//       sessionId: newSessionId,
//       position: [startPoint.lat, startPoint.lng],
//       destination,
//       heading: heading || 0,
//       isInitial: true,
//       isLive: false, // simulation flag
//     });

//     setToast({ type: "SUCCESS", message: "Route simulation is now active!" });
//   };

//   const stopSharingSession = () => {
//     if (sessionId) socket.emit("stop-session", { sessionId });
//     setIsSharing(false);
//     setSessionId(null);
//     setIsGpsActive(false);

//     setToast({ type: "INFO", message: "Location sharing stopped." });
//   };

//   // --- Broadcast GPS if live ---
//   useEffect(() => {
//     if (!isSharing || !sessionId || !position || !isGpsActive) return;

//     const payload = {
//       sessionId,
//       position,
//       heading: heading || 0,
//       timestamp: Date.now(),
//       isLive: true,
//     };
//     socket.emit("share-live-location", payload);
//   }, [position, isSharing, sessionId, heading, isGpsActive]);

//   // --- Socket Listeners ---
//   useEffect(() => {
//     socket.on("location-update", (payload) => {
//       setStartPoint({
//         name: `Vehicle ${payload.vehicleID || "Live"}`,
//         lat: payload.position[0],
//         lng: payload.position[1],
//         isLive: payload.isLive,
//       });
//     });

//     socket.on("error-msg", (msg) =>
//       setToast({ type: "SERVER_ERROR", message: msg }),
//     );

//     return () => {
//       socket.off("location-update");
//       socket.off("error-msg");
//     };
//   }, []);

//   // --- Fetch Route ---
//   useEffect(() => {
//     const fetchPath = async () => {
//       if (!startPoint || !destination)
//         return setRouteData({
//           path: [],
//           distance: 0,
//           duration: 0,
//           speedInfo: null,
//         });

//       const data = await getRoute(
//         [startPoint.lat, startPoint.lng],
//         [destination.lat, destination.lng],
//         travelMode,
//         setIsLoading,
//       );

//       if (data?.type === "SUCCESS") setRouteData(data);
//       else if (data) setToast({ type: data.type, message: data.message });
//     };

//     fetchPath();
//   }, [
//     startPoint?.lat,
//     startPoint?.lng,
//     destination?.lat,
//     destination?.lng,
//     travelMode,
//   ]);

//   // --- Update Start Point if GPS ---
//   useEffect(() => {
//     if (!isGpsActive || !position) return;
//     setStartPoint({
//       name: "Your Location",
//       lat: position[0],
//       lng: position[1],
//       isLive: true,
//     });
//   }, [position, isGpsActive]);

//   // --- Handlers ---
//   const handleLocationSelect = (coords) => {
//     const newPoint = { ...coords, isLive: false };
//     if (uiState === "SEARCH") {
//       setDestination(newPoint);
//       setUiState("DETAILS");
//     } else if (uiState === "ROUTING") {
//       if (activeSearchSlot === "START") {
//         setStartPoint(newPoint);
//         setIsGpsActive(false);
//       } else setDestination(newPoint);
//       setActiveSearchSlot(null);
//     }
//   };

//   const handleClearPoint = (type) => {
//     if (type === "start") {
//       setStartPoint(null);
//       setIsGpsActive(false);
//       if (isSharing) stopSharingSession();
//     } else setDestination(null);
//   };

//   const handleSwap = () => {
//     const temp = startPoint;
//     setStartPoint(destination);
//     setDestination(temp);
//   };

//   const getTileUrl = (type) => {
//     switch (type) {
//       case "satellite":
//         return "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
//       case "terrain":
//         return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
//       default:
//         return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
//     }
//   };

//   const mapCenter = useMemo(() => {
//     if (destination) return [destination.lat, destination.lng];
//     if (startPoint) return [startPoint.lat, startPoint.lng];
//     if (position) return position;
//     return [28.6139, 77.209];
//   }, [destination?.lat, startPoint?.lat, position]);

//   return (
//     <main className="relative h-screen w-full overflow-hidden bg-[var(--bg-main)] font-poppins">
//       {isSharing && sessionId && (
//         <div className="absolute top-6 right-20 z-[1001] animate-in slide-in-from-right-4 fade-in">
//           <GenerateLinkButton sessionId={sessionId} isSharing={isSharing} />
//         </div>
//       )}

//       <MapView
//         tileUrl={getTileUrl(mapType)}
//         center={mapCenter}
//         isTracking={isGpsActive && startPoint?.isLive}
//       >
//         {toast && (
//           <Notification
//             type={toast.type}
//             message={toast.message}
//             onClose={() => setToast(null)}
//           />
//         )}

//         {(uiState === "SEARCH" || activeSearchSlot) && (
//           <div
//             className={
//               activeSearchSlot
//                 ? "absolute inset-0 z-[2000] bg-[var(--bg-main)] p-6 animate-in slide-in-from-bottom-2"
//                 : ""
//             }
//           >
//             {activeSearchSlot && (
//               <button
//                 onClick={() => setActiveSearchSlot(null)}
//                 className="mb-4 flex items-center gap-2 text-[var(--color-primary)] font-bold transition-transform active:scale-95"
//               >
//                 <ArrowLeft size={20} /> Back to Route Plan
//               </button>
//             )}
//             <SearchBar
//               onLocationSelect={handleLocationSelect}
//               placeholder={
//                 activeSearchSlot
//                   ? `Search ${activeSearchSlot.toLowerCase()}...`
//                   : "Where to?"
//               }
//             />
//           </div>
//         )}

//         {uiState === "DETAILS" && !activeSearchSlot && (
//           <LocationCard
//             data={destination}
//             onClose={() => {
//               setDestination(null);
//               setUiState("SEARCH");
//             }}
//             onGetDirections={() => setUiState("ROUTING")}
//           />
//         )}

//         {uiState === "ROUTING" && !activeSearchSlot && (
//           <RoutingPanel
//             startPoint={startPoint}
//             destination={destination}
//             travelMode={travelMode}
//             onModeChange={setTravelMode}
//             isLoading={isLoading}
//             isSharing={isSharing}
//             onUseLiveLocation={() => {
//               setIsGpsActive(true);
//               startSharingSession();
//             }}
//             routeInfo={{
//               distance: routeData.distance,
//               duration: routeData.duration,
//             }}
//             onSwap={handleSwap}
//             onClearPoint={handleClearPoint}
//             onClose={() => {
//               setUiState("SEARCH");
//               setActiveSearchSlot(null);
//               stopSharingSession();
//             }}
//             onSearchStart={() => setActiveSearchSlot("START")}
//             onSearchDest={() => setActiveSearchSlot("DEST")}
//           />
//         )}

//         <MapControls
//           onLayerChange={setMapType}
//           currentLayer={mapType}
//           isSharing={isSharing}
//           startSharingSession={startSharingSession}
//           stopSharingSession={stopSharingSession}
//           startPoint={startPoint}
//           destination={destination}
//           onUseLiveLocation={() => {
//             setIsGpsActive(true);
//           }}
//         />

//         {destination && (
//           <LiveMarker
//             position={[destination.lat, destination.lng]}
//             type="DESTINATION"
//             label={destination.name}
//           />
//         )}
//         {startPoint && (
//           <LiveMarker
//             position={[startPoint.lat, startPoint.lng]}
//             type={startPoint.isLive ? "LIVE" : "START"}
//             label={startPoint.name}
//             heading={heading}
//             isTracking={startPoint.isLive}
//           />
//         )}
//         {routeData.path.length > 0 && (
//           <RoutePath
//             positions={routeData.path}
//             speedInfo={routeData.speedInfo}
//           />
//         )}
//       </MapView>
//     </main>
//   );
// };

// export default LiveTracking;



















import React, { useState, useEffect, useMemo } from "react";
import MapView from "../../components/map/MapView";
import SearchBar from "../../components/UI/SearchBar";
import MapControls from "../../components/UI/MapControls";
import LiveMarker from "../../components/map/LiveMarker";
import LocationCard from "../../components/UI/LocationCard";
import RoutingPanel from "../../components/UI/RoutingPanel";
import Notification from "../../components/UI/Notification";
import Path from "../../components/map/Path";
import GenerateLinkButton from "../../components/share/GenerateLinkButton";
import { useGeolocation } from "../../components/UI/hooks/useGeolocation";
import { ArrowLeft } from "lucide-react";

// API & socket
import { getRoute } from "../../services/socket";
import socket from "../../services/socket";

const LiveTracking = () => {
  // --- UI States ---
  const [uiState, setUiState] = useState("SEARCH");
  const [mapType, setMapType] = useState("default");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [map, setMap] = useState(null);
  // --- Session States ---
  const [sessionId, setSessionId] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  // --- Location States ---
  const [destination, setDestination] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [activeSearchSlot, setActiveSearchSlot] = useState(null);
  const [isGpsActive, setIsGpsActive] = useState(false);

  // --- Route & Travel Mode ---
  const [routeData, setRouteData] = useState({
    path: [],
    distance: 0,
    duration: 0,
    speedInfo: null,
  });
  const [travelMode, setTravelMode] = useState("driving-car");

  const { position, heading } = useGeolocation(isGpsActive);

  // --- Session Handlers ---
  const startSharingSession = () => {
    if (!startPoint || !destination) {
      setToast({
        type: "ERROR",
        message: "Please select start and destination first!",
      });
      return;
    }

    const newSessionId = `SESSION-${Math.random().toString(36).substr(2, 7).toUpperCase()}`;
    setSessionId(newSessionId);
    setIsSharing(true);

    socket.emit("join-session", { sessionId: newSessionId });

    // Send first point as start of route simulation
    socket.emit("share-live-location", {
      sessionId: newSessionId,
      position: [startPoint.lat, startPoint.lng],
      destination,
      heading: heading || 0,
      isInitial: true,
      isLive: false, // simulation flag
    });

    setToast({ type: "SUCCESS", message: "Route simulation is now active!" });
  };

  // Inside LiveTracking.jsx

  // useEffect(() => {
  //   // Only auto-center if GPS is active and we have a valid position
  //   if (isGpsActive && position && map) {
  //     map.panTo(position, { animate: true, duration: 1.5 });

  //     // Optional: If you want to force a specific zoom when they click 'Live'
  //     // map.setView(position, 16, { animate: true });
  //   }
  // }, [position, isGpsActive, map]);

  const stopSharingSession = () => {
    if (sessionId) socket.emit("stop-session", { sessionId });
    setIsSharing(false);
    setSessionId(null);
    setIsGpsActive(false);

    setStartPoint(null);

    setToast({ type: "INFO", message: "Location sharing stopped." });
  };

  // --- Broadcast GPS if live ---
  useEffect(() => {
    if (!isSharing || !sessionId || !position || !isGpsActive) return;

    const payload = {
      sessionId,
      position,
      heading: heading || 0,
      timestamp: Date.now(),
      isLive: true,
    };
    socket.emit("share-live-location", payload);
  }, [position, isSharing, sessionId, heading, isGpsActive]);

  // --- Socket Listeners ---
  useEffect(() => {
    socket.on("location-update", (payload) => {
      setStartPoint({
        name: `Vehicle ${payload.vehicleID || "Live"}`,
        lat: payload.position[0],
        lng: payload.position[1],
        isLive: payload.isLive,
      });
    });

    socket.on("error-msg", (msg) =>
      setToast({ type: "SERVER_ERROR", message: msg }),
    );

    return () => {
      socket.off("location-update");
      socket.off("error-msg");
    };
  }, []);

  // --- Fetch Route ---
  useEffect(() => {
    const fetchPath = async () => {
      if (!startPoint || !destination)
        return setRouteData({
          path: [],
          distance: 0,
          duration: 0,
          speedInfo: null,
        });

      const data = await getRoute(
        [startPoint.lat, startPoint.lng],
        [destination.lat, destination.lng],
        travelMode,
        setIsLoading,
      );

      if (data?.type === "SUCCESS") setRouteData(data);
      else if (data) setToast({ type: data.type, message: data.message });
    };

    fetchPath();
  }, [
    startPoint?.lat,
    startPoint?.lng,
    destination?.lat,
    destination?.lng,
    travelMode,
  ]);

  // --- Update Start Point if GPS ---

  useEffect(() => {
    if (!isGpsActive || !position) return;

    setStartPoint({
      name: "Your Location",
      lat: position[0],
      lng: position[1],
      isLive: true,
    });
  }, [position, isGpsActive]);

  // --- Handlers ---
  const handleLocationSelect = (coords) => {
    const newPoint = { ...coords, isLive: false };
    if (uiState === "SEARCH") {
      setDestination(newPoint);
      setUiState("DETAILS");
    } else if (uiState === "ROUTING") {
      if (activeSearchSlot === "START") {
        setStartPoint(newPoint);
        setIsGpsActive(false);
      } else setDestination(newPoint);
      setActiveSearchSlot(null);
    }
  };

  const handleClearPoint = (type) => {
    if (type === "start") {
      setStartPoint(null);
      setIsGpsActive(false);
      if (isSharing) stopSharingSession();
    } else setDestination(null);
  };

  const handleSwap = () => {
    const temp = startPoint;
    setStartPoint(destination);
    setDestination(temp);
  };

  const getTileUrl = (type) => {
    switch (type) {
      case "satellite":
        return "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
      case "terrain":
        return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      default:
        return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    }
  };

  const mapCenter = useMemo(() => {
    if (destination) return [destination.lat, destination.lng];
    if (startPoint) return [startPoint.lat, startPoint.lng];
    if (position) return position;
    return [28.6139, 77.209];
  }, [destination?.lat, startPoint?.lat, position]);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[var(--bg-main)] font-poppins">
      {isSharing && sessionId && (
        <div className="absolute top-6 right-20 z-[1001] animate-in slide-in-from-right-4 fade-in">
          <GenerateLinkButton sessionId={sessionId} isSharing={isSharing} />
        </div>
      )}

      <MapView
        tileUrl={getTileUrl(mapType)}
        center={mapCenter}
        setMap={setMap}
        isTracking={isGpsActive && startPoint?.isLive}
      >
        {toast && (
          <Notification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {(uiState === "SEARCH" || activeSearchSlot) && (
          <div
            className={
              activeSearchSlot
                ? "absolute inset-0 z-[2000] bg-[var(--bg-main)] p-6 animate-in slide-in-from-bottom-2"
                : ""
            }
          >
            {activeSearchSlot && (
              <button
                onClick={() => setActiveSearchSlot(null)}
                className="mb-4 flex items-center gap-2 text-[var(--color-primary)] font-bold transition-transform active:scale-95"
              >
                <ArrowLeft size={20} /> Back to Route Plan
              </button>
            )}
            <SearchBar
              onLocationSelect={handleLocationSelect}
              placeholder={
                activeSearchSlot
                  ? `Search ${activeSearchSlot.toLowerCase()}...`
                  : "Where to?"
              }
            />
          </div>
        )}

        {uiState === "DETAILS" && !activeSearchSlot && (
          <LocationCard
            data={destination}
            onClose={() => {
              setDestination(null);
              setUiState("SEARCH");
            }}
            onGetDirections={() => setUiState("ROUTING")}
          />
        )}

        {uiState === "ROUTING" && !activeSearchSlot && (
          <RoutingPanel
            startPoint={startPoint}
            destination={destination}
            travelMode={travelMode}
            onModeChange={setTravelMode}
            isLoading={isLoading}
            isSharing={isSharing}
            onUseLiveLocation={() => {
              setIsGpsActive(true);
              startSharingSession();
            }}
            routeInfo={{
              distance: routeData.distance,
              duration: routeData.duration,
            }}
            onSwap={handleSwap}
            onClearPoint={handleClearPoint}
            onClose={() => {
              setUiState("SEARCH");
              setActiveSearchSlot(null);
              stopSharingSession();
            }}
            onSearchStart={() => setActiveSearchSlot("START")}
            onSearchDest={() => setActiveSearchSlot("DEST")}
          />
        )}

        <MapControls
          onLayerChange={setMapType}
          currentLayer={mapType}
          isSharing={isSharing}
          startSharingSession={startSharingSession}
          stopSharingSession={stopSharingSession}
          startPoint={startPoint}
          isGpsActive={isGpsActive} 
          destination={destination}
          onUseLiveLocation={() => {
            if (isGpsActive) {
              // If already active, turn it off and hide marker
              setIsGpsActive(false);
              setStartPoint(null);
              if (isSharing) stopSharingSession();
            } else {
              //  Activate GPS tracking
              setIsGpsActive(true);

              // Recenter map to current position
              if (position) {
                setStartPoint({
                  name: "Your Location",
                  lat: position[0],
                  lng: position[1],
                  isLive: true,
                });

               
              }

              // Start sharing session if destination exists
              if (destination && !isSharing) startSharingSession();
            }
          }}
        />

        {destination && (
          <LiveMarker
            position={[destination.lat, destination.lng]}
            type="DESTINATION"
            label={destination.name}
          />
        )}
        {startPoint && (
          <LiveMarker
            position={[startPoint.lat, startPoint.lng]}
            type={startPoint.isLive ? "LIVE" : "START"}
            label={startPoint.name}
            heading={heading}
            isTracking={startPoint.isLive}
          />
        )}
        {routeData.path.length > 0 && (
          <Path
            positions={routeData.path}
            speedInfo={routeData.speedInfo}
          />
        )}
      </MapView>
    </main>
  );
};

export default LiveTracking;
