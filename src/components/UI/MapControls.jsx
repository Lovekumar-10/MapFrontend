// import React, { useState, useEffect, useCallback } from "react";
// import { Layers, Crosshair, Plus, Minus, Radio, X, ChevronUp, ChevronDown } from "lucide-react";
// import { useMap } from "react-leaflet";
// import { motion, AnimatePresence } from "framer-motion";

// const MapControls = ({
//   onLayerChange,
//   currentLayer,
//   isSharing,
//   startSharingSession,
//   stopSharingSession
// }) => {
//   const map = useMap();
//   const [showMenu, setShowMenu] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(true); // Toggle for the whole UI
//   const [unitSystem, setUnitSystem] = useState("metric");
//   const [scale, setScale] = useState({ width: 0, label: "" });
//   const [currentZoom, setCurrentZoom] = useState(map.getZoom());

//   // --- 1. DYNAMIC SCALE LOGIC ---
//   const updateScale = useCallback(() => {
//     const centerLatLng = map.getCenter();
//     const zoom = map.getZoom();
//     setCurrentZoom(zoom);

//     const maxWidth = 80;
//     const metersPerPixel = (40075016.686 * Math.cos((centerLatLng.lat * Math.PI) / 180)) / Math.pow(2, zoom + 8);
//     const maxDistance = metersPerPixel * maxWidth;

//     let distance, label, finalWidth;

//     if (unitSystem === "metric") {
//       if (maxDistance >= 1000) {
//         distance = Math.round(maxDistance / 1000);
//         label = `${distance.toLocaleString()} km`;
//         finalWidth = (distance * 1000) / metersPerPixel;
//       } else {
//         distance = maxDistance >= 10 ? Math.round(maxDistance / 10) * 10 : Math.round(maxDistance);
//         label = `${distance} m`;
//         finalWidth = distance / metersPerPixel;
//       }
//     } else {
//       const feetDistance = maxDistance * 3.28084;
//       if (feetDistance >= 5280) {
//         distance = Math.round(feetDistance / 5280);
//         label = `${distance.toLocaleString()} mi`;
//         finalWidth = (distance * 5280) / (metersPerPixel * 3.28084);
//       } else {
//         distance = feetDistance >= 100 ? Math.round(feetDistance / 100) * 100 : Math.round(feetDistance);
//         label = `${distance} ft`;
//         finalWidth = distance / (metersPerPixel * 3.28084);
//       }
//     }
//     setScale({ width: finalWidth, label });
//   }, [map, unitSystem]);

//   useEffect(() => {
//     updateScale();
//     map.on("zoomend moveend", updateScale);
//     return () => map.off("zoomend moveend", updateScale);
//   }, [map, updateScale]);

//   const layers = [
//     { id: "default", label: "Light", img: "https://b.tile.openstreetmap.fr/hot/0/0/0.png" },
//     { id: "satellite", label: "Satellite", img: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0" },
//     { id: "terrain", label: "Terrain", img: "https://a.tile.opentopomap.org/0/0/0.png" },
//   ];

//   // Framer Motion Variants for the sliding container
//   const containerVariants = {
//     hidden: { y: 100, opacity: 0, scale: 0.95 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       scale: 1,
//       transition: { type: "spring", stiffness: 300, damping: 25 }
//     },
//     exit: {
//       y: 100,
//       opacity: 0,
//       scale: 0.95,
//       transition: { duration: 0.2 }
//     }
//   };

//   return (
//     <div className="absolute bottom-6 right-6 z-[5000] flex flex-col items-end gap-3">

//       <AnimatePresence>
//         {isExpanded && (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             className="flex items-end gap-4"
//           >
//             {/* LEFT COLUMN: DYNAMIC SCALE BAR */}
//             <div
//               className="cursor-pointer select-none flex flex-col items-center transition-all active:scale-95 mb-2"
//               onClick={() => setUnitSystem(unitSystem === "metric" ? "imperial" : "metric")}
//             >
//               <span className="text-[11px] font-bold text-slate-900 drop-shadow-sm uppercase mb-1">
//                 {scale.label}
//               </span>
//               <div
//                 className="border-2 border-t-0 border-slate-900 h-[7px] transition-all duration-300"
//                 style={{ width: `${scale.width}px` }}
//               />
//             </div>

//             {/* RIGHT COLUMN: VERTICAL BUTTON STACK */}
//             <div className="flex flex-col gap-3 items-center">

//               {/* GO LIVE BUTTON */}
//               <button
//                 onClick={isSharing ? stopSharingSession : startSharingSession}
//                 className={`p-3 rounded-full shadow-2xl transition-all active:scale-90 border flex items-center justify-center
//                   ${isSharing
//                     ? "bg-red-500 text-white border-red-400 animate-pulse"
//                     : "bg-blue-600 text-white border-blue-400 hover:bg-blue-700"
//                   }`}
//               >
//                 {isSharing ? <X size={22} /> : <Radio size={22} />}
//               </button>

