

// import { Polyline } from "react-leaflet";

// function RoutePath({ positions = [], speedInfo = null }) {
//   // Fallback: If no traffic data is available, show a solid blue path
//   if (!speedInfo || !speedInfo.values) {
//     return (
//       <Polyline
//         positions={positions}
//         pathOptions={{
//           color: "#3b82f6", // Default Blue
//           weight: 6,
//           opacity: 0.8,
//           lineJoin: "round",
//         }}
//       />
//     );
//   }

//   /**
//    * ORS Extras logic:
//    * speedInfo.values is an array of [start_index, end_index, speed_value]
//    */
//   return (
//     <>
//       {speedInfo.values.map((item, idx) => {
//         const [start, end, speed] = item;
//         const segmentCoords = positions.slice(start, end + 1);

//         // Define Color Based on Speed (Traffic Simulation)
//         let segmentColor = "#22c55e"; // Green (Fast > 70km/h)
//         if (speed < 30) {
//           segmentColor = "#ef4444"; // Red (Heavy Traffic < 30km/h)
//         } else if (speed < 60) {
//           segmentColor = "#f59e0b"; // Yellow (Moderate 30-60km/h)
//         }

//         return (
//           <Polyline
//             key={`traffic-seg-${idx}`}
//             positions={segmentCoords}
//             pathOptions={{
//               color: segmentColor,
//               weight: 6,
//               opacity: 1,
//               lineJoin: "round",
//               lineCap: "round",
//             }}
//           />
//         );
//       })}
//     </>
//   );
// }

// export default RoutePath;



import { Polyline } from "react-leaflet";

function RoutePath({ positions = [], speedInfo = null }) {
  // 1. Fallback: If no traffic data is found, show the standard blue line
  if (!speedInfo || !speedInfo.values || speedInfo.values.length === 0) {
    return (
      <Polyline
        positions={positions}
        pathOptions={{
          color: "#3b82f6", 
          weight: 6,
          opacity: 0.8,
          lineJoin: "round",
          lineCap: "round"
        }}
      />
    );
  }

  return (
    <>
      {/* 2. THE BACKGROUND "GLOW" (Optional: Makes the line look crisp) */}
      <Polyline
        positions={positions}
        pathOptions={{ color: "#ffffff", weight: 9, opacity: 0.3 }}
      />

      {/* 3. THE TRAFFIC SEGMENTS */}
      {speedInfo.values.map((item, idx) => {
        const [start, end, speed] = item;
        
        // Slice the path based on the indices from the API
        const segmentCoords = positions.slice(start, end + 1);

        // Google Maps Traffic Logic
        let segmentColor = "#22c55e"; // Green (Fast)
        if (speed < 25) {
          segmentColor = "#ef4444"; // Red (Heavy Traffic)
        } else if (speed < 55) {
          segmentColor = "#f59e0b"; // Yellow (Moderate)
        }

        return (
          <Polyline
            key={`traffic-seg-${idx}`}
            positions={segmentCoords}
            pathOptions={{
              color: segmentColor,
              weight: 6,
              opacity: 1,
              lineJoin: "round",
              lineCap: "round",
            }}
          />
        );
      })}
    </>
  );
}

export default RoutePath;