


// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   ArrowLeft, Circle, MapPin, Navigation2, 
//   ArrowUpDown, Search, LocateFixed, X 
// } from 'lucide-react';

// const RoutingPanel = ({ 
//   startPoint, 
//   destination, 
//   onClose, 
//   onSwap, 
//   onSearchStart, 
//   onSearchDest, 
//   onUseLiveLocation,
//   onClearPoint // Callback to reset a specific point
// }) => {
//   // Local state to manage which input is being "typed" in
//   const [activeInput, setActiveInput] = useState(null); // 'start' | 'dest' | null
//   const inputRef = useRef(null);

//   // Auto-focus input when user clicks to search
//   useEffect(() => {
//     if (activeInput && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [activeInput]);

//   return (
//     <div className="absolute top-6 left-6 z-[1005] w-[calc(100%-48px)] max-w-[420px] animate-in fade-in slide-in-from-left-4 duration-300">
//       <div className="bg-[var(--bg-card)] shadow-hover rounded-[24px] border border-[var(--border)] overflow-hidden p-5 font-poppins">
        
//         {/* --- HEADER --- */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={onClose} 
//               className="p-2 hover:bg-[var(--bg-soft)] rounded-full transition-colors text-[var(--text-secondary)]"
//             >
//               <ArrowLeft size={22} />
//             </button>
//             <h3 className="font-bold text-[var(--text-primary)] text-lg">Route Planner</h3>
//           </div>
          
//           {/* Close/Reset entire panel */}
//           <button onClick={onClose} className="text-[var(--text-light)] hover:text-[var(--color-primary)]">
//             <X size={24} />
//           </button>
//         </div>

//         {/* --- DUAL INPUT AREA --- */}
//         <div className="relative flex gap-4">
//           {/* Path Visual Decorator */}
//           <div className="flex flex-col items-center py-4 gap-1.5">
//             <Circle size={10} className="text-blue-500 fill-blue-500 shrink-0" />
//             <div className="flex-1 w-[1.5px] border-l-2 border-dotted border-[var(--border)]" />
//             <MapPin size={20} className="text-[var(--color-primary)] fill-[var(--color-primary-2)] shrink-0" />
//           </div>

//           <div className="flex-1 flex flex-col gap-3">
//             {/* START POINT BOX */}
//             <div className="relative group">
//               {activeInput === 'start' ? (
//                 <div className="flex items-center bg-white border-2 border-[var(--color-primary)] rounded-xl p-3 shadow-sm">
//                   <input 
//                     ref={inputRef}
//                     type="text"
//                     placeholder="Search starting point..."
//                     className="flex-1 bg-transparent outline-none text-sm font-medium"
//                     onBlur={() => !startPoint && setActiveInput(null)}
//                   />
//                   <X size={16} className="text-gray-400 cursor-pointer" onClick={() => setActiveInput(null)} />
//                 </div>
//               ) : (
//                 <button 
//                   onClick={() => { setActiveInput('start'); onSearchStart(); }}
//                   className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
//                     startPoint?.isLive 
//                     ? "bg-[#f0fdfa] border-teal-200 text-teal-700 font-semibold" 
//                     : "bg-[var(--bg-soft)] border-transparent text-[var(--text-light)]"
//                   }`}
//                 >
//                   <span className="text-sm truncate">
//                     {startPoint?.name || "Set starting point"}
//                   </span>
//                   {startPoint ? (
//                     <X size={16} onClick={(e) => { e.stopPropagation(); onClearPoint('start'); }} className="hover:text-[var(--color-primary)]" />
//                   ) : (
//                     <ArrowUpDown size={14} className="opacity-40" />
//                   )}
//                 </button>
//               )}
//             </div>

//             {/* DESTINATION BOX */}
//             <div className="relative">
//               <button 
//                 onClick={onSearchDest}
//                 className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-white text-left shadow-sm"
//               >
//                 <span className="text-sm font-bold text-[var(--text-primary)] truncate">
//                   {destination?.name || "Set destination"}
//                 </span>
//                 <Search size={16} className="text-[var(--text-light)]" />
//               </button>
//             </div>
//           </div>

//           {/* Swap Button - Positioned exactly between the two boxes */}
//           <button 
//             onClick={onSwap}
//             className="absolute right-[-10px] top-1/2 -translate-y-1/2 p-2.5 bg-white border border-[var(--border)] rounded-full shadow-md text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-all duration-500 active:rotate-180 z-10"
//           >
//             <ArrowUpDown size={18} />
//           </button>
//         </div>

