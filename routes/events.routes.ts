/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import { eventsValidationRule } from "../utils/validation-rules";
const EventsController = require("../controllers/events.controller");
const router = express.Router();
const { typeValidation } = require("../middleware/validation.middleware");

router.post(
  "/events/new",
  typeValidation(eventsValidationRule),
  EventsController.createEvents
);
router.get("/events/list", EventsController.getAllEvents);
router.patch("/events/update/:eventId", EventsController.updateEvents);
router.patch("/events/updateEvent/:eventId", EventsController.updateEvent);

module.exports = { router };
