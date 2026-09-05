/** Financial dates use UTC calendar days; session expiry remains an instant. */
export function dayStart(date: Date | string): Date {
  const value = new Date(date);
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

/** Exclusive upper bound for an inclusive financial date. */
export function dayAfter(date: Date | string): Date {
  const value = dayStart(date);
  value.setUTCDate(value.getUTCDate() + 1);
  return value;
}
