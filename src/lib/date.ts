export function formatDate(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const parts = getParts(dateObj);
  return `${parts.hour}:${parts.minute}:${parts.second}`;
}

export function formatDateFull(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const parts = getParts(dateObj);
  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
}

function getParts(date: Date): Record<string, string> {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('es-US', options);
  const formattedParts = formatter.formatToParts(date);

  const parts: Record<string, string> = {};
  formattedParts.forEach(part => {
    if (part.type !== 'literal') {
      parts[part.type] = part.value;
    }
  });

  return parts;
}