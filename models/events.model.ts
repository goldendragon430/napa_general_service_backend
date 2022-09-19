import { db } from "../index";
import { EventsInterface } from "interfaces/events.interface";
import { v4 as uuidv4 } from "uuid";

class Events {
  events: EventsInterface;
  constructor(events: EventsInterface) {
    this.events = events;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS events (eventId VARCHAR(45) NOT NULL PRIMARY KEY, eventTitle TEXT NOT NULL, eventDate TEXT NOT NULL, status ENUM('0', '1', '2', '3', '4', '5') NOT NULL DEFAULT '0', eventImageBanner TEXT NOT NULL, eventImagePlaque TEXT NOT NULL, eventImageOne TEXT NOT NULL, eventImageTwo TEXT NOT NULL, eventImageThree TEXT NOT NULL, eventDetailsShortDescription TEXT NOT NULL, eventDetailsLongDescription TEXT NOT NULL, partnerUUID VARCHAR(45) NOT NULL, likes INT NOT NULL, location TEXT NOT NULL, tags TEXT NOT NULL, napaPerks TEXT NOT NULL, eventRules TEXT NOT NULL, entryFees TEXT NOT NULL, sponsors TEXT NOT NULL, paid TEXT NOT NULL, amount DECIMAL(19,2) NOT NULL, txid TEXT NOT NULL, createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), FOREIGN KEY (partnerUUID) REFERENCES partners (partnerUUID))";

      await db.execute(tableQuery);

      const uuid = uuidv4();

      const insertQuery = `INSERT INTO events (eventId, eventTitle, eventDate, status, eventImageBanner, eventImagePlaque, eventImageOne, eventImageTwo, eventImageThree, eventDetailsShortDescription, eventDetailsLongDescription, partnerUUID, likes, location, tags, napaPerks, eventRules, entryFees, sponsors, paid, amount, txid) VALUES ("${uuid}", "${
        this.events.eventTitle
      }", "${this.events.eventDate}", "${this.events.status || 0}", "${
        this.events.eventImageBanner || ""
      }", "${this.events.eventImagePlaque || ""}", "${
        this.events.eventImageOne || ""
      }", "${this.events.eventImageTwo || ""}", "${
        this.events.eventImageThree || ""
      }", "${this.events.eventDetailsShortDescription || ""}", "${
        this.events.eventDetailsLongDescription || ""
      }", "${this.events.partnerUUID || ""}", "${this.events.likes || 0}", "${
        this.events.location || ""
      }", "${this.events.tags || ""}", "${this.events.napaPerks || ""}", "${
        this.events.eventRules || ""
      }", "${this.events.entryFees || ""}", "${this.events.sponsors || ""}", "${
        this.events.paid || ""
      }", "${this.events.amount || ""}", "${this.events.txid || ""}")`;

      await db.execute(insertQuery);

      const sql = `SELECT * FROM events WHERE eventId = "${uuid}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(eventId: string, status: string) {
    try {
      const updateSql = `UPDATE events SET status = "${status}" updatedAt = CURRENT_TIMESTAMP WHERE eventId = "${eventId}"`;

      await db.execute(updateSql);

      const sql = `SELECT * FROM events WHERE eventId = "${eventId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getAllEvents(status) {
    try {
      if (Array.isArray(status)) {
        const modifiedEventIds = JSON.stringify(status)
          .replace("[", "(")
          .replace("]", ")");

        const sql = `SELECT * FROM events WHERE eventId IN ${modifiedEventIds}`;

        return db.execute(sql);
      }
      const sql = `SELECT * FROM events WHERE status = "${status}" OR eventId = "${status}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Events;
