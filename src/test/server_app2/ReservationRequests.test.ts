import { DataBase } from "../../app/server_app/data/DataBase";
import { Reservation } from "../../app/server_app/model/ReservationModel";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./test_utils/RequestTestWrapper";
import { ResponseTestWrapper } from "./test_utils/ResponseTestWrapper";

jest.mock("../../app/server_app/data/DataBase");

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
  listen: () => {},
  close: () => {},
};

jest.mock("http", () => ({
  createServer: (cb: any) => {
    cb(requestWrapper, responseWrapper);
    return fakeServer;
  },
}));

const someReservation: Reservation = {
  id: "",
  endDate: "someEndDate",
  startDate: "someStartDate",
  room: "someRoom",
  user: "someUser",
};

const someId = "1234";

const jsonHeader = { "Content-Type": "application/json" };

describe("Reservation requests", () => {
  const insertSpy = jest.spyOn(DataBase.prototype, "insert");
  const getBySpy = jest.spyOn(DataBase.prototype, "getBy");
  const getAllElementsSpy = jest.spyOn(DataBase.prototype, "getAllElements");
  const updateSpy = jest.spyOn(DataBase.prototype, "update");
  const deleteSpy = jest.spyOn(DataBase.prototype, "delete");

  beforeEach(() => {
    requestWrapper.headers["user-agent"] = "jest tests";
    requestWrapper.headers["authorization"] = "someToken";

    // authenticate calls
    getBySpy.mockResolvedValueOnce({
      valid: true,
    });
  });

  afterEach(() => {
    requestWrapper.clearFileds();
    responseWrapper.clearFields();
    jest.clearAllMocks();
  });
});
