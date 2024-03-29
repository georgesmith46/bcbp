import { encode } from "./encode.ts";

describe("encode", () => {
  describe("empty", () => {
    const expected = "",
      input = {};
    it(`should output ${expected}`, () => {
      expect(encode(input)).toEqual(expected);
    });
  });
  describe("minimal", () => {
    const expected =
        "M1                    E                                   30>6002A                                         N",
      input = {
        data: {
          legs: [{ fastTrack: false }],
        },
      };
    it(`should output ${expected}`, () => {
      expect(encode(input)).toEqual(expected);
    });
  });
  describe("basic", () => {
    const expected =
        "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 001F001A0025 106>60000",
      input = {
        data: {
          passengerName: "DESMARAIS/LUC",
          legs: [
            {
              operatingCarrierPNR: "ABC123",
              departureAirport: "YUL",
              arrivalAirport: "FRA",
              operatingCarrierDesignator: "AC",
              flightNumber: "0834",
              flightDate: new Date("2016-01-01T00:00:00.000Z"),
              compartmentCode: "F",
              seatNumber: "001A",
              checkInSequenceNumber: "0025",
              passengerStatus: "1",
            },
          ],
        },
      };
    it(`should output ${expected}`, () => {
      expect(encode(input)).toEqual(expected);
    });
  });
  describe("random", () => {
    const expected =
        "M1DESMARAIS/LUC       EABC123    FRAAC      226F001A      3B>60B1W 6225BAC 2A   1234567890 1AC AC 1234567890123    20KY^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE",
      input = {
        data: {
          passengerName: "DESMARAIS/LUC",
          passengerDescription: "1",
          checkInSource: "W",
          issuanceDate: new Date("2016-08-12T00:00:00.000Z"),
          documentType: "B",
          boardingPassIssuerDesignator: "AC",
          legs: [
            {
              operatingCarrierPNR: "ABC123",
              arrivalAirport: "FRA",
              operatingCarrierDesignator: "AC",
              flightDate: new Date("2016-08-13T00:00:00.000Z"),
              compartmentCode: "F",
              seatNumber: "001A",
              serialNumber: "1234567890",
              internationalDocumentationVerification: "1",
              marketingCarrierDesignator: "AC",
              frequentFlyerAirlineDesignator: "AC",
              frequentFlyerNumber: "1234567890123",
              freeBaggageAllowance: "20K",
              fastTrack: true,
            },
          ],
          securityDataType: 1,
          securityData:
            "GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE",
        },
      };
    it(`should output ${expected}`, () => {
      expect(encode(input)).toEqual(expected);
    });
  });
  describe("full", () => {
    const expected =
      "M2DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 14D>6181WW6225BAC 00141234560032A0141234567890 1AC AC 1234567890123    20KYLX58ZDEF456 FRAGVALH 3664 227C012C0002 12E2A0140987654321 1AC AC 1234567890123    2PCNWQ^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE";
    const input = {
      data: {
        passengerName: "DESMARAIS/LUC",
        passengerDescription: "1",
        checkInSource: "W",
        boardingPassIssuanceSource: "W",
        issuanceDate: new Date("2016-08-12T00:00:00.000Z"),
        documentType: "B",
        boardingPassIssuerDesignator: "AC",
        baggageTagNumber: "0014123456003",
        legs: [
          {
            operatingCarrierPNR: "ABC123",
            departureAirport: "YUL",
            arrivalAirport: "FRA",
            operatingCarrierDesignator: "AC",
            flightNumber: "0834",
            flightDate: new Date("2016-08-13T00:00:00.000Z"),
            compartmentCode: "F",
            seatNumber: "001A",
            checkInSequenceNumber: "0025",
            passengerStatus: "1",
            airlineNumericCode: "014",
            serialNumber: "1234567890",
            internationalDocumentationVerification: "1",
            marketingCarrierDesignator: "AC",
            frequentFlyerAirlineDesignator: "AC",
            frequentFlyerNumber: "1234567890123",
            freeBaggageAllowance: "20K",
            fastTrack: "Y",
            airlineInfo: "LX58Z",
          },
          {
            operatingCarrierPNR: "DEF456",
            departureAirport: "FRA",
            arrivalAirport: "GVA",
            operatingCarrierDesignator: "LH",
            flightNumber: "3664",
            flightDate: new Date("2016-08-14T00:00:00.000Z"),
            compartmentCode: "C",
            seatNumber: "012C",
            checkInSequenceNumber: "0002",
            passengerStatus: "1",
            airlineNumericCode: "014",
            serialNumber: "0987654321",
            internationalDocumentationVerification: "1",
            marketingCarrierDesignator: "AC",
            frequentFlyerAirlineDesignator: "AC",
            frequentFlyerNumber: "1234567890123",
            freeBaggageAllowance: "2PC",
            fastTrack: "N",
            airlineInfo: "WQ",
          },
        ],
        securityDataType: 1,
        securityData:
          "GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE",
      },
    };
    it(`should output ${expected}`, () => {
      expect(encode(input)).toEqual(expected);
    });
  });
  describe("no security data type", () => {
    const expected =
        "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 106>60000^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE",
      input = {
        data: {
          passengerName: "DESMARAIS/LUC",
          legs: [
            {
              operatingCarrierPNR: "ABC123",
              departureAirport: "YUL",
              arrivalAirport: "FRA",
              operatingCarrierDesignator: "AC",
              flightNumber: "0834",
              flightDate: new Date("2016-08-13T00:00:00.000Z"),
              compartmentCode: "F",
              seatNumber: "001A",
              checkInSequenceNumber: "0025",
              passengerStatus: "1",
            },
          ],
          securityData:
            "GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE",
        },
      };
    it(`should output ${expected}`, () => {
      expect(encode(input)).toEqual(expected);
    });
  });
  describe("no data", () => {
    const expected = "",
      input = {
        data: {
          legs: [],
        },
      };
    it(`should output ""`, () => {
      expect(encode(input)).toEqual(expected);
    });
  });
});
