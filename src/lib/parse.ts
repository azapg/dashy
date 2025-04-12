export function parseTimeRange(range: string): string {
  const match = range.match(/^(\d+)d$/);
  if (!match) {
    return range;
  }

  const days = parseInt(match[1], 10);

  if (days % 365 === 0) {
    const years = days / 365;
    return years === 1 ? "año" : `${years} años`;
  } else if (days % 30 === 0) {
    const months = days / 30;
    return months === 1 ? "mes" : `${months} meses`;
  } else if (days % 7 === 0) {
    const weeks = days / 7;
    return weeks === 1 ? "semana" : `${weeks} semanas`;
  } else {
    return days === 1 ? "día" : `${days} días`;
  }
}