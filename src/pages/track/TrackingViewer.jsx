

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import MapView from "../../components/map/MapView";
import LiveMarker from "../../components/map/LiveMarker";
import RoutePath from "../../components/Map/RoutePath";
import Notification from "../../components/UI/Notification";
import socket, { getRoute } from "../../services/socket";

const TrackingViewer = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");

  const [liveData, setLiveData] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [status, setStatus] = useState("CONNECTING");
  const [toast, setToast] = useState(null);
  const [currentRoad, setCurrentRoad] = useState("");

  const liveDataRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("ERROR");
      setToast({ type: "ERROR", message: "Invalid tracking link." });
      return;
    }

    socket.emit("join-session", { sessionId });

    socket.on("initial-path", async (pathHistory) => {
      if (pathHistory && pathHistory.length > 0) {
        const lastPoint = pathHistory[pathHistory.length - 1];
        setLiveData(lastPoint);
        liveDataRef.current = lastPoint;
        setStatus("ACTIVE");
        setCurrentRoad(lastPoint.road || "");

        if (lastPoint.destination) {
          setDestination(lastPoint.destination);
          fetchTripRoute(lastPoint.position, lastPoint.destination);
        }
      }
    });

    socket.on("location-update", async (payload) => {
      if (payload.sessionId === sessionId) {
        // Animate marker smoothly
        if (liveDataRef.current) {
          animateMarker(liveDataRef.current.position, payload.position);
        } else {
          setLiveData(payload);
        }

        liveDataRef.current = payload;
        setStatus("ACTIVE");
        setCurrentRoad(payload.road || "");

        if (payload.destination && !destination) {
          setDestination(payload.destination);
          fetchTripRoute(payload.position, payload.destination);
        }
      }
    });

    socket.on("session-closed", () => {
      setStatus("CLOSED");
    });

    return () => {
      socket.off("location-update");
      socket.off("initial-path");
      socket.off("session-closed");
    };
  }, [sessionId, destination]);

  // Fetch route line
  const fetchTripRoute = async (start, dest) => {
    const res = await getRoute(start, [dest.lat, dest.lng]);
    if (res?.type === "SUCCESS") setRoutePath(res.path);
  };

  // Smooth marker animation
  const animateMarker = (from, to, duration = 1000) => {
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const lat = from[0] + (to[0] - from[0]) * t;
      const lng = from[1] + (to[1] - from[1]) * t;

      setLiveData(prev => ({ ...prev, position: [lat, lng] }));

      // Auto-center map
      if (mapRef.current) {
        mapRef.current.setView([lat, lng], mapRef.current.getZoom(), { animate: true });
      }

      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // Map center logic
  const mapCenter = liveData ? liveData.position : [28.6139, 77.209];

  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-50">
      
      {/* STATUS OVERLAY */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1001]">
        <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-2xl border border-slate-100 flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
            {status === "ACTIVE" ? `Live: ${currentRoad || "Tracking Active"}` : "Waiting for Host..."}
          </span>
        </div>
      </div>

      {toast && (
        <Notification 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}

      <MapView 
        ref={mapRef}
        center={mapCenter} 
        zoom={15}
        isTracking={status === "ACTIVE"}
        scrollWheelZoom={true}
      >
        {/* LIVE USER MARKER */}
        {liveData && (
          <LiveMarker 
            position={liveData.position} 
            type="LIVE" 
            label="Driver" 
            heading={liveData.heading} 
            isTracking={true}
          />
        )}

        {/* DESTINATION MARKER */}
        {destination && (
          <LiveMarker 
            position={[destination.lat, destination.lng]} 
            type="DESTINATION" 
            label={destination.name} 
          />
        )}

        {/* ROUTE PATH */}
        {routePath.length > 0 && <RoutePath positions={routePath} />}
      </MapView>

      {/* SESSION ENDED OVERLAY */}
      {status === "CLOSED" && (
        <div className="absolute inset-0 z-[2000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl text-center max-w-sm border border-slate-100">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">🏁</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Trip Ended</h2>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">The user has stopped sharing their live location for this session.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg"
            >
              Back to App
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default TrackingViewer;