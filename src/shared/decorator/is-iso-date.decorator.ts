import { ValidationOptions, registerDecorator } from 'class-validator';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isCalendarDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  // Rejects rolled-over dates such as 2024-02-31.
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function IsISODate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isISODate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: unknown) =>
          typeof value === 'string' &&
          ISO_DATE.test(value) &&
          isCalendarDate(value),
        defaultMessage: ({ property }) =>
          `${property} must be a valid ISO date (YYYY-MM-DD)`,
      },
    });
  };
}
