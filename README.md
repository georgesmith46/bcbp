![Build](https://img.shields.io/github/workflow/status/georgesmith46/bcbp/Release?style=for-the-badge)
![License](https://img.shields.io/github/license/georgesmith46/bcbp?style=for-the-badge)
![Bundlephobia](https://img.shields.io/bundlephobia/minzip/bcbp?style=for-the-badge)
![Version](https://img.shields.io/npm/v/bcbp?style=for-the-badge)

# BCBP

Encoding/decoding library for the IATA Bar Coded Boarding Pass

- Supports version 6 of the BCBP standard
- Supports any number of legs

## Getting started

### Installation

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install bcbp
```

## Encode

```ts
encode(bcbp: BarcodedBoardingPass) => string
```

### Example

```js
import { encode } from "bcbp";

let output = encode({
  data: {
    legs: [
      {
        operatingCarrierPNR: "ABC123",
        departureAirport: "YUL",
        arrivalAirport: "FRA",
        operatingCarrierDesignator: "AC",
        flightNumber: "0834",
        flightDate: new Date("2020-08-13T00:00:00.000Z"),
        compartmentCode: "F",
        seatNumber: "001A",
        checkInSequenceNumber: "0025",
        passengerStatus: "1",
      },
    ],
    passengerName: "DESMARAIS/LUC",
  }
});

console.log(output);
// M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 100
```

## Decode

```ts
decode(bcbp: string, referenceYear?: number) => BarcodedBoardingPass
```

### Example

```js
import { decode } from "bcbp";

let output = decode(
  "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 100"
);

console.log(output.data.passengerName);
// DESMARAIS/LUC
```

### Reference Year

Define the year which is used when parsing date fields. If this is undefined, the current year is used.

```js
import { decode } from "bcbp";

let output = decode(
  "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 100",
  2010
);

console.log(output.data.legs[0].flightDate.toISOString());
// "2010-08-14T00:00:00.000Z"
```

# BarcodedBoardingPass

See [types.ts](src/types.ts) for the definition.

## License

MIT
