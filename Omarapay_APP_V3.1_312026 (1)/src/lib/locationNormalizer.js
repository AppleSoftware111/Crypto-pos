/**
 * Utility to normalize location data from various sources (Google Maps, manual input)
 * into a consistent structure for the application.
 */
export const normalizeLocation = (input) => {
  if (!input) return null;

  console.log('normalizeLocation - Input:', input);

  // 1. Extract Coordinates
  let lat = input.lat || input.latitude;
  let lng = input.lng || input.longitude;

  // Handle function inputs (Google Maps API objects)
  if (typeof lat === 'function') lat = lat();
  if (typeof lng === 'function') lng = lng();

  // Validate coordinates
  const validLat = typeof lat === 'number' && isFinite(lat);
  const validLng = typeof lng === 'number' && isFinite(lng);

  if (!validLat || !validLng) {
    console.warn('normalizeLocation - Invalid coordinates:', { lat, lng });
    return null;
  }

  // 2. Normalize Address Fields
  const formatted = input.formattedAddress || input.formatted_address || input.address || '';
  
  // Extract specific components if they exist, otherwise fallback to empty strings
  // We prefer explicit fields if available (from GoogleMapLocationPicker's parsing)
  const line1 = input.street || input.line1 || '';
  const city = input.city || input.locality || '';
  const state = input.state || input.province || input.administrative_area_level_1 || '';
  const postalCode = input.postalCode || input.zip || input.postal_code || '';
  const country = input.country || input.countryCode || '';
  const placeId = input.placeId || input.place_id || '';

  // 3. Validation
  // We require at least coordinates and (formatted address OR city+country)
  if (!formatted && (!city || !country)) {
    console.warn('normalizeLocation - Insufficient address data');
    // We might still return coordinates if that's all we have, but usually we want an address
    // For business registration, strictly requiring some address info is safer
    if (!formatted) return null; 
  }

  const normalized = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    placeId,
    formatted,
    line1,
    city,
    state,
    postalCode,
    country, // Could add ISO code normalization here if needed later
  };

  console.log('normalizeLocation - Output:', normalized);
  return normalized;
};