const SOIL_BOOKINGS_STORAGE_KEY = "agstya_soil_analysis_bookings";

export function getSoilBookings() {
  try {
    const savedBookings = localStorage.getItem(SOIL_BOOKINGS_STORAGE_KEY);
    if (!savedBookings) return [];

    const bookings = JSON.parse(savedBookings);
    return Array.isArray(bookings) ? bookings : [];
  } catch (error) {
    console.error("Unable to read saved soil analysis bookings.", error);
    return [];
  }
}

export function saveSoilBookings(bookings) {
  localStorage.setItem(SOIL_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}
