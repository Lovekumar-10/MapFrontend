export function calculateDistance(path = [], unit = "km") {
  const cleanPath = path.filter((p) => p && p.length === 2);
  if (cleanPath.length < 2) return 0;

  const R = 6371; // Earth radius km
  let total = 0;

  for (let i = 1; i < cleanPath.length; i++) {
    const [lat1, lon1] = cleanPath[i - 1];
    const [lat2, lon2] = cleanPath[i];
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }

  // Convert to meters or feet if requested
  if (unit === "m") total *= 1000;
  else if (unit === "ft") total *= 3280.84;

  return total;
}