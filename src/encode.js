const moment = require("moment");
const fields = require("./fields");

const decimalToHex = (decimal) =>
  decimal.toString(16).padStart(2, "0").toUpperCase();

// Adds spaces to a field value to match the required length
// If the field value exceeds the required length, it is trimmed
const addPadding = (value, length, empty) => {
  if (!value && !empty) return "";
  if (!length) return value;

  const valueLength = value.length;

  if (valueLength > length) {
    value = value.substr(0, length);
  } else if (valueLength < length) {
    for (let i = 0; i < length - valueLength; i++) {
      value += " ";
    }
  }

  return value;
};

const getFieldValue = (fields, data, field) => {
  let emptyValue = "";

  // If this field is mandatory or one of the remaining fields in this section has a value, add an empty value
  // This allows us to keep the correct index for each field
  if (!field.default) {
    if (field.mandatory) {
      emptyValue = addPadding("", field.length, true);
    } else {
      let fieldIndex = fields.findIndex((x) => x.name === field.name);

      for (let i = fieldIndex; i < fields.length; i++) {
        const value = data[fields[i].name];
        if (typeof value !== "undefined" && value !== null && value !== "") {
          emptyValue = addPadding("", field.length, true);
          break;
        }
      }
    }
  }

  let value = data[field.name] || emptyValue || field.default;

  if (typeof value === "number") value = value.toString();

  // Parse boolean fields
  if (field.type === "boolean" && field.name in data) {
    let isTrue = value === true || value === "true" || value === "Y";
    value = isTrue ? "Y" : "N";
  }

  // Parse date fields
  if (
    value &&
    value.length !== field.length &&
    ["date", "dateWithYear"].includes(field.type)
  ) {
    let date = moment.utc(value, moment.ISO_8601, true);
    if (date.isValid()) {
      value =
        field.type === "dateWithYear"
          ? date.format("YYDDDD").substr(1)
          : date.format("DDDD");
    } else {
      throw `${field.name} has the value "${value}" which is not a valid date`;
    }
  }

  return addPadding(value, field.length);
};

// Adds a field to the elements array
// Recursive function which loops through the fields tree
const addField = (fields, elements, data, leg, field, legIndex) => {
  const dataToSearch = field.unique ? data : leg;

  if (field.fields) {
    let section = [];
    for (let subField of field.fields.filter(
      (f) => legIndex === 0 || !f.unique
    )) {
      section = addField(field.fields, section, data, leg, subField, legIndex);
    }
    elements.push(section);
  } else {
    elements.push(getFieldValue(fields, dataToSearch, field));
  }

  return elements;
};

// Takes an element from the elements array and adds it to the output
// Recursive function which loops through the elements tree
const addToOutput = (output, element) => {
  if (Array.isArray(element)) {
    let section = "";
    for (let subElement of element) {
      section = addToOutput(section, subElement);
    }
    output += decimalToHex(section.length);
    output += section;
  } else {
    output += element;
  }

  return output;
};

module.exports = (data) => {
  if (!data) {
    throw "No data specified";
  }
  if (!Array.isArray(data.legs)) {
    throw "Missing legs parameter";
  }

  fields.filter((x) => x.name === "numberOfLegs")[0].default = data.legs.length;

  let elements = [];
  let legIndex = 0;

  for (let leg of data.legs) {
    for (let field of fields.filter(
      (f) => !f.isSecurityField && (legIndex === 0 || !f.unique)
    )) {
      elements = addField(fields, elements, data, leg, field, legIndex);
    }
    legIndex++;
  }

  // Security data needs to be added last
  if (data.securityData) {
    for (let field of fields.filter((f) => f.isSecurityField)) {
      elements = addField(fields, elements, data, false, field, 0);
    }
  }

  let output = "";

  for (let element of elements) {
    output = addToOutput(output, element);
  }

  return output;
};
