/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response } from "express";
import Events from "../models/events.model";
const ApiResponse = require("../utils/api-response");

const createEvents = async (req: Request, res: Response) => {
  try {
    console.log("Create Events Api Pending");

    const { events } = req.body;

    const newEvents = new Events(events);

    if (!events.eventDate) {
      console.error("Event Date field is required");
      return ApiResponse.validationErrorWithData(
        res,
        "Event Date field is required"
      );
    }

    const [eventsData] = await newEvents.create();

    if (events.status === "1") {
      // @ts-ignore
      global.SocketService.handleGetEvents({
        events: eventsData[0],
      });
    }

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

    if (status === "1") {
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
    }

    const [events] = await Events.getAllEvents(statusValue || eventIds);

    console.log("Get Events Api Fullfilled");

    return ApiResponse.successResponseWithData(
      res,
      "Get Events Successfully",
      events
    );
  } catch (error) {
    console.log(error);
    console.log("Get Events Rejected");
    return ApiResponse.ErrorResponse(res, "Unable to fetch events");
  }
};

module.exports = { createEvents, updateEvents, getAllEvents };
