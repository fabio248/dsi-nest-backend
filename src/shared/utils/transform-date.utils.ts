export function TransformStringToDate(dateInSpanishFormat: string): Date {
  const splitedDate = dateInSpanishFormat.split('/');

  const dateEnglishFormat = `${splitedDate[1]}/${splitedDate[0]}/${splitedDate[2]}`;

  return new Date(dateEnglishFormat);
}
