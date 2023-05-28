import { StringUtils, getStringInfo, toUpperCase } from "../app/Utils";

describe("Unit test suite", () => {
  describe.only("StringUtils tests", () => {
    let sut: StringUtils;

    beforeEach(() => {
      sut = new StringUtils();
      console.log("Setup");
    });

    afterEach(() => {
      console.log("Teardown");
    });

    it("Should return correct uppercase", () => {
      const actual = sut.toUppperCase("abc");

      expect(actual).toBe("ABC");
    });

    it.todo("test for todo");
    it.skip("test for skip1", () => {
      console.log("test for skip1");
    });
    xit("test for skip2", () => {
      console.log("test for skip2");
    });

    it("Should throw error on invalid argument - function", () => {
      function expectError() {
        const actual = sut.toUppperCase("");
      }

      expect(expectError).toThrow();
      expect(expectError).toThrowError("Invalid argument!");
    });

    it("Should throw error on invalid argument - arrow function", () => {
      expect(() => {
        sut.toUppperCase("");
      }).toThrowError("Invalid argument!");
    });

    it("Should throw error on invalid argument - try catch arrow function", (done) => {
      try {
        sut.toUppperCase("");
        done("GetStringInfo should throw error for invalid arg!");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty("message", "Invalid argument!");
        done();
      }
    });
  });

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

  describe("ToUpperCase examples", () => {
    it.each([
      { input: "abc", expected: "ABC" },
      { input: "My-String", expected: "MY-STRING" },
      { input: "def", expected: "DEF" },
    ])("$input toUpperCase should be $expected", ({ input, expected }) => {
      const actual = toUpperCase(input);
      expect(actual).toBe(expected);
    });
  });

  describe("getStringInfo for ary My-String should", () => {
    test("return right length", () => {
      const actual = getStringInfo("My-String");
      expect(actual.characters).toHaveLength(9);
      expect(actual.characters.length).toBe(9);
    });
    test("return right lower case", () => {
      const actual = getStringInfo("My-String");
      expect(actual.lowerCase).toBe("my-string");
    });
    test("return right upper case", () => {
      const actual = getStringInfo("My-String");
      expect(actual.upperCase).toBe("MY-STRING");
    });
    test("return right characters", () => {
      const actual = getStringInfo("My-String");
      expect(actual.characters).toEqual([
        "M",
        "y",
        "-",
        "S",
        "t",
        "r",
        "i",
        "n",
        "g",
      ]);
      expect(actual.characters).toContain<string>("M");
      expect(actual.characters).toEqual(
        expect.arrayContaining(["S", "t", "r", "i", "n", "g", "M", "y", "-"])
      );
    });
    test("return defined extra info", () => {
      const actual = getStringInfo("My-String");
      expect(actual.extraInfo).toBeDefined();
    });
    test("return right extra info", () => {
      const actual = getStringInfo("My-String");
      expect(actual.extraInfo).toEqual({});
    });
  });
});