//               {/* Layer Selection Menu */}
//               <AnimatePresence>
//                 {showMenu && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.9, y: 10 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.9, y: 10 }}
//                     className="absolute bottom-full right-0 mb-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-slate-200 w-64 sm:w-72"
//                   >
//                     <h4 className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-3 px-1 text-center">Map Appearance</h4>
//                     <div className="grid grid-cols-3 gap-2">
//                       {layers.map((l) => (
//                         <button
//                           key={l.id}
//                           onClick={() => { onLayerChange(l.id); setShowMenu(false); }}
//                           className="flex flex-col items-center gap-1.5 group"
//                         >
//                           <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 transition-all overflow-hidden ${currentLayer === l.id ? "border-blue-500 shadow-md scale-105" : "border-transparent opacity-60"}`}>
//                             <img src={l.img} alt={l.label} className="w-full h-full object-cover" />
//                           </div>
//                           <span className={`text-[9px] font-bold ${currentLayer === l.id ? "text-blue-600" : "text-slate-400"}`}>{l.label}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <button onClick={() => setShowMenu(!showMenu)} className="p-3 bg-white cursor-pointer rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-transform active:scale-90">
//                 <Layers size={22} className="text-slate-600" />
//               </button>

//               <button
//                 onClick={() => map.locate().on("locationfound", (e) => map.flyTo(e.latlng, 16))}
//                 className="p-3 bg-white rounded-full cursor-pointer shadow-lg border border-slate-100 hover:bg-slate-50 transition-transform active:scale-90"
//               >
//                 <Crosshair size={22} className="text-slate-600" />
//               </button>

//               {/* Zoom Controls */}
//               <div className="flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
//                 <button
//                   onClick={() => currentZoom < 19 && map.zoomIn()}
//                   className={`p-3.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-opacity ${currentZoom >= 19 ? "opacity-20 cursor-not-allowed" : "opacity-100"}`}
//                 >
//                   <Plus size={20} className="text-slate-700" />
//                 </button>
//                 <button
//                   onClick={() => currentZoom > 3 && map.zoomOut()}
//                   className={`p-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-opacity ${currentZoom <= 3 ? "opacity-20 cursor-not-allowed" : "opacity-100"}`}
//                 >
//                   <Minus size={20} className="text-slate-700" />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* THE TOGGLE BUTTON (Controlled by ^ Icon) */}
//       <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="w-12 h-12 bg-slate-600  cursor-pointer text-white rounded-full flex items-center justify-center shadow-2xl  transition-all active:scale-95 z-[5001]"

//       >
//         {isExpanded ? <ChevronDown size={25} /> : <ChevronUp size={25} />}
//       </button>
//     </div>
//   );
// };

// export default MapControls;

