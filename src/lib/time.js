// The visitor's own clock decides the sky in Auto mode: golden hour around sunrise and sunset,
// day in between, night after dark. The same windows are repeated in the inline script in index.html.

/** Minutes since local midnight on the visitor's device. */
export function localMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

export function phaseAt(minutes) {
  if (minutes == null) return 'day';
  const h = minutes / 60;
  if ((h >= 5.5 && h < 7) || (h >= 16.5 && h < 19)) return 'golden';
  if (h >= 7 && h < 16.5) return 'day';
  return 'night';
}

export function clockText(minutes) {
  if (minutes == null) return '--:--';
  return String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');
}

/** The visitor's time zone as a short code such as IST or CET, or '' when the browser only offers an offset. */
export function zoneCode(date = new Date()) {
  try {
    const part = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(date).find((p) => p.type === 'timeZoneName');
    return part && /^[A-Z]{2,5}$/.test(part.value) ? part.value : '';
  } catch {
    return '';
  }
}
