import { BarcodedBoardingPass, Leg } from "./types";
import * as LENGTHS from "./field-lengths";
import { dateToDayOfYear, dayOfYearToDate, hexToNumber } from "./utils";

class SectionDecoder {
  barcodeString?: string;
  currentIndex: number = 0;

  constructor(barcodeString?: string) {
    this.barcodeString = barcodeString;
  }

  private getNextField(length?: number) {
    if (this.barcodeString === undefined) {
      return;
    }
    const barcodeLength = this.barcodeString.length;
    if (this.currentIndex >= barcodeLength) {
      return;
    }
    let value;
    const start = this.currentIndex;
    if (length === undefined) {
      value = this.barcodeString.substring(start);
    } else {
      value = this.barcodeString.substring(start, start + length);
    }
    this.currentIndex += length ?? barcodeLength;
    const trimmedValue = value.trimEnd();
    if (trimmedValue === "") {
      return;
    }
    return trimmedValue;
  }

  getNextString(length: number) {
    return this.getNextField(length);
  }

  getNextNumber(length: number) {
    const value = this.getNextField(length);
    if (value === undefined) {
      return;
    }
    return parseInt(value);
  }

  getNextDate(length: number, hasYearPrefix: boolean, referenceYear?: number) {
    const value = this.getNextField(length);
    if (value === undefined) {
      return;
    }
    return dayOfYearToDate(value, hasYearPrefix, referenceYear);
  }

  getNextBoolean() {
    const value = this.getNextField(1);
    if (value === undefined) {
      return;
    }
    return value === "Y";
  }

  getNextSectionSize() {
    return hexToNumber(this.getNextField(2) ?? "00");
  }

  getRemainingString() {
    return this.getNextField();
  }
}

