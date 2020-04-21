const moment = require("moment");
const fields = require("./fields");

const hexToDecimal = (hex) => parseInt(hex, 16);

// Parses the value into a human readable format
const getValue = (field, value) => {
  if (value === "") return "";

  let estimatedDate, difference;

  switch (field.type) {
    case "date":
      estimatedDate = moment.utc(
        moment.utc().format("YY") + value,
        "YYDDDD",
        true
      );
      difference = moment.utc().diff(estimatedDate, "months");

      // Estimate the year for this date.
      // If the estimated date is too far in the past, add a year.
      if (difference > 10) {
        estimatedDate = moment.utc(
          estimatedDate.add(1, "year").format("YY") + value,
          "YYDDDD",
          true
        );
      }

      return estimatedDate.toISOString();
    case "dateWithYear":
      let year = value.substr(0, 1),
        dayOfYear = value.substr(1),
        currentYear = moment.utc().format("YY");

      estimatedDate = moment.utc(
        currentYear.substr(0, 1) + year + dayOfYear,
        "YYDDDD",
        true
      );
      difference = estimatedDate.diff(moment.utc(), "years");

      if (difference > 2) {
        estimatedDate = moment.utc(
          estimatedDate.subtract(10, "years").format("YY") + dayOfYear,
          "YYDDDD",
          true
        );
      }

      return estimatedDate.toISOString();
    case "boolean":
      return value === "Y";
    default:
      return value;
  }
};

// Adds the field value to the output and removes it from the barcode string
// Recursive function which loops through the fields tree
const parseField = (fields, barcodeString, output, field, legIndex) => {
  let fieldLength = field.length || barcodeString.length,
    value = barcodeString.substr(0, fieldLength).trim();

  if (value !== "" && !field.meta) {
    if (field.unique) {
      output[field.name] = getValue(field, value);
    } else {
      let leg = output.legs[legIndex];

      if (!leg) {
        leg = {};
        output.legs.push(leg);
      }

      leg[field.name] = getValue(field, value);
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
        field.fields,
        sectionString,
        output,
        subField,
        legIndex
      );
      fieldLength += subFieldLength;
      sectionString = sectionString.substr(subFieldLength);
    }
  }

  return fieldLength;
};

module.exports = (barcodeString) => {
  let legs = +barcodeString.substr(1, 1);

  let output = { legs: [] };

  for (let i = 0; i < legs; i++) {
    // Start the leg with an empty object
    output.legs.push({});

    for (let field of fields.filter(
      (f) => !f.isSecurityField && (i === 0 || !f.unique)
    )) {
      let fieldLength = parseField(fields, barcodeString, output, field, i);
      barcodeString = barcodeString.substr(fieldLength);
    }
  }

  // Security data needs to be decoded last
  if (barcodeString.startsWith("^")) {
    for (let field of fields.filter((f) => f.isSecurityField)) {
      let fieldLength = parseField(fields, barcodeString, output, field, 0);
      barcodeString = barcodeString.substr(fieldLength);
    }
  }

  return output;
};
