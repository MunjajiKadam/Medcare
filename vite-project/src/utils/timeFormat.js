/**
 * Convert 24-hour time format to 12-hour format with AM/PM
 * @param {string} time24 - Time in 24-hour format (e.g., "14:30" or "14:30:00")
 * @returns {string} Time in 12-hour format with AM/PM (e.g., "2:30 PM")
 */
export const formatTime12Hour = (time24) => {
  if (!time24) return '';
  
  // Handle both HH:MM and HH:MM:SS formats
  const timeParts = time24.split(':');
  let hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1];
  
  // Determine AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // Convert 0 to 12 for midnight
  
  return `${hours}:${minutes} ${period}`;
};

/**
 * Format time range with AM/PM
 * @param {string} startTime - Start time in 24-hour format
 * @param {string} endTime - End time in 24-hour format
 * @returns {string} Formatted time range (e.g., "9:00 AM - 5:00 PM")
 */
export const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  
  const start = formatTime12Hour(startTime);
  const end = formatTime12Hour(endTime);
  
  return `${start} - ${end}`;
};

/**
 * Get current time in 12-hour format
 * @returns {string} Current time with AM/PM
 */
export const getCurrentTime12Hour = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes} ${period}`;
};
