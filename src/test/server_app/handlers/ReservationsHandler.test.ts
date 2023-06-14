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

  describe("GET requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.GET;
    });

    it("should return all reservatios for all request", async () => {
      request.url = "/reservations/all";
      reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([
        someReservation,
      ]);

      await sut.handleRequest();

      expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify([someReservation])
      );
    });

    it("should return reservation for existing id", async () => {
      request.url = `/reservations/${someReservationId}`;
      reservationsDataAccessMock.getReservation.mockRejectedValueOnce(
        someReservation
      );

      await sut.handleRequest();

      expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify(someReservation)
      );
    });

    it("should return bad request if no id provided", async () => {
      request.url = "/reservations";

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide an ID!")
      );
    });
  });

  describe("PUT requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.PUT;
    });

    it("should return not found for non existing id", async () => {
      request.url = `/reservations/${someReservationId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        undefined
      );

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify(`Reservation with id ${someReservationId} not found`)
      );
    });

    it("should return bad request if no id provided", async () => {
      request.url = `/reservations`;

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide an ID!")
      );
    });

    it("should return bad request if invalid fields are provided", async () => {
      request.url = `/reservations/${someReservationId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );
      getRequestBodyMock.mockResolvedValueOnce({
        startDate1: "someDate",
      });

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide valid fields to update!")
      );
    });

    it("should return bad request if no fileds are provided", async () => {
      request.url = `/reservations/${someReservationId}`;
      reservationsDataAccessMock.getReservation.mockRejectedValueOnce(
        someReservation
      );
      getRequestBodyMock.mockResolvedValueOnce({});

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide valid fields to update!")
      );
    });

    it("should update reservation with all valid fileds provided", async () => {
      request.url = `/reservations/${someReservationId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );

      const updateObject = {
        startDate: "someDate1",
        endDate: "someDate2",
      };

      getRequestBodyMock.mockResolvedValueOnce(updateObject);

      await sut.handleRequest();

      expect(reservationsDataAccessMock.updateReservation).toBeCalledTimes(2);
      expect(reservationsDataAccessMock.updateReservation).toBeCalledWith(
        someReservationId,
        "startDate",
        updateObject.startDate
      );
      expect(reservationsDataAccessMock.updateReservation).toBeCalledWith(
        someReservationId,
        "endDate",
        updateObject.endDate
      );
      expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify(
          `Updated ${Object.keys(
            updateObject
          )} of reservation ${someReservationId}`
        )
      );
    });
  });
});
