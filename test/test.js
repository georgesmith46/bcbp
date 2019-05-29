const assert = require("assert").strict
	, encode = require("../encode")
	, decode = require("../decode");

describe("encode", function () {
	describe("minimal", function () {
		const expected = "M1                    E                                   30>6002A                                         N"
			, input = {
			legs: [
				{ fastTrack: false }
			]
		};
		it(`should output ${expected}`, function () {
			assert.equal(encode(input), expected);
		});
	});
	describe("basic", function () {
		const expected = "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 106>60000"
			, input = {
				passengerName: "DESMARAIS/LUC",
				legs: [
					{
						operatingCarrierPNR: "ABC123",
						departureAirport: "YUL",
						arrivalAirport: "FRA",
						operatingCarrierDesignator: "AC",
						flightNumber: "0834",
						flightDate: "226",
						compartmentCode: "F",
						seatNumber: "001A",
						checkInSequenceNumber: "0025",
						passengerStatus: "1",
					}
				]
			};
		it(`should output ${expected}`, function () {
			assert.equal(encode(input), expected);
		});
	});
	describe("random", function () {
		const expected = "M1DESMARAIS/LUC       EABC123    FRAAC      226F001A      3B>60B1W 6225BAC 2A   1234567890 1AC AC 1234567890123    20KY^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE"
			, input = {
				passengerName: "DESMARAIS/LUC",
				passengerDescription: "1",
				checkInSource: "W",
				issuanceDate: "2006-08-13",
				documentType: "B",
				boardingPassIssuerDesignator: "AC",
				legs: [
					{
						operatingCarrierPNR: "ABC123",
						arrivalAirport: "FRA",
						operatingCarrierDesignator: "AC",
						flightDate: "226",
						compartmentCode: "F",
						seatNumber: "001A",
						serialNumber: "1234567890",
						internationalDocumentationVerification: "1",
						marketingCarrierDesignator: "AC",
						frequentFlyerAirlineDesignator: "AC",
						frequentFlyerNumber: "1234567890123",
						freeBaggageAllowance: "20K",
						fastTrack: true,
					}
				],
				securityDataType: 1,
				securityData: "GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE"
			};
		it(`should output ${expected}`, function () {
			assert.equal(encode(input), expected);
		});
	});
	describe("full", function () {
		const expected = "M2DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 14D>6181WW6225BAC 00141234560032A0141234567890 1AC AC 1234567890123    20KYLX58ZDEF456 FRAGVALH 3664 227C012C0002 12E2A0140987654321 1AC AC 1234567890123    2PCNWQ^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE"
			, input = {
				passengerName: "DESMARAIS/LUC",
				passengerDescription: "1",
				checkInSource: "W",
				boardingPassIssuanceSource: "W",
				issuanceDate: "6225",
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
						flightDate: new Date("2018-08-14"),
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
						flightDate: "227",
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
					}
				],
				securityDataType: 1,
				securityData: "GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE"
			};
		it(`should output ${expected}`, function () {
			assert.equal(encode(input), expected);
		});
	});
	describe("no security data type", function () {
		const expected = "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 106>60000^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE"
			, input = {
			passengerName: "DESMARAIS/LUC",
			legs: [
				{
					operatingCarrierPNR: "ABC123",
					departureAirport: "YUL",
					arrivalAirport: "FRA",
					operatingCarrierDesignator: "AC",
					flightNumber: "0834",
					flightDate: "226",
					compartmentCode: "F",
					seatNumber: "001A",
					checkInSequenceNumber: "0025",
					passengerStatus: "1",
				}
			],
			securityData: "GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE"
		};
		it(`should output ${expected}`, function () {
			assert.equal(encode(input), expected);
		});
	});
	describe("no data", function () {
		const expected = ""
			, input = {
			legs: []
		};
		it(`should output ""`, function () {
			assert.equal(encode(input), expected);
		});
	});
});

describe("decode", function () {
	describe("basic", function () {
		const input = "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 106>60000";
		it(`number of legs should equal 1`, function () {
			assert.equal(decode(input).legs.length, 1);
		});
		it(`departure airport should equal YUL`, function () {
			assert.equal(decode(input).legs[0].departureAirport, "YUL");
		});
	});
	describe("random", function () {
		const input = "M1DESMARAIS/LUC       EABC123    FRAAC      226F001A      3B>60B1W 6225BAC 2A   1234567890 1AC AC 1234567890123    20KY^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE";
		it(`number of legs should equal 1`, function () {
			assert.equal(decode(input).legs.length, 1);
		});
		it(`departure airport should not exist`, function () {
			assert.equal(decode(input).legs[0].departureAirport, undefined);
		});
		it(`arrival airport should equal FRA`, function () {
			assert.equal(decode(input).legs[0].arrivalAirport, "FRA");
		});
		it(`first leg should have fast track`, function () {
			assert.equal(decode(input).legs[0].fastTrack, true);
		});
	});
	describe("full", function () {
		const input = "M2DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 14D>6181WW6225BAC 00141234560032A0141234567890 1AC AC 1234567890123    20KYLX58ZDEF456 FRAGVALH 3664 227C012C0002 12E2A0140987654321 1AC AC 1234567890123    2PCNWQ^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE";
		it(`number of legs should equal 2`, function () {
			assert.equal(decode(input).legs.length, 2);
		});
		it(`arrival airport should equal FRA`, function () {
			assert.equal(decode(input).legs[0].arrivalAirport, "FRA");
		});
		it(`second leg should not have fast track`, function () {
			assert.equal(decode(input).legs[1].fastTrack, false);
		});
		it(`security data should equal GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE`, function () {
			assert.equal(decode(input).securityData, "GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE");
		});
	});
	describe("empty first leg", function () {
		const input = "M2DESMARAIS/LUC       E                                   06>60000ABC123 YULFRAAC 0834 226F001A0025 10200";
		it(`number of legs should equal 2`, function () {
			assert.equal(decode(input).legs.length, 2);
		});
		it(`PNR of first leg should equal undefined`, function () {
			assert.equal(decode(input).legs[0].operatingCarrierPNR, undefined);
		});
		it(`PNR of second leg should equal ABC123`, function () {
			assert.equal(decode(input).legs[1].operatingCarrierPNR, "ABC123");
		});
	});
});

describe("encode/decode", function () {
	describe("basic", function () {
		const expected = "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 106>60000";
		it(`should output ${expected}`, function () {
			assert.equal(encode(decode(expected)), expected);
		});
	});
	describe("random", function () {
		const expected = "M1DESMARAIS/LUC       EABC123    FRAAC      226F001A      3B>60B1W 6225BAC 2A   1234567890 1AC AC 1234567890123    20KY^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE";
		it(`should output ${expected}`, function () {
			assert.equal(encode(decode(expected)), expected);
		});
	});
	describe("full", function () {
		const expected = "M2DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 14D>6181WW6225BAC 00141234560032A0141234567890 1AC AC 1234567890123    20KYLX58ZDEF456 FRAGVALH 3664 227C012C0002 12E2A0140987654321 1AC AC 1234567890123    2PCNWQ^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE";
		it(`should output ${expected}`, function () {
			assert.equal(encode(decode(expected)), expected);
		});
	});
});
