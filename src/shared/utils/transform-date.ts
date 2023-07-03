export function TransformStringToDate(date: string): Date {
  const splitedDate = date.split('/');

  const dateEnglishFormat = `${splitedDate[1]}/${splitedDate[0]}/${splitedDate[2]}`;

  return new Date(dateEnglishFormat);
}