//         {/* --- QUICK SELECTION / LIVE LOCATION --- */}
//         <div className="mt-6 space-y-4">
//           {/* "Your Location" dropdown item - Only shows if Start is empty or focused */}
//           {!startPoint && (
//             <button 
//               onClick={onUseLiveLocation}
//               className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-[var(--bg-soft)] transition-colors border-t border-[var(--border)] group"
//             >
//               <div className="p-2 bg-teal-50 rounded-full text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all">
//                 <LocateFixed size={20} />
//               </div>
//               <span className="text-sm font-bold text-[var(--text-primary)]">Your location</span>
//             </button>
//           )}

//           {/* MAIN ACTION BUTTON */}
//           <button 
//             disabled={!startPoint || !destination}
//             className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-[18px] flex items-center justify-center gap-3 shadow-lg shadow-[#fe3b3b33] hover:brightness-110 active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all"
//           >
//             <Navigation2 size={22} fill="currentColor" className="rotate-45" />
//             <span className="tracking-widest uppercase text-sm">Start Navigation</span>
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default RoutingPanel;






// import React, { useState, useEffect, useRef } from "react";
// import {
//   ArrowLeft,
//   Circle,
//   MapPin,
//   Navigation2,
//   ArrowUpDown,
//   Search,
//   LocateFixed,
//   X,
//   Car,
//   Bike,
// //   Walk, // ✅ fixed icon
// } from "lucide-react";

// const RoutingPanel = ({
//   startPoint,
//   destination,
//   onClose,
//   onSwap,
//   onSearchStart,
//   onSearchDest,
//   onUseLiveLocation,
//   onClearPoint,
//   travelMode,
//   onModeChange,
//   routeInfo,
// }) => {
//   const [activeInput, setActiveInput] = useState(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (activeInput && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [activeInput]);

//   const modes = [
//     { id: "driving-car", icon: <Car size={20} />, label: "Drive" },
//     { id: "cycling-regular", icon: <Bike size={20} />, label: "Cycle" },
//     { id: "foot-walking", icon: <Bike size={20} />, label: "Walk" }, // ✅ fixed
//   ];

//   return (
//     <div className="absolute top-6 left-6 z-[1005] w-[calc(100%-48px)] max-w-[420px] animate-in fade-in slide-in-from-left-4 duration-300">
//       <div className="bg-[var(--bg-card)] shadow-hover rounded-[24px] border border-[var(--border)] overflow-hidden p-5 font-poppins">

//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-[var(--bg-soft)] rounded-full transition-colors text-[var(--text-secondary)]"
//             >
//               <ArrowLeft size={22} />
//             </button>
//             <h3 className="font-bold text-[var(--text-primary)] text-lg">
//               Route Planner
//             </h3>
//           </div>

//           <button
//             onClick={onClose}
//             className="text-[var(--text-light)] hover:text-[var(--color-primary)]"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* TRAVEL MODE */}
//         <div className="flex justify-between gap-2 p-1.5 bg-[var(--bg-soft)] rounded-2xl mb-6">
//           {modes.map((m) => (
//             <button
//               key={m.id}
//               onClick={() => onModeChange(m.id)}
//               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
//                 travelMode === m.id
//                   ? "bg-white shadow-md text-[var(--color-primary)] scale-[1.02]"
//                   : "text-[var(--text-light)] hover:text-[var(--text-primary)]"
//               }`}
//             >
//               {m.icon}
//               <span className="text-[11px] font-bold uppercase tracking-wider">
//                 {m.label}
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* INPUTS */}
//         <div className="relative flex gap-4">
//           <div className="flex flex-col items-center py-4 gap-1.5">
//             <Circle
//               size={10}
//               className="text-blue-500 fill-blue-500 shrink-0"
//             />
//             <div className="flex-1 w-[1.5px] border-l-2 border-dotted border-[var(--border)]" />
//             <MapPin
//               size={20}
//               className="text-[var(--color-primary)] fill-[var(--color-primary-2)] shrink-0"
//             />
//           </div>

