import { toUpperCase } from "../app/Utils";

describe("Unit test suite", () => {
  it("should return uppercase of valid string", () => {
    // arrage:
    const sut = toUpperCase;
    const expected = "ABC";

    // act:
    const actual = sut("abc");

    // assert:
    expect(actual).toBe(expected);

    // const result = toUpperCase("abc");
    // expect(result).toBe("ABC");
  });
});
