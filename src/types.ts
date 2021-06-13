export interface Leg {
  operatingCarrierPNR?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  operatingCarrierDesignator?: string;
  flightNumber?: string;
  flightDate?: Date;
  compartmentCode?: string;
  seatNumber?: string;
  checkInSequenceNumber?: string;
  passengerStatus?: string;
  airlineNumericCode?: string;
  serialNumber?: string;
  selecteeIndicator?: string;
  internationalDocumentationVerification?: string;
  marketingCarrierDesignator?: string;
  frequentFlyerAirlineDesignator?: string;
  frequentFlyerNumber?: string;
  idIndicator?: string;
  freeBaggageAllowance?: string;
  fastTrack?: boolean;
  airlineInfo?: string;
}

export interface BoardingPassData {
  legs?: Leg[];
  passengerName?: string;
  passengerDescription?: string;
  checkInSource?: string;
  boardingPassIssuanceSource?: string;
  issuanceDate?: Date;
  documentType?: string;
  boardingPassIssuerDesignator?: string;
  baggageTagNumber?: string;
  firstBaggageTagNumber?: string;
  secondBaggageTagNumber?: string;
  securityDataType?: string;
  securityData?: string;
}

export interface BoardingPassMetaData {
  formatCode?: string;
  numberOfLegs?: number;
  electronicTicketIndicator?: string;
  versionNumberIndicator?: string;
  versionNumber?: number;
  securityDataIndicator?: string;
}

export interface BarcodedBoardingPass {
  data?: BoardingPassData;
  meta?: BoardingPassMetaData;
}
