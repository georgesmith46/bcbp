const moment = require("moment")
	, fields = require("./fields");

const hexToDecimal = hex => parseInt(hex, 16);

// Parses the value into a human readable format
const getValue = (field, value) => {
	if (value === "") return "";

	if (field.type === "date") {
		return moment.utc(value, "DDDD", true).toISOString();
	}
	if (field.type === "dateWithYear") {
		let year = value.substr(0, 1),
			dayOfYear = value.substr(1),
			currentYear = moment.utc().format("YY");

		let estimatedYear = moment.utc(currentYear.substr(0, 1) + year, "YY", true)
			, difference = estimatedYear.diff(moment.utc(), "years");

		if (difference > 2) {
			estimatedYear.subtract(10, "years");
		}

		return moment.utc(estimatedYear.format("YY") + dayOfYear, "YYDDDD", true).toISOString();
	}
	else if (field.type === "boolean") {
		return value === "Y";
	}
	else {
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
		}
		else {
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

		for (let subField of field.fields.filter(f => legIndex === 0 || !f.unique)) {
			if (sectionString === "") break;

			let subFieldLength = parseField(field.fields, sectionString, output, subField, legIndex);
			fieldLength += subFieldLength;
			sectionString = sectionString.substr(subFieldLength);
		}
	}

	return fieldLength;
};

module.exports = barcodeString => {
	let legs = barcodeString.substr(1,1);

	let output = {legs: []};

	for (let i = 0; i < legs; i++) {
		for (let field of fields.filter(f => !f.isSecurityField && (i === 0 || !f.unique))) {
			let fieldLength = parseField(fields, barcodeString, output, field, i);
			barcodeString = barcodeString.substr(fieldLength);
		}
	}

	// Security data needs to be decoded last
	if (barcodeString.startsWith("^")) {
		for (let field of fields.filter(f => f.isSecurityField)) {
			let fieldLength = parseField(fields, barcodeString, output, field, 0);
			barcodeString = barcodeString.substr(fieldLength);
		}
	}

	return output;
};
