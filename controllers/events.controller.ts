/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response } from "express";
import Events from "../models/events.model";
const ApiResponse = require("../utils/api-response");

const createEvents = async (req: Request, res: Response) => {
  try {
    console.log("Create Events Api Pending");

    const { events } = req.body;

    const newEvents = new Events(events);

    const [eventsData] = await newEvents.create();

    if (!["0", "1", "2", "3", "4", "5"].includes(events.status)) {
      return ApiResponse.validationErrorWithData(
        res,
        "Please enter valid event status"
      );
    }

    // if (["0", "1", "2", "3", "4", "5"].includes(events.status)) {
    //   // @ts-ignore
    //   global.SocketService.handleGetEvents({
    //     events: eventsData[0],
    //   });
    // }

    console.log("Create Events Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Events Created Successfully",
      eventsData[0]
    );
  } catch (error) {
    console.error(error);
    console.log("Create Events Api Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to create events");
  }
};

const updateEvents = async (req: Request, res: Response) => {
  try {
    console.log("Update Events Api Pending");

    const { eventId } = req.params;

    const { status } = req.body;

    const newEvents = new Events(status);

    const [eventsData] = await newEvents.update(status, eventId);

    // @ts-ignore
    if (!eventsData.length) {
      return ApiResponse.validationErrorWithData(res, "Events Data Not Found");
    }

    if (["0", "1", "2", "3", "4", "5"].includes(status)) {
      // @ts-ignore
      global.SocketService.handleGetEvents({
        events: eventsData[0],
      });
    }

    console.log("Update Events Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Events Updated Successfully",
      eventsData[0]
    );
  } catch (error) {
    console.log("Update Events Api Rejected");
    console.error(error);
    return ApiResponse.ErrorResponse(res, "Unable to update events");
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  try {
    console.log("Get Events Api Pending");

    const { status, eventId } = req.query;

    let eventIds = [];
    if (eventId) {
      eventIds = eventId
        // @ts-ignore
        .replace(/['"]+/g, "")
        .split(";")
        .map((item) => {
          return item.trim();
        });
    }

    let statusValue;
    if (status) {
      // @ts-ignore
      statusValue = status.replace(/['"]+/g, "");
      if (!["0", "1", "2", "3", "4", "5"].includes(statusValue)) {
        return ApiResponse.validationErrorWithData(
          res,
          "Please enter valid event status"
        );
      }
    }

    const [events] = await Events.getAllEvents(statusValue || eventIds);

    // @ts-ignore
    if (eventIds.length && !events.length) {
      return ApiResponse.validationErrorWithData(res, "Events Data Not Found");
    }

    console.log("Get Events Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Events Successfully",
      // @ts-ignore
      events.length ? events : null
    );
  } catch (error) {
    console.log(error);
    console.log("Get Events Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to fetch events");
  }
};

module.exports = { createEvents, updateEvents, getAllEvents };
