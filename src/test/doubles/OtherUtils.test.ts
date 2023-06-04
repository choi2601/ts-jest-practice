import {
  calculateComplexity,
  toUpperCaseWithCallback,
} from "../../app/doubles/OtherUtils";

describe("OtherUtils test suite", () => {
  it("ToUpperCase - calls callback for invalid argument", () => {
    const actual = toUpperCaseWithCallback("", () => {});
    expect(actual).toBeUndefined();
  });

  it("ToUpperCase - calss callback for valid argument", () => {
    const actual = toUpperCaseWithCallback("abc", () => {});
    expect(actual).toBe("ABC");
  });

  it("Calculates complexity", () => {
    const someInfo = {
      length: 5,
      extraInfo: {
        filed1: "someInfo",
        filed2: "someOtherInfo",
      },
    };

    const actual = calculateComplexity(someInfo as any);
    expect(actual).toBe(10);
  });
});
