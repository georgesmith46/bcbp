export const hexToNumber = (hex: string) => parseInt(hex, 16);

export const numberToHex = (n: number) =>
  n.toString(16).padStart(2, "0").toUpperCase();

export const dateToDayOfYear = (date: Date, addYearPrefix = false) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear =
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) /
    oneDay;
  let yearPrefix = "";
  if (addYearPrefix) {
    yearPrefix = date.getUTCFullYear().toString().slice(-1);
  }
  return `${yearPrefix}${dayOfYear.toString().padStart(3, "0")}`;
};

export const dayOfYearToDate = (
  dayOfYear: string,
  hasYearPrefix: boolean,
  referenceYear?: number,
) => {
  if (!referenceYear) {
    referenceYear = new Date().getFullYear()
  }
  if (hasYearPrefix) {
    const year = parseInt(dayOfYear.slice(0, 1));
    dayOfYear = dayOfYear.slice(1);
  }
  const date = new Date(referenceYear, 0);
  date.setDate(parseInt(dayOfYear));
  return new Date(date.toISOString().split("T")[0]);
};