export const decode = (barcodeString: string, referenceYear?: number) => {
  const bcbp: BarcodedBoardingPass = {};
  const mainSection = new SectionDecoder(barcodeString);

  bcbp.data = {};
  bcbp.meta = {};
  bcbp.meta.formatCode = mainSection.getNextString(LENGTHS.FORMAT_CODE);
  bcbp.meta.numberOfLegs =
    mainSection.getNextNumber(LENGTHS.NUMBER_OF_LEGS) ?? 0;
  bcbp.data.passengerName = mainSection.getNextString(LENGTHS.PASSENGER_NAME);
  bcbp.meta.electronicTicketIndicator = mainSection.getNextString(
    LENGTHS.ELECTRONIC_TICKET_INDICATOR
  );

  bcbp.data.legs = [];

  let addedUniqueFields = false;

  for (let legIndex = 0; legIndex < bcbp.meta.numberOfLegs; legIndex++) {
    const leg: Leg = {};
    leg.operatingCarrierPNR = mainSection.getNextString(
      LENGTHS.OPERATING_CARRIER_PNR
    );
    leg.departureAirport = mainSection.getNextString(LENGTHS.DEPARTURE_AIRPORT);
    leg.arrivalAirport = mainSection.getNextString(LENGTHS.ARRIVAL_AIRPORT);
    leg.operatingCarrierDesignator = mainSection.getNextString(
      LENGTHS.OPERATING_CARRIER_DESIGNATOR
    );
    leg.flightNumber = mainSection.getNextString(LENGTHS.FLIGHT_NUMBER);
    leg.flightDate = mainSection.getNextDate(
      LENGTHS.FLIGHT_DATE,
      false,
      referenceYear
    );
    leg.compartmentCode = mainSection.getNextString(LENGTHS.COMPARTMENT_CODE);
    leg.seatNumber = mainSection.getNextString(LENGTHS.SEAT_NUMBER);
    leg.checkInSequenceNumber = mainSection.getNextString(
      LENGTHS.CHECK_IN_SEQUENCE_NUMBER
    );
    leg.passengerStatus = mainSection.getNextString(LENGTHS.PASSENGER_STATUS);

    const conditionalSectionSize = mainSection.getNextSectionSize();
    const conditionalSection = new SectionDecoder(
      mainSection.getNextString(conditionalSectionSize)
    );

    if (!addedUniqueFields) {
      bcbp.meta.versionNumberIndicator = conditionalSection.getNextString(
        LENGTHS.VERSION_NUMBER_INDICATOR
      );
      bcbp.meta.versionNumber = conditionalSection.getNextNumber(
        LENGTHS.VERSION_NUMBER
      );

      const sectionASize = conditionalSection.getNextSectionSize();
      const sectionA = new SectionDecoder(
        conditionalSection.getNextString(sectionASize)
      );
      bcbp.data.passengerDescription = sectionA.getNextString(
        LENGTHS.PASSENGER_DESCRIPTION
      );
      bcbp.data.checkInSource = sectionA.getNextString(LENGTHS.CHECK_IN_SOURCE);
      bcbp.data.boardingPassIssuanceSource = sectionA.getNextString(
        LENGTHS.BOARDING_PASS_ISSUANCE_SOURCE
      );
      bcbp.data.issuanceDate = sectionA.getNextDate(
        LENGTHS.ISSUANCE_DATE,
        true,
        referenceYear
      );
      bcbp.data.documentType = sectionA.getNextString(LENGTHS.DOCUMENT_TYPE);
      bcbp.data.boardingPassIssuerDesignator = sectionA.getNextString(
        LENGTHS.BOARDING_PASS_ISSUER_DESIGNATOR
      );
      bcbp.data.baggageTagNumber = sectionA.getNextString(
        LENGTHS.BAGGAGE_TAG_NUMBER
      );
      bcbp.data.firstBaggageTagNumber = sectionA.getNextString(
        LENGTHS.FIRST_BAGGAGE_TAG_NUMBER
      );
      bcbp.data.secondBaggageTagNumber = sectionA.getNextString(
        LENGTHS.SECOND_BAGGAGE_TAG_NUMBER
      );

      addedUniqueFields = true;
    }

    const sectionBSize = conditionalSection.getNextSectionSize();
    const sectionB = new SectionDecoder(
      conditionalSection.getNextString(sectionBSize)
    );
    leg.airlineNumericCode = sectionB.getNextString(
      LENGTHS.AIRLINE_NUMERIC_CODE
    );
    leg.serialNumber = sectionB.getNextString(LENGTHS.SERIAL_NUMBER);
    leg.selecteeIndicator = sectionB.getNextString(LENGTHS.SELECTEE_INDICATOR);
    leg.internationalDocumentationVerification = sectionB.getNextString(
      LENGTHS.INTERNATIONAL_DOCUMENTATION_VERIFICATION
    );
    leg.marketingCarrierDesignator = sectionB.getNextString(
      LENGTHS.MARKETING_CARRIER_DESIGNATOR
    );
    leg.frequentFlyerAirlineDesignator = sectionB.getNextString(
      LENGTHS.FREQUENT_FLYER_AIRLINE_DESIGNATOR
    );
    leg.frequentFlyerNumber = sectionB.getNextString(
      LENGTHS.FREQUENT_FLYER_NUMBER
    );
    leg.idIndicator = sectionB.getNextString(LENGTHS.ID_INDICATOR);
    leg.freeBaggageAllowance = sectionB.getNextString(
      LENGTHS.FREE_BAGGAGE_ALLOWANCE
    );
    leg.fastTrack = sectionB.getNextBoolean();

    leg.airlineInfo = conditionalSection.getRemainingString();

    bcbp.data.legs.push(leg);
  }

  bcbp.meta.securityDataIndicator = mainSection.getNextString(
    LENGTHS.SECURITY_DATA_INDICATOR
  );
  bcbp.data.securityDataType = mainSection.getNextString(
    LENGTHS.SECURITY_DATA_TYPE
  );

  const securitySectionSize = mainSection.getNextSectionSize();
  const securitySection = new SectionDecoder(
    mainSection.getNextString(securitySectionSize)
  );
  bcbp.data.securityData = securitySection.getNextString(LENGTHS.SECURITY_DATA);

  if (bcbp.data.issuanceDate !== undefined && referenceYear === undefined) {
    for (let leg of bcbp.data.legs) {
      if (leg.flightDate !== undefined) {
        const dayOfYear = dateToDayOfYear(leg.flightDate);
        leg.flightDate = dayOfYearToDate(
          dayOfYear,
          false,
          bcbp.data.issuanceDate.getFullYear()
        );
      }
    }
  }

  return bcbp;
};
