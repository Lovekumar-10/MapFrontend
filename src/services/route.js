// services/route.js
export async function fetchRoute(start, end) {
  try {
    const res = await fetch(
      `/route?startLat=${start[0]}&startLng=${start[1]}&endLat=${end[0]}&endLng=${end[1]}`
    );
    const data = await res.json();
    if (!data.path) return null;
    return data; // { path, distance, duration }
  } catch (err) {
    console.error("Error fetching route:", err);
    return null;
  }
}