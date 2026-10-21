/**
 * Helper utility for managing dates, time formatting, and relative days
 */

export function getOffsetDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const [year, month, day] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return dateStr;
    
    // Check relative
    const todayStr = getOffsetDateString(0);
    const tomorrowStr = getOffsetDateString(1);
    const yesterdayStr = getOffsetDateString(-1);

    const formatted = date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (dateStr === todayStr) {
      return `Today (${date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})`;
    }
    if (dateStr === tomorrowStr) {
      return `Tomorrow (${date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})`;
    }
    if (dateStr === yesterdayStr) {
      return `Yesterday (${date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})`;
    }
    return formatted;
  } catch {
    return String(dateStr || '');
  }
}

export function formatTimeDisplay(timeStr) {
  if (!timeStr) return '';
  return timeStr;
}

export function isPastDate(dateStr) {
  if (!dateStr) return false;
  const todayStr = getOffsetDateString(0);
  return dateStr < todayStr;
}

export function isToday(dateStr) {
  return dateStr === getOffsetDateString(0);
}

export function isTomorrow(dateStr) {
  return dateStr === getOffsetDateString(1);
}
