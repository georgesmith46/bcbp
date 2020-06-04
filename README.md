[![CircleCI](https://circleci.com/gh/georgesmith46/bcbp.svg?style=shield)](https://app.circleci.com/pipelines/github/georgesmith46/bcbp)
[![License](https://badgen.net/npm/license/bcbp)](LICENSE)
[![Bundlephobia](https://badgen.net/bundlephobia/minzip/bcbp)](https://bundlephobia.com/result?p=bcbp)
[![Version](https://badgen.net/npm/v/bcbp)](https://npm.im/bcbp)

# BCBP

Encoding/decoding library for the IATA Bar Coded Boarding Pass

- Supports version 6 of the BCBP standard
- Supports any number of legs

## Getting started

### Installation

Add BCBP to your project by executing `npm install bcbp`.

### Usage

Here's an example of basic usage:

```js
import { decode } from "bcbp";

let output = decode(
  "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 100"
);

console.log(output.passengerName); // DESMARAIS/LUC
```

## User guide

### .encode(`object`)

Converts an object to a BCBP string. Any of the following parameters can be skipped (except legs).

#### Object

| Name                         | Description                                          | Example values                                                                                                                                                                                                                |
| ---------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| passengerName                | Passenger Name                                       | <ul><li>DESMARAIS/LUC</li><li>DOE/JOHN</li></ul>                                                                                                                                                                              |
| passengerDescription         | Passenger Description                                | <ul><li>0 - Adult</li><li>1 - Male</li><li>2 - Female</li><li>3 - Child</li><li>4 - Infant</li><li>5 - No passenger (cabin baggage)</li><li>6 - Adult travelling with infant</li><li>7 - Unaccompanied minor</li></ul>        |
| checkInSource                | Source of check-in                                   | <ul><li>W - Web</li><li>K - Airport Kiosk</li><li>R - Remote or Off Site Kiosk</li><li>M - Mobile Device</li><li>O - Airport Agent</li><li>T - Town Agent</li><li>V - Third Party Vendor</li></ul>                            |
| boardingPassIssuanceSource   | Source of Boarding Pass Issuance                     | <ul><li>W - Web</li><li>K - Airport Kiosk</li><li>X - Transfer Kiosk</li><li>R - Remote or Off Site Kiosk</li><li>M - Mobile Device</li><li>O - Airport Agent</li><li>T - Town Agent</li><li>V - Third Party Vendor</li></ul> |
| issuanceDate                 | Date of Issue of Boarding Pass                       | <ul><li>6225</li><li>ISO 8601 formatted string</li><li>Moment.js object</li><li>JavaScript date object</li></ul>                                                                                                              |
| documentType                 | Document Type                                        | <ul><li>B - Boarding Pass</li><li>I - Itinery Receipt</li></ul>                                                                                                                                                               |
| boardingPassIssuerDesignator | Airline Designator of boarding pass issuer           | <ul><li>AC</li></ul>                                                                                                                                                                                                          |
| baggageTagNumber             | Baggage Tag Licence Plate Number(s)                  | <ul><li>0014123456003</li></ul>                                                                                                                                                                                               |
| firstBaggageTagNumber        | 1st Non-Consecutive Baggage Tag Licence Plate Number | <ul><li>0014123456003</li></ul>                                                                                                                                                                                               |
| secondBaggageTagNumber       | 2nd Non-Consecutive Baggage Tag Licence Plate Number | <ul><li>0014123456003</li></ul>                                                                                                                                                                                               |
| securityDataType             | Type of Security Data                                | <ul><li>1</li></ul>                                                                                                                                                                                                           |
| securityData                 | Security Data                                        | <ul><li>GIWVC5EH7JNT...</li></ul>                                                                                                                                                                                             |
| legs                         | Repeatable legs data                                 | <ul><li>Array - See table below</li></ul>                                                                                                                                                                                     |

#### Legs

Any of the following parameters can be skipped.

| Name                                   | Description                              | Example values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| operatingCarrierPNR                    | Operating carrier PNR Code               | <ul><li>ABC123</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| departureAirport                       | From City Airport Code                   | <ul><li>YUL</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| arrivalAirport                         | To City Airport Code                     | <ul><li>FRA</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| operatingCarrierDesignator             | Operating carrier Designator             | <ul><li>AC</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| flightNumber                           | Flight Number                            | <ul><li>0834</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| flightDate                             | Date of Flight                           | <ul><li>226</li><li>ISO 8601 formatted string</li><li>Moment.js object</li><li>JavaScript date object</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                      |
| compartmentCode                        | Compartment Code                         | <ul><li>F</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| seatNumber                             | Seat Number                              | <ul><li>001A</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| checkInSequenceNumber                  | Check-in Sequence Number                 | <ul><li>0025</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| passengerStatus                        | Passenger Status                         | <ul><li>0 - Ticket issuance/passenger not checked in</li><li>1 - Ticket issuance/passenger checked in</li><li>2 - Bag checked/passenger not checked in</li><li>3 - Bag checked/passenger checked in</li><li>4 - Passenger passed security check</li><li>5 - Passenger passed security gate exit (coupon used)</li><li>6 - Transit</li><li>7 - Standby</li><li>8 - Boarding data revalidation done</li><li>9 - Original boarding line used at time of ticket issuance</li><li>A - Up- or down-grading required at close out</li></ul> |
| airlineNumericCode                     | Airline Numeric Code                     | <ul><li>014</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| serialNumber                           | Document Form/Serial Number              | <ul><li>1234567890</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| selecteeIndicator                      | Selectee indicator                       | <ul><li>0</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| internationalDocumentationVerification | International Documentation Verification | <ul><li>0 - Travel document verification not required</li><li>1 - Travel document verification required</li><li>2 - Travel document verification performed</li></ul>                                                                                                                                                                                                                                                                                                                                                                 |
| marketingCarrierDesignator             | Marketing carrier designator             | <ul><li>AC</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| frequentFlyerAirlineDesignator         | Frequent Flyer Airline Designator        | <ul><li>AC</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| frequentFlyerNumber                    | Frequent Flyer Number                    | <ul><li>1234567890123</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| idIndicator                            | ID/AD Indicator                          | <ul><li>0</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| freeBaggageAllowance                   | Free Baggage Allowance                   | <ul><li>20K</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| fastTrack                              | Fast Track                               | <ul><li>Y</li><li>N</li><li>true</li><li>false</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| airlineInfo                            | For individual airline use               | <ul><li>LX58Z</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

#### Demo

```js
let output = encode({
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
    },
  ],
});

console.log(output); // M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 106>60000
```

### .decode(`string`)

Converts a BCBP string to an object. The returned object uses the same keys as .encode() (see the above tables).

#### Demo

```js
let output = decode(
  "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 106>60000"
);

console.log(output);
/*
{
	passengerName: 'DESMARAIS/LUC',
	legs: [
		{
			operatingCarrierPNR: 'ABC123',
			departureAirport: 'YUL',
			arrivalAirport: 'FRA',
			operatingCarrierDesignator: 'AC',
			flightNumber: '0834',
			flightDate: '2018-08-14T00:00:00.000Z',
			compartmentCode: 'F',
			seatNumber: '001A',
			checkInSequenceNumber: '0025',
			passengerStatus: '1'
		}
	],
}
*/
```

## License

MIT
