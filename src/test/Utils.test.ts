import { toUpperCase } from "../app/Utils";

describe("Unit test suite", () => {
  test("should return uppercase", () => {
    const result = toUpperCase("abc");
    expect(result).toBe("ABC");
  });
});
