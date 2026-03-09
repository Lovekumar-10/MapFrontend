

import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:5000"; 
const SOCKET_URL = "https://map-backend-ib2f.onrender.com"; 
const socket = io(SOCKET_URL);

/**
 * ----------------------------------------
 * SESSION BROADCASTING UTILITIES
 * ----------------------------------------
 */

// Join a specific session room (used by both Sender and Viewer)
export const joinSession = (sessionId) => {
  socket.emit("join-session", { sessionId });
};

// Broadcast live location to a session room (used by Sender)
export const broadcastLocation = (data) => {
  socket.emit("share-live-location", data);
};

// End a sharing session manually (used by Sender)
export const stopSession = (sessionId) => {
  socket.emit("stop-session", { sessionId });
};

/**
 * ----------------------------------------
 * ROUTING UTILITY
 * Fetches real-time road paths with traffic data
 * ----------------------------------------
 */
export async function getRoute(start, end, profile = "driving-car", setLoading = null) {
  try {
    if (setLoading) setLoading(true);

    const queryParams = new URLSearchParams({
      startLat: start[0],
      startLng: start[1],
      endLat: end[0],
      endLng: end[1],
      profile: profile
    });

    const res = await fetch(`${SOCKET_URL}/route-real?${queryParams}`);
    const data = await res.json();
    
    return data; 

  } catch (err) {
    console.error("Route fetch network error:", err);
    return { 
      type: "SERVER_ERROR", 
      message: "Connection to tracking server failed. Please check your internet." 
    };
  } finally {
    if (setLoading) setLoading(false);
  }
}

export default socket;
