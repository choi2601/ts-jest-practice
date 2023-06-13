import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { Reservation } from "../../../app/server_app/model/ReservationModel";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils.ts", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("ReservationsHandler test suite", () => {
  let sut: ReservationsHandler;

  const request = {
    method: undefined,
    headers: {
      authorization: undefined,
    },
    url: undefined,
  };

  const responseMock = {
    writeHead: jest.fn(),
    write: jest.fn(),
    statusCode: 0,
  };

  const authorizerMock = {
    registerUser: jest.fn(),
    validateToken: jest.fn(),
  };

  const reservationsDataAccessMock = {
    createReservation: jest.fn(),
    getAllReservations: jest.fn(),
    getReservation: jest.fn(),
    updateReservation: jest.fn(),
    deleteReservation: jest.fn(),
  };

  const someReservation: Reservation = {
    id: undefined,
    endDate: new Date().toDateString(),
    startDate: new Date().toDateString(),
    room: "someRoom",
    user: "someUser",
  };

  const someReservationId = "1234";

  beforeEach(() => {
    sut = new ReservationsHandler(
      request as IncomingMessage,
      responseMock as unknown as ServerResponse,
      authorizerMock as unknown as Authorizer,
      reservationsDataAccessMock as unknown as ReservationsDataAccess
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.POST;
    });

    it("should create reservation from valid request", async () => {
      getRequestBodyMock.mockResolvedValueOnce(someReservation);
      reservationsDataAccessMock.createReservation.mockResolvedValueOnce(
        someReservationId
      );

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
      expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify({ reservationId: someReservationId })
      );
    });

    it("should not create reservation from invalid request", async () => {
      getRequestBodyMock.mockResolvedValueOnce({});

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Incomplete reservation!")
      );
    });

    it("should not create reservation from invalid fields in request", async () => {
      const moreThanAReservation = { ...someReservation, someFiled: "123" };
      getRequestBodyMock.mockResolvedValueOnce(moreThanAReservation);

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Incomplete reservation!")
      );
    });
  });
});
