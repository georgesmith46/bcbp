import encode from "./encode";
import decode from "./decode";

describe("encode/decode", () => {
  describe("basic", () => {
    const expected =
      "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 106>60000";
    it(`should output ${expected}`, () => {
      expect(encode(decode(expected))).toEqual(expected);
    });
  });
  describe("random", () => {
    const expected =
      "M1DESMARAIS/LUC       EABC123    FRAAC      226F001A      3B>60B1W 6225BAC 2A   1234567890 1AC AC 1234567890123    20KY^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE";
    it(`should output ${expected}`, () => {
      expect(encode(decode(expected))).toEqual(expected);
    });
  });
  describe("full", () => {
    const expected =
      "M2DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 14D>6181WW6225BAC 00141234560032A0141234567890 1AC AC 1234567890123    20KYLX58ZDEF456 FRAGVALH 3664 227C012C0002 12E2A0140987654321 1AC AC 1234567890123    2PCNWQ^164GIWVC5EH7JNT684FVNJ91W2QA4DVN5J8K4F0L0GEQ3DF5TGBN8709HKT5D3DW3GBHFCVHMY7J5T6HFR41W2QA4DVN5J8K4F0L0GE";
    it(`should output ${expected}`, () => {
      expect(encode(decode(expected))).toEqual(expected);
    });
  });
});