//           <div className="flex-1 flex flex-col gap-3">
//             {/* START POINT */}
//             <div className="relative group">
//               {activeInput === "start" ? (
//                 <div className="flex items-center bg-white border-2 border-[var(--color-primary)] rounded-xl p-3 shadow-sm">
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     placeholder="Search starting point..."
//                     className="flex-1 bg-transparent outline-none text-sm font-medium"
//                     onBlur={() => !startPoint && setActiveInput(null)}
//                   />
//                   <X
//                     size={16}
//                     className="text-gray-400 cursor-pointer"
//                     onClick={() => setActiveInput(null)}
//                   />
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => {
//                     setActiveInput("start");
//                     onSearchStart();
//                   }}
//                   className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
//                     startPoint?.isLive
//                       ? "bg-[#f0fdfa] border-teal-200 text-teal-700 font-semibold"
//                       : "bg-[var(--bg-soft)] border-transparent text-[var(--text-light)]"
//                   }`}
//                 >
//                   <span className="text-sm truncate">
//                     {startPoint?.name || "Set starting point"}
//                   </span>
//                   {startPoint ? (
//                     <X
//                       size={16}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onClearPoint("start");
//                       }}
//                       className="hover:text-[var(--color-primary)]"
//                     />
//                   ) : (
//                     <ArrowUpDown size={14} className="opacity-40" />
//                   )}
//                 </button>
//               )}
//             </div>

//             {/* DESTINATION */}
//             <div className="relative">
//               <button
//                 onClick={onSearchDest}
//                 className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-white text-left shadow-sm"
//               >
//                 <span className="text-sm font-bold text-[var(--text-primary)] truncate">
//                   {destination?.name || "Set destination"}
//                 </span>
//                 {destination ? (
//                   <X
//                     size={16}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onClearPoint("dest");
//                     }}
//                     className="text-[var(--text-light)] hover:text-[var(--color-primary)]"
//                   />
//                 ) : (
//                   <Search size={16} className="text-[var(--text-light)]" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* SWAP BUTTON */}
//           <button
//             onClick={onSwap}
//             className="absolute right-[-10px] top-1/2 -translate-y-1/2 p-2.5 bg-white border border-[var(--border)] rounded-full shadow-md text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-all active:rotate-180 z-10"
//           >
//             <ArrowUpDown size={18} />
//           </button>
//         </div>

//         {/* LIVE LOCATION */}
//         <div className="mt-6 space-y-4">
//           {!startPoint && (
//             <button
//               onClick={onUseLiveLocation}
//               className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-[var(--bg-soft)] transition-colors border-t border-[var(--border)] group"
//             >
//               <div className="p-2 bg-teal-50 rounded-full text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all">
//                 <LocateFixed size={20} />
//               </div>
//               <span className="text-sm font-bold text-[var(--text-primary)]">
//                 Use your current location
//               </span>
//             </button>
//           )}

//           {/* START NAVIGATION BUTTON */}
//           <button
//             disabled={!startPoint || !destination}
//             className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-[18px] flex flex-col items-center justify-center gap-1 shadow-lg shadow-[#fe3b3b33] hover:brightness-110 active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all"
//           >
//             <div className="flex items-center gap-3">
//               <Navigation2
//                 size={20}
//                 fill="currentColor"
//                 className="rotate-45"
//               />
//               <span className="tracking-widest uppercase text-sm">
//                 Start Navigation
//               </span>
//             </div>

//             {/* ROUTE INFO */}
//             {routeInfo?.distance > 0 && (
//               <div className="text-[10px] opacity-90 font-medium flex gap-3">
//                 <span>{routeInfo.distance.toFixed(1)} km</span>
//                 <span className="opacity-50">|</span>
//                 <span>{Math.round(routeInfo.duration)} mins</span>
//               </div>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoutingPanel;



import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Circle,
  MapPin,
  Navigation2,
  ArrowUpDown,
  Search,
  LocateFixed,
  X,
  Car,
  Bike,
  Loader2, // Added for the spinner
} from "lucide-react";
import { MdOutlineDirectionsRun } from "react-icons/md";

