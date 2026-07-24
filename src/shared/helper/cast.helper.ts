interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export function toLowerCase(value: string): string {
  return value.toLowerCase();
}

export function trim(value: string): string {
  return value.trim();
}

export function trimAndcapitalizeFirstLetter(value: string) {
  return capitalizeFirstLetter(trim(value));
}

export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toDate(value: string): Date {
  return new Date(value);
}

export function toBoolean(value: string): boolean {
  value = value.toLowerCase();

  return value === 'true' || value === '1' ? true : false;
}

// Unlike `toBoolean`, an unrecognized value is passed through untouched so
// `@IsBoolean()` rejects it instead of silently reading as false.
export function toStrictBoolean(value: string): boolean | string {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
}

// Unlike `toNumber`, an unparseable value becomes NaN instead of undefined, so
// `@IsInt()` rejects it with a 400 rather than `@IsOptional()` skipping it.
export function toStrictNumber(value: string): number | undefined {
  if (value === undefined || value === null || trim(String(value)) === '') {
    return undefined;
  }

  return Number(value);
}

export function toCsvArray(value: string | string[]): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const items = (Array.isArray(value) ? value : String(value).split(','))
    .map(trim)
    .filter((item) => item.length > 0);

  return items.length > 0 ? items : undefined;
}

export function toCsvNumberArray(
  value: string | string[],
): number[] | undefined {
  const items = toCsvArray(value);

  // NaN is kept on purpose so `@IsInt({ each: true })` rejects it with a 400.
  return items?.map((item) => Number(item));
}

export function toOptionalTrimmed(value: string): string | undefined {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = trim(value);

  return trimmed.length > 0 ? trimmed : undefined;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
}
