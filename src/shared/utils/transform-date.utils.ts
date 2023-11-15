import { zonedTimeToUtc } from 'date-fns-tz';
export function TransformStringToDate(dateInSpanishFormat: string): Date {
  const splitDate = dateInSpanishFormat.split('/');

  const dateEnglishFormat = `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`;

  const date = new Date(dateEnglishFormat);

  return zonedTimeToUtc(date, 'America/El_Salvador')
}
