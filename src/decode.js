import {
  format,
  parse,
  add,
  sub,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import fields from "./fields";

const hexToDecimal = (hex) => parseInt(hex, 16);

// Parses the value into a human readable format
const getValue = (field, value, referenceYear) => {
  if (value === "") return "";
  const year = referenceYear?.toString() || format(Date.now(), "y");

  let estimatedDate, difference;

  switch (field.type) {
    case "date":
      estimatedDate = parse(year + value + "Z", "yDDDX", Date.now());
      difference = differenceInMonths(Date.now(), estimatedDate);

      if (!referenceYear) {
        // Estimate the year for this date.
        // If the estimated date is too far in the past, add a year.
        if (difference > 10) {
          estimatedDate = parse(
            format(add(estimatedDate, { years: 1 }), "y") + value + "Z",
            "yDDDX",
            Date.now()
          );
        }
      }

      return estimatedDate;
    case "dateWithYear":
      let yearLastDigit = value.substr(0, 1);
      let dayOfYear = value.substr(1);

      estimatedDate = parse(
        year.slice(0, -1) + yearLastDigit + dayOfYear + "Z",
        "yDDDX",
        Date.now()
      );

      difference = differenceInYears(
        estimatedDate,
        parse(year + "001Z", "yDDDX", Date.now())
      );

      if (difference > 2) {
        estimatedDate = parse(
          format(sub(estimatedDate, { years: 10 }), "y") + dayOfYear + "Z",
          "yDDDX",
          Date.now()
        );
      }

      return estimatedDate;
    case "boolean":
      return value === "Y";
    default:
      return value;
  }
};

// Adds the field value to the output and removes it from the barcode string
// Recursive function which loops through the fields tree
const parseField = (barcodeString, output, field, referenceYear, legIndex) => {
  let fieldLength = field.length || barcodeString.length,
    value = barcodeString.substr(0, fieldLength).trim();

  if (value !== "" && !field.meta) {
    if (field.unique) {
      output[field.name] = getValue(field, value, referenceYear);
    } else {
      let leg = output.legs[legIndex];

      if (!leg) {
        leg = {};
        output.legs.push(leg);
      }

      leg[field.name] = getValue(field, value, referenceYear);
    }
  }

  barcodeString = barcodeString.substr(fieldLength);

  if (field.fields) {
    // This is a field size so get the next X characters where X is the field size value
    let sectionLength = hexToDecimal(value),
      sectionString = barcodeString.substr(0, sectionLength);

    for (let subField of field.fields.filter(
      (f) => legIndex === 0 || !f.unique
    )) {
      if (sectionString === "") break;

      let subFieldLength = parseField(
        sectionString,
        output,
        subField,
        referenceYear,
        legIndex
      );
      fieldLength += subFieldLength;
      sectionString = sectionString.substr(subFieldLength);
    }
  }

  return fieldLength;
};

export default (barcodeString, referenceYear) => {
  let legs = +barcodeString.substr(1, 1);

  let output = { legs: [] };

  for (let i = 0; i < legs; i++) {
    // Start the leg with an empty object
    output.legs.push({});

    for (let field of fields.filter(
      (f) => !f.isSecurityField && (i === 0 || !f.unique)
    )) {
      let fieldLength = parseField(
        barcodeString,
        output,
        field,
        referenceYear,
        i
      );
      barcodeString = barcodeString.substr(fieldLength);
    }
  }

  // Security data needs to be decoded last
  if (barcodeString.startsWith("^")) {
    for (let field of fields.filter((f) => f.isSecurityField)) {
      let fieldLength = parseField(
        barcodeString,
        output,
        field,
        referenceYear,
        0
      );
      barcodeString = barcodeString.substr(fieldLength);
    }
  }

  // Special case for using the issuance year as the source of truth for other dates without a year
  if (!referenceYear && output.issuanceDate) {
    const issuanceYear = format(output.issuanceDate, "yy");
    for (let leg of output.legs) {
      const originalFlightDate = format(leg.flightDate, "DDD");

      const estimatedDate = parse(
        issuanceYear + originalFlightDate + "Z",
        "yyDDDX",
        Date.now()
      );

      if (estimatedDate > originalFlightDate) leg.flightDate = estimatedDate;
    }
  }

  return output;
};