import React, { useState, useEffect, useCallback } from "react";
import {
  Layers,
  Share2,
  Plus,
  Minus,
  Radio,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";

const MapControls = ({
  onLayerChange,
  currentLayer,
  isSharing,
  startSharingSession,
  stopSharingSession,
  onUseLiveLocation,
  isGpsActive,
}) => {
  const map = useMap();
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Toggle for the whole UI
  const [unitSystem, setUnitSystem] = useState("metric");
  const [scale, setScale] = useState({ width: 0, label: "" });
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());

  // --- 1. DYNAMIC SCALE LOGIC ---
  const updateScale = useCallback(() => {
    const centerLatLng = map.getCenter();
    const zoom = map.getZoom();
    setCurrentZoom(zoom);

    const maxWidth = 80;
    const metersPerPixel =
      (40075016.686 * Math.cos((centerLatLng.lat * Math.PI) / 180)) /
      Math.pow(2, zoom + 8);
    const maxDistance = metersPerPixel * maxWidth;

    let distance, label, finalWidth;

    if (unitSystem === "metric") {
      if (maxDistance >= 1000) {
        distance = Math.round(maxDistance / 1000);
        label = `${distance.toLocaleString()} km`;
        finalWidth = (distance * 1000) / metersPerPixel;
      } else {
        distance =
          maxDistance >= 10
            ? Math.round(maxDistance / 10) * 10
            : Math.round(maxDistance);
        label = `${distance} m`;
        finalWidth = distance / metersPerPixel;
      }
    } else {
      const feetDistance = maxDistance * 3.28084;
      if (feetDistance >= 5280) {
        distance = Math.round(feetDistance / 5280);
        label = `${distance.toLocaleString()} mi`;
        finalWidth = (distance * 5280) / (metersPerPixel * 3.28084);
      } else {
        distance =
          feetDistance >= 100
            ? Math.round(feetDistance / 100) * 100
            : Math.round(feetDistance);
        label = `${distance} ft`;
        finalWidth = distance / (metersPerPixel * 3.28084);
      }
    }
    setScale({ width: finalWidth, label });
  }, [map, unitSystem]);

  useEffect(() => {
    updateScale();
    map.on("zoomend moveend", updateScale);
    return () => map.off("zoomend moveend", updateScale);
  }, [map, updateScale]);

  const layers = [
    {
      id: "default",
      label: "Light",
      img: "https://b.tile.openstreetmap.fr/hot/0/0/0.png",
    },
    {
      id: "satellite",
      label: "Satellite",
      img: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0",
    },
    {
      id: "terrain",
      label: "Terrain",
      img: "https://a.tile.opentopomap.org/0/0/0.png",
    },
  ];

  // Framer Motion Variants for the sliding container
  const containerVariants = {
    hidden: { y: 100, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
      y: 100,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="absolute bottom-6 right-6 z-[5000] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-end gap-4"
          >
            {/* LEFT COLUMN: DYNAMIC SCALE BAR */}
            <div
              className="cursor-pointer select-none flex flex-col items-center transition-all active:scale-95 mb-2"
              onClick={() =>
                setUnitSystem(unitSystem === "metric" ? "imperial" : "metric")
              }
            >
              <span className="text-[11px] font-bold text-slate-900 drop-shadow-sm uppercase mb-1">
                {scale.label}
              </span>
              <div
                className="border-2 border-t-0 border-slate-900 h-[7px] transition-all duration-300"
                style={{ width: `${scale.width}px` }}
              />
            </div>

            {/* RIGHT COLUMN: VERTICAL BUTTON STACK */}
            <div className="flex flex-col gap-3 items-center">
             
              <button
                onClick={isSharing ? stopSharingSession : startSharingSession}
                className={`p-3 rounded-full shadow-2xl cursor-pointer transition-all active:scale-90 border flex items-center justify-center
                  ${
                    isSharing
                      ? "bg-red-500 text-white border-red-400 animate-pulse"
                      : "bg-blue-600 text-white border-blue-400 hover:bg-blue-700"
                  }`}
              >
                {isSharing ? <X size={22} /> : <Share2 size={22} />}
              </button>
              {/* Layer Selection Menu */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full right-0 mb-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-slate-200 w-64 sm:w-72"
                  >
                    <h4 className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-3 px-1 text-center">
                      Map Appearance
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {layers.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => {
                            onLayerChange(l.id);
                            setShowMenu(false);
                          }}
                          className="flex flex-col items-center gap-1.5 group"
                        >
                          <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 transition-all overflow-hidden ${currentLayer === l.id ? "border-blue-500 shadow-md scale-105" : "border-transparent opacity-60"}`}
                          >
                            <img
                              src={l.img}
                              alt={l.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span
                            className={`text-[9px] font-bold ${currentLayer === l.id ? "text-blue-600" : "text-slate-400"}`}
                          >
                            {l.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 bg-white cursor-pointer rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-transform active:scale-90"
              >
                <Layers size={22} className="text-slate-600" />
              </button>
             
              <button
                onClick={onUseLiveLocation}
                className={`p-3 rounded-full cursor-pointer shadow-lg border transition-all duration-300 active:scale-90 ${
                  isGpsActive
                    ? "bg-blue-600 border-blue-400 text-white shadow-blue-200"
                    : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Radio
                  size={22}
                  className={isGpsActive ? "animate-spin-slow" : ""}
                />
              </button>



              {/* Zoom Controls */}
              <div className="flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
                <button
                  onClick={() => currentZoom < 19 && map.zoomIn()}
                  className={`p-3.5 border-b border-slate-100 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-opacity ${currentZoom >= 19 ? "opacity-20 cursor-not-allowed" : "opacity-100"}`}
                >
                  <Plus size={20} className="text-slate-700" />
                </button>
                <button
                  onClick={() => currentZoom > 3 && map.zoomOut()}
                  className={`p-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-opacity ${currentZoom <= 3 ? "opacity-20 cursor-not-allowed" : "opacity-100"}`}
                >
                  <Minus size={20} className="text-slate-700" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE TOGGLE BUTTON (Controlled by ^ Icon) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 bg-slate-600  cursor-pointer text-white rounded-full flex items-center justify-center shadow-2xl  transition-all active:scale-95 z-[5001]"
      >
        {isExpanded ? <ChevronDown size={25} /> : <ChevronUp size={25} />}
      </button>
    </div>
  );
};

export default MapControls;
