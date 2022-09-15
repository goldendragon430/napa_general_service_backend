/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
const EventsController = require("../controllers/events.controller");
const router = express.Router();

router.post("/events/new", EventsController.createEvents);
router.get("/events/list", EventsController.getAllEvents);
router.patch("/events/update/:eventId", EventsController.updateEvents);

module.exports = { router };
