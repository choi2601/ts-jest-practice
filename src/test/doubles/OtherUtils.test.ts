import {
  calculateComplexity,
  toUpperCaseWithCallback,
} from "../../app/doubles/OtherUtils";

describe("OtherUtils test suite", () => {
  describe("Tracking callbacks with Jest mocks", () => {
    const callbackMock = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCallback("", callbackMock);
      expect(actual).toBeUndefined();
      expect(callbackMock).toBeCalledWith("Invalid argument!");
      expect(callbackMock).toBeCalledTimes(1);
    });

    it("calls callback for valid argument - track calls", () => {
      const actaul = toUpperCaseWithCallback("abc", callbackMock);
      expect(actaul).toBe("ABC");
      expect(callbackMock).toBeCalledWith("called function with abc");
      expect(callbackMock).toBeCalledTimes(1);
    });
  });

  describe("Traking callbacks", () => {
    let cbArgs = [];
    let timesCalled = 0;

    function callBackMock(arg: string) {
      cbArgs.push(arg);
      timesCalled++;
    }

    afterEach(() => {
      // clearing tracking fileds
      cbArgs = [];
      timesCalled = 0;
    });

    it("calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCallback("", callBackMock);
      expect(actual).toBeUndefined();
      expect(cbArgs).toContain("Invalid argument!");
      expect(timesCalled).toBe(1);
    });

    it("calls callback for balid argument - track calls", () => {
      const actual = toUpperCaseWithCallback("abc", callBackMock);
      expect(actual).toBe("ABC");
      expect(cbArgs).toContain("called function with abc");
      expect(timesCalled).toBe(1);
    });
  });

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
