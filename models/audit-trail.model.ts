import { db } from "../index";
import { v4 as uuidv4 } from "uuid";
import { AuditTrailInterface } from "../interfaces/audit-trial.interface";

class AuditTrail {
  auditTrail: AuditTrailInterface;
  constructor(auditTrail: AuditTrailInterface) {
    this.auditTrail = auditTrail;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS audit_trails (recordID VARCHAR(45) PRIMARY KEY NOT NULL, recordType VARCHAR(45), createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(), partnerUUID VARCHAR(45), profileId VARCHAR(45), eventId VARCHAR(45), whitelistId VARCHAR(45), fieldsUpdated TEXT NOT NULL)";

      await db.execute(tableQuery);

      const uuid = uuidv4();

      const insertQuery = `INSERT INTO audit_trails (recordID, recordType, partnerUUID, profileId, eventId, whitelistId, fieldsUpdated) VALUES ("${uuid}", "${
        this.auditTrail.recordType
      }", "${this.auditTrail.partnerUUID || ""}", "${
        this.auditTrail.profileId || ""
      }", "${this.auditTrail.eventId || ""}", "${
        this.auditTrail.whitelistId || ""
      }", "${this.auditTrail.fieldsUpdated}")`;

      await db.execute(insertQuery);

      const sql = `SELECT * FROM audit_trails WHERE recordID = "${uuid}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getAllAuditTrials(type: string) {
    try {
      const sql = `SELECT * FROM audit_trails WHERE recordType = ${type} OR partnerUUID = ${type} OR profileId = ${type} OR eventId = ${type} OR whitelistId = ${type}`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default AuditTrail;
