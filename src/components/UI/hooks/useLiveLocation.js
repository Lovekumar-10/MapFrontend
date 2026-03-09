// import { useState, useEffect } from "react";

// export default function useLiveLocation() {
//   const [position, setPosition] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser");
//       return;
//     }

//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
//       (err) => setError(err.message),
//       { enableHighAccuracy: true, maximumAge: 1000 }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   return { position, error };
// }