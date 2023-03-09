import { BarcodedBoardingPass } from "./types";
import { dateToDayOfYear, numberToHex } from "./utils";
import * as LENGTHS from "./field-lengths";

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
      value = dateToDayOfYear(field, addYearPrefix);
    } else if (typeof field === "boolean") {
      value = field ? "Y" : "N";
    } else {
      value = field;
    }

    let valueLength = value.length;

    if (length !== undefined) {
      if (valueLength > length) {
        value = value.substring(0, length);
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

export const encode = (bcbp: BarcodedBoardingPass) => {
  bcbp.meta = {
    formatCode: "M",
    numberOfLegs: bcbp?.data?.legs?.length ?? 0,
    electronicTicketIndicator: "E",
    versionNumberIndicator: ">",
    versionNumber: 6,
    securityDataIndicator: "^",
    ...bcbp.meta,
  };

  const barcodeData = new SectionBuilder();
  if (bcbp.data?.legs === undefined || bcbp.data.legs.length === 0) {
    return "";
  }

  barcodeData.addField(bcbp.meta.formatCode, LENGTHS.FORMAT_CODE);
  barcodeData.addField(bcbp.meta.numberOfLegs, LENGTHS.NUMBER_OF_LEGS);
  barcodeData.addField(bcbp.data.passengerName, LENGTHS.PASSENGER_NAME);
  barcodeData.addField(
    bcbp.meta.electronicTicketIndicator,
    LENGTHS.ELECTRONIC_TICKET_INDICATOR
  );

  let addedUniqueFields = false;

  for (let leg of bcbp.data.legs) {
    barcodeData.addField(
      leg.operatingCarrierPNR,
      LENGTHS.OPERATING_CARRIER_PNR
    );
    barcodeData.addField(leg.departureAirport, LENGTHS.DEPARTURE_AIRPORT);
    barcodeData.addField(leg.arrivalAirport, LENGTHS.ARRIVAL_AIRPORT);
    barcodeData.addField(
      leg.operatingCarrierDesignator,
      LENGTHS.OPERATING_CARRIER_DESIGNATOR
    );
    barcodeData.addField(leg.flightNumber, LENGTHS.FLIGHT_NUMBER);
    barcodeData.addField(leg.flightDate, LENGTHS.FLIGHT_DATE);
    barcodeData.addField(leg.compartmentCode, LENGTHS.COMPARTMENT_CODE);
    barcodeData.addField(leg.seatNumber, LENGTHS.SEAT_NUMBER);
    barcodeData.addField(
      leg.checkInSequenceNumber,
      LENGTHS.CHECK_IN_SEQUENCE_NUMBER
    );
    barcodeData.addField(leg.passengerStatus, LENGTHS.PASSENGER_STATUS);

    const conditionalSection = new SectionBuilder();

    if (!addedUniqueFields) {
      conditionalSection.addField(
        bcbp.meta.versionNumberIndicator,
        LENGTHS.VERSION_NUMBER_INDICATOR
      );
      conditionalSection.addField(
        bcbp.meta.versionNumber,
        LENGTHS.VERSION_NUMBER
      );

      const sectionA = new SectionBuilder();
      sectionA.addField(
        bcbp.data.passengerDescription,
        LENGTHS.PASSENGER_DESCRIPTION
      );
      sectionA.addField(bcbp.data.checkInSource, LENGTHS.CHECK_IN_SOURCE);
      sectionA.addField(
        bcbp.data.boardingPassIssuanceSource,
        LENGTHS.BOARDING_PASS_ISSUANCE_SOURCE
      );
      sectionA.addField(bcbp.data.issuanceDate, LENGTHS.ISSUANCE_DATE, true);
      sectionA.addField(bcbp.data.documentType, LENGTHS.DOCUMENT_TYPE);
      sectionA.addField(
        bcbp.data.boardingPassIssuerDesignator,
        LENGTHS.BOARDING_PASS_ISSUER_DESIGNATOR
      );
      sectionA.addField(bcbp.data.baggageTagNumber, LENGTHS.BAGGAGE_TAG_NUMBER);
      sectionA.addField(
        bcbp.data.firstBaggageTagNumber,
        LENGTHS.FIRST_BAGGAGE_TAG_NUMBER
      );
      sectionA.addField(
        bcbp.data.secondBaggageTagNumber,
        LENGTHS.SECOND_BAGGAGE_TAG_NUMBER
      );

      conditionalSection.addSection(sectionA);
      addedUniqueFields = true;
    }

    const sectionB = new SectionBuilder();
    sectionB.addField(leg.airlineNumericCode, LENGTHS.AIRLINE_NUMERIC_CODE);
    sectionB.addField(leg.serialNumber, LENGTHS.SERIAL_NUMBER);
    sectionB.addField(leg.selecteeIndicator, LENGTHS.SELECTEE_INDICATOR);
    sectionB.addField(
      leg.internationalDocumentationVerification,
      LENGTHS.INTERNATIONAL_DOCUMENTATION_VERIFICATION
    );
    sectionB.addField(
      leg.marketingCarrierDesignator,
      LENGTHS.MARKETING_CARRIER_DESIGNATOR
    );
    sectionB.addField(
      leg.frequentFlyerAirlineDesignator,
      LENGTHS.FREQUENT_FLYER_AIRLINE_DESIGNATOR
    );
    sectionB.addField(leg.frequentFlyerNumber, LENGTHS.FREQUENT_FLYER_NUMBER);
    sectionB.addField(leg.idIndicator, LENGTHS.ID_INDICATOR);
    sectionB.addField(leg.freeBaggageAllowance, LENGTHS.FREE_BAGGAGE_ALLOWANCE);
    sectionB.addField(leg.fastTrack, LENGTHS.FAST_TRACK);
    conditionalSection.addSection(sectionB);
    conditionalSection.addField(leg.airlineInfo);
    barcodeData.addSection(conditionalSection);
  }

  if (bcbp.data.securityData !== undefined) {
    barcodeData.addField(
      bcbp.meta.securityDataIndicator,
      LENGTHS.SECURITY_DATA_INDICATOR
    );
    barcodeData.addField(
      bcbp.data.securityDataType ?? "1",
      LENGTHS.SECURITY_DATA_TYPE
    );
    const securitySection = new SectionBuilder();
    securitySection.addField(bcbp.data.securityData, LENGTHS.SECURITY_DATA);
    barcodeData.addSection(securitySection);
  }

  return barcodeData.toString();
};