const RoutingPanel = ({
  startPoint,
  destination,
  onClose,
  onSwap,
  onSearchStart,
  onSearchDest,
  onUseLiveLocation,
  onClearPoint,
  travelMode,
  onModeChange,
  routeInfo,
  isLoading, // Added this prop to handle the spinner state
}) => {
  const [activeInput, setActiveInput] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (activeInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeInput]);

  const modes = [
    { id: "driving-car", icon: <Car size={20} />, label: "Drive" },
    { id: "cycling-regular", icon: <Bike size={20} />, label: "Cycle" },
    { id: "foot-walking", icon: <MdOutlineDirectionsRun size={20} />, label: "Walk" },
  ];

  return (
    <div className="absolute top-6 left-6 z-[1005] w-[calc(100%-48px)] max-w-[420px] animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="bg-[var(--bg-card)] shadow-hover rounded-[24px] border border-[var(--border)] overflow-hidden p-5 font-poppins">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-soft)] rounded-full transition-colors text-[var(--text-secondary)] cursor-pointer"
            >
              <ArrowLeft size={22} />
            </button>
            <h3 className="font-bold text-[var(--text-primary)] text-lg">
              Route Planner
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-[var(--text-light)] hover:text-[var(--color-primary)] cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* TRAVEL MODE */}
        <div className="flex justify-between gap-2 p-1.5 bg-[var(--bg-soft)] rounded-2xl mb-6">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all cursor-pointer ${
                travelMode === m.id
                  ? "bg-white shadow-md text-[var(--color-primary)] scale-[1.02]"
                  : "text-[var(--text-light)] hover:text-[var(--text-primary)]"
              }`}
            >
              {m.icon}
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {m.label}
              </span>
            </button>
          ))}
        </div>

        {/* INPUTS */}
        <div className="relative flex gap-4">
          <div className="flex flex-col items-center py-4 gap-1.5">
            <Circle
              size={10}
              className="text-blue-500 fill-blue-500 shrink-0"
            />
            <div className="flex-1 w-[1.5px] border-l-2 border-dotted border-[var(--border)]" />
            <MapPin
              size={20}
              className="text-[var(--color-primary)] fill-[var(--color-primary-2)] shrink-0"
            />
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {/* START POINT */}
            <div className="relative group">
              {activeInput === "start" ? (
                <div className="flex items-center bg-white border-2 border-[var(--color-primary)] rounded-xl p-3 shadow-sm">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search starting point..."
                    className="flex-1 bg-transparent outline-none text-sm font-medium"
                    onBlur={() => !startPoint && setActiveInput(null)}
                  />
                  <X
                    size={16}
                    className="text-gray-400 cursor-pointer"
                    onClick={() => setActiveInput(null)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveInput("start");
                    onSearchStart();
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                    startPoint?.isLive
                      ? "bg-[#f0fdfa] border-teal-200 text-teal-700 font-semibold"
                      : "bg-[var(--bg-soft)] border-transparent text-[var(--text-light)]"
                  }`}
                >
                  <span className="text-sm truncate">
                    {startPoint?.name || "Set starting point"}
                  </span>
                  {startPoint ? (
                    <X
                      size={16}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearPoint("start");
                      }}
                      className="hover:text-[var(--color-primary)] cursor-pointer"
                    />
                  ) : (
                    <ArrowUpDown size={14} className="opacity-40" />
                  )}
                </button>
              )}
            </div>

            {/* DESTINATION */}
            <div className="relative">
              <button
                onClick={onSearchDest}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-white text-left shadow-sm cursor-pointer hover:border-[var(--color-primary)] transition-colors"
              >
                <span className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {destination?.name || "Set destination"}
                </span>
                {destination ? (
                  <X
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearPoint("dest");
                    }}
                    className="text-[var(--text-light)] hover:text-[var(--color-primary)] cursor-pointer"
                  />
                ) : (
                  <Search size={16} className="text-[var(--text-light)]" />
                )}
              </button>
            </div>
          </div>

          {/* SWAP BUTTON */}
          <button
            onClick={onSwap}
            className="absolute right-[-10px] top-1/2 -translate-y-1/2 p-2.5 bg-white border border-[var(--border)] rounded-full shadow-md text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-all active:rotate-180 z-10 cursor-pointer"
          >
            <ArrowUpDown size={18} />
          </button>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 space-y-4">
          {!startPoint && (
            <button
              onClick={onUseLiveLocation}
              className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-[var(--bg-soft)] transition-colors border-t border-[var(--border)] group cursor-pointer"
            >
              <div className="p-2 bg-teal-50 rounded-full text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all">
                <LocateFixed size={20} />
              </div>
              <span className="text-sm font-bold text-[var(--text-primary)]">
                Use your location
              </span>
            </button>
          )}

          {/* START NAVIGATION BUTTON */}
          <button
            disabled={!startPoint || !destination || isLoading}
            className={`w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-[18px] flex flex-col items-center justify-center gap-1 shadow-lg shadow-[#fe3b3b33] hover:brightness-110 active:scale-[0.98] transition-all
              ${isLoading || (!startPoint || !destination) ? "opacity-70 grayscale cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Navigation2
                  size={20}
                  fill="currentColor"
                  className="rotate-45"
                />
              )}
              <span className="tracking-widest uppercase text-sm">
                {isLoading ? "Finding Route..." : "Start Navigation"}
              </span>
            </div>

            {/* ROUTE INFO */}
            {!isLoading && routeInfo?.distance > 0 && (
              <div className="text-[10px] opacity-90 font-medium flex gap-3 animate-in fade-in slide-in-from-top-1">
                <span>{routeInfo.distance.toFixed(1)} km</span>
                <span className="opacity-50">|</span>
                <span>{Math.round(routeInfo.duration)} mins</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutingPanel;