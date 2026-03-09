import { calculateDistance } from "./calculateDistance";

export function calculateETA(path = [], speedKmh = 50) {
  const distance = calculateDistance(path);
  if (distance === 0) return 0;

  const timeHours = distance / speedKmh;
  const timeMinutes = Math.round(timeHours * 60);
  return timeMinutes; // ETA in minutes
}