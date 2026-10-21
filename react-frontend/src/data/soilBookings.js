const SOIL_BOOKINGS_STORAGE_KEY = "agstya_soil_analysis_bookings";

export function getSoilBookings() {
  const savedBookings = localStorage.getItem(SOIL_BOOKINGS_STORAGE_KEY);
  return savedBookings ? JSON.parse(savedBookings) : [];
}

export function saveSoilBookings(bookings) {
  localStorage.setItem(SOIL_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}
