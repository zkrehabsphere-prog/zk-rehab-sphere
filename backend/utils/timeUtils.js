/**
 * Utility to handle date and time comparisons in IST (India Standard Time)
 * ZK Rehab Sphere is based in India, so all slot logic must be IST-consistent.
 */

/**
 * Get current time in IST
 * @returns {Date}
 */
const getISTNow = () => {
  const now = new Date();
  // Convert UTC to IST (UTC + 5:30)
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

/**
 * Parse date string (YYYY-MM-DD) and time string (HH:MM AM/PM) into an IST Date object
 * @param {string} dateStr - "2025-04-20"
 * @param {string} timeStr - "10:30 AM"
 * @returns {Date}
 */
const parseSlotToIST = (dateStr, timeStr) => {
  // Parsing "10:30 AM"
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  // Construct date in ISO format then convert to IST
  // We use the date string "2025-04-20" and the parsed hours/minutes
  const date = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
  
  // Note: Date constructor with ISO string usually assumes UTC if no offset.
  // However, for consistency with getISTNow, we want this specific Wall Clock time in IST.
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

/**
 * Check if a specific slot (date + time) is in the past
 * @param {string} dateStr 
 * @param {string} timeStr 
 * @returns {boolean}
 */
const isSlotInPast = (dateStr, timeStr) => {
  const now = getISTNow();
  const slotDate = parseSlotToIST(dateStr, timeStr);
  
  return slotDate < now;
};

/**
 * Get today's date string in YYYY-MM-DD (IST)
 * @returns {string}
 */
const getISTTodayStr = () => {
  const now = getISTNow();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

module.exports = {
  getISTNow,
  parseSlotToIST,
  isSlotInPast,
  getISTTodayStr
};
