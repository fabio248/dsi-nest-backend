export function TransformStringToDate(dateInSpanishFormat: string): Date {
  const splitedDate = dateInSpanishFormat.split('/');

  const dateEnglishFormat = `${splitedDate[1]}/${splitedDate[0]}/${splitedDate[2]}`;

  return new Date(dateEnglishFormat);
}

// Birthdays are written at local midnight (see TransformStringToDate), so range
// bounds are built in local time too — a UTC bound would drop edge rows.
export function startOfDayFromISO(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);

  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function endOfDayFromISO(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);

  return new Date(year, month - 1, day, 23, 59, 59, 999);
}
