export const hexToNumber = (hex: string) => parseInt(hex, 16);

export const numberToHex = (n: number) =>
  n.toString(16).padStart(2, "0").toUpperCase();

export const dateToDayOfYear = (date: Date, addYearPrefix = false) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  let yearPrefix = "";
  if (addYearPrefix) {
    yearPrefix = date.getFullYear().toString().slice(-1);
  }
  return `${yearPrefix}${dayOfYear.toString()}`;
};

export const dayOfYearToDate = (
  dayOfYear: string,
  hasYearPrefix: boolean,
  referenceYear?: number
) => {
  const currentYear = referenceYear ?? new Date(Date.now()).getUTCFullYear();
  let year = currentYear.toString();
  let daysToAdd = dayOfYear;

  if (hasYearPrefix) {
    year = year.toString().slice(0, -1) + daysToAdd[0];
    daysToAdd = daysToAdd.substring(1);

    if (parseInt(year) - currentYear > 2) {
      year = (parseInt(year) - 10).toString();
    }
  }

  const date = new Date(Date.UTC(parseInt(year), 0));
  return new Date(date.setUTCDate(parseInt(daysToAdd)));
};
