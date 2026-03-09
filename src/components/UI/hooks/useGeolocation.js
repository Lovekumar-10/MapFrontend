

// // import { useState, useEffect } from "react";

// // export const useGeolocation = (isTracking) => {
// //   // Start with null so we don't force a "Default" location on the map
// //   const [position, setPosition] = useState(null); 
// //   const [heading, setHeading] = useState(0);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     if (!isTracking) return;

// //     if (!navigator.geolocation) {
// //       setError("Geolocation is not supported by your browser");
// //       return;
// //     }

// //     const options = {
// //       enableHighAccuracy: true,
// //       timeout: 5000,
// //       maximumAge: 0,
// //     };

// //     const handleSuccess = (pos) => {
// //       const { latitude, longitude, heading: spotHeading } = pos.coords;
// //       setPosition([latitude, longitude]);
// //       if (spotHeading !== null) setHeading(spotHeading);
// //     };

// //     const handleError = (err) => setError(err.message);

// //     const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

// //     return () => navigator.geolocation.clearWatch(watcher);
// //   }, [isTracking]);

// //   return { position, heading, error };
// // };



// import { useState, useEffect } from "react";

// export const useGeolocation = (isTracking) => {
//   const [position, setPosition] = useState(null);
//   const [heading, setHeading] = useState(0);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!isTracking) return;

//     // --- 1. GEOLOCATION (For Movement) ---
//     const geoOptions = {
//       enableHighAccuracy: true, // Crucial for "Live" feel
//       timeout: 10000,           // Give it time to find a satellite
//       maximumAge: 0,            // No caching
//     };

//     const handleGeoSuccess = (pos) => {
//       const { latitude, longitude, heading: motionHeading } = pos.coords;
//       setPosition([latitude, longitude]);
      
//       // If the browser provides a heading (only during movement), use it
//       if (motionHeading !== null) {
//         setHeading(motionHeading);
//       }
//     };

//     const handleGeoError = (err) => setError(err.message);
//     const watcher = navigator.geolocation.watchPosition(handleGeoSuccess, handleGeoError, geoOptions);

//     // --- 2. COMPASS / ORIENTATION (For Rotation while standing still) ---
//     const handleOrientation = (event) => {
//       // 'webkitCompassHeading' is for iOS Safari, 'alpha' for Android
//       let compassHeading = event.webkitCompassHeading || (360 - event.alpha);
      
//       if (compassHeading) {
//         setHeading(compassHeading);
//       }
//     };

//     // Chrome/Android usually use 'deviceorientation'
//     // iOS Safari uses 'deviceorientation' but requires permission (see note below)
//     window.addEventListener("deviceorientationabsolute", handleOrientation, true);
//     window.addEventListener("deviceorientation", handleOrientation, true);

//     // Cleanup
//     return () => {
//       navigator.geolocation.clearWatch(watcher);
//       window.removeEventListener("deviceorientationabsolute", handleOrientation);
//       window.removeEventListener("deviceorientation", handleOrientation);
//     };
//   }, [isTracking]);

//   return { position, heading, error };
// };






import { useState, useEffect } from "react";

export const useGeolocation = (isTracking) => {
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isTracking) return;

    // --- 1. GEOLOCATION (For Movement/Position) ---
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const handleGeoSuccess = (pos) => {
      const { latitude, longitude, heading: motionHeading } = pos.coords;
      setPosition([latitude, longitude]);
      
      // GPS heading only works when moving > 1m/s. 
      // We prioritize Compass (Orientation) but use GPS as fallback.
      if (motionHeading !== null) {
        setHeading(motionHeading);
      }
    };

    const handleGeoError = (err) => setError(err.message);
    const watcher = navigator.geolocation.watchPosition(handleGeoSuccess, handleGeoError, geoOptions);

    // --- 2. COMPASS / ORIENTATION (The Rotation Secret) ---
    const handleOrientation = (event) => {
      let compass = 0;

      if (event.webkitCompassHeading) {
        // iOS: The most accurate way
        compass = event.webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Android/Chrome: Alpha is 0 when the device is pointed North
        // We use absolute orientation if available
        compass = event.absolute ? event.alpha : 360 - event.alpha;
      }

      if (compass !== undefined) {
        setHeading(Math.round(compass));
      }
    };

    // iOS 13+ requires a click to request 'DeviceOrientationEvent'
    // This is often why compass 'doesn't work' on iPhones.
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener("deviceorientation", handleOrientation, true);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      navigator.geolocation.clearWatch(watcher);
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isTracking]);

  return { position, heading, error };
};