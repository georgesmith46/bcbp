import { encode, decode } from "../dist/index.esm.js";

describe("smoke test", () => {
  const expected =
    "M1DESMARAIS/LUC       EABC123 YULFRAAC 0834 226F001A0025 106>60000";
  it(`should output ${expected}`, () => {
    expect(encode(decode(expected))).toEqual(expected);
  });
});
