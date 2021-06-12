import { BoardingPassBarcodeData, BoardingPassData } from "./types";

const numberToHex = (n: number) =>
  n.toString(16).padStart(2, "0").toUpperCase();

const parseDate = (date: Date, addYearPrefix = false) => {
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

interface FieldSize {
  size: number;
  isDefined: boolean;
}

class SectionBuilder {
  output: string[] = [];
  fieldSizes: FieldSize[] = [];

  addField(
    field?: string | number | boolean | Date,
    length?: number,
    addYearPrefix = false
  ) {
    let value = "";

    if (field === undefined) {
      value = "";
    } else if (typeof field === "number") {
      value = field.toString();
    } else if (field instanceof Date) {
      value = parseDate(field, addYearPrefix);
    } else if (typeof field === "boolean") {
      value = field ? "Y" : "N";
    } else {
      value = field;
    }

    let valueLength = value.length;

    if (length !== undefined) {
      if (valueLength > length) {
        value = value.substr(0, length);
      } else if (valueLength < length) {
        for (let i = 0; i < length - valueLength; i++) {
          value += " ";
        }
      }
    }

    this.output.push(value);

    this.fieldSizes.push({
      size: length ?? value.length,
      isDefined: field !== undefined,
    });
  }

  addSection(section: SectionBuilder) {
    const sectionString = section.toString();

    let foundLastValue = false;
    let sectionLength = 0;
    for (let fieldSize of section.fieldSizes.reverse()) {
      if (!foundLastValue && fieldSize.isDefined) {
        foundLastValue = true;
      }

      if (foundLastValue) {
        sectionLength += fieldSize.size;
      }
    }

    this.addField(numberToHex(sectionLength), 2);
    this.addField(sectionString, sectionLength);
  }

  toString() {
    return this.output.join("");
  }
}

class BoardingPassDataEncoder implements BoardingPassBarcodeData {
  data: BoardingPassData;
  formatCode: string;
  numberOfLegs: number;
  electronicTicketIndicator: string;
  versionNumberIndicator: string;
  versionNumber: number;
  securityDataIndicator: string;

  constructor(data: BoardingPassData) {
    this.data = data;
    this.formatCode = "M";
    this.numberOfLegs = data.legs?.length ?? 0;
    this.electronicTicketIndicator = "E";
    this.versionNumberIndicator = ">";
    this.versionNumber = 6;
    this.securityDataIndicator = "^";
  }

  encode() {
    const barcodeData = new SectionBuilder();
    if (this.data.legs === undefined || this.data.legs.length === 0) {
      return "";
    }

    barcodeData.addField(this.formatCode, 1);
    barcodeData.addField(this.numberOfLegs, 1);
    barcodeData.addField(this.data.passengerName, 20);
    barcodeData.addField(this.electronicTicketIndicator, 1);

    let addedUniqueFields = false;

    for (let leg of this.data.legs) {
      barcodeData.addField(leg.operatingCarrierPNR, 7);
      barcodeData.addField(leg.departureAirport, 3);
      barcodeData.addField(leg.arrivalAirport, 3);
      barcodeData.addField(leg.operatingCarrierDesignator, 3);
      barcodeData.addField(leg.flightNumber, 5);
      barcodeData.addField(leg.flightDate, 3);
      barcodeData.addField(leg.compartmentCode, 1);
      barcodeData.addField(leg.seatNumber, 4);
      barcodeData.addField(leg.checkInSequenceNumber, 5);
      barcodeData.addField(leg.passengerStatus, 1);

      const conditionalSection = new SectionBuilder();

      if (!addedUniqueFields) {
        conditionalSection.addField(this.versionNumberIndicator, 1);
        conditionalSection.addField(this.versionNumber, 1);

        const sectionA = new SectionBuilder();
        sectionA.addField(this.data.passengerDescription, 1);
        sectionA.addField(this.data.checkInSource, 1);
        sectionA.addField(this.data.boardingPassIssuanceSource, 1);
        sectionA.addField(this.data.issuanceDate, 4, true);
        sectionA.addField(this.data.documentType, 1);
        sectionA.addField(this.data.boardingPassIssuerDesignator, 3);
        sectionA.addField(this.data.baggageTagNumber, 13);
        sectionA.addField(this.data.firstBaggageTagNumber, 13);
        sectionA.addField(this.data.secondBaggageTagNumber, 13);

        conditionalSection.addSection(sectionA);
        addedUniqueFields = true;
      }

      const sectionB = new SectionBuilder();
      sectionB.addField(leg.airlineNumericCode, 3);
      sectionB.addField(leg.serialNumber, 10);
      sectionB.addField(leg.selecteeIndicator, 1);
      sectionB.addField(leg.internationalDocumentationVerification, 1);
      sectionB.addField(leg.marketingCarrierDesignator, 3);
      sectionB.addField(leg.frequentFlyerAirlineDesignator, 3);
      sectionB.addField(leg.frequentFlyerNumber, 16);
      sectionB.addField(leg.idIndicator, 1);
      sectionB.addField(leg.freeBaggageAllowance, 3);
      sectionB.addField(leg.fastTrack, 1);
      conditionalSection.addSection(sectionB);
      conditionalSection.addField(leg.airlineInfo);
      barcodeData.addSection(conditionalSection);
    }

    if (this.data.securityData !== undefined) {
      barcodeData.addField(this.securityDataIndicator, 1);
      barcodeData.addField(this.data.securityDataType ?? "1", 1);
      const securitySection = new SectionBuilder();
      securitySection.addField(this.data.securityData, 100);
      barcodeData.addSection(securitySection);
    }

    return barcodeData.toString();
  }
}

export default (data: BoardingPassData) => {
  const barcodeData = new BoardingPassDataEncoder(data);

  return barcodeData.encode();
};
