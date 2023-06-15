/* eslint-disable @typescript-eslint/no-var-requires */
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
const { db } = require("../index");

class ArchievedAccounts {
  static async add(profileId, address, name, privateKey) {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS archived_accounts (rowId INTEGER AUTO_INCREMENT NOT NULL UNIQUE KEY, id VARCHAR(45), profileId VARCHAR(45), address VARCHAR(45), name VARCHAR(45), privateKey VARCHAR(255), createdAt TEXT, updatedAt TEXT)";

      await db.execute(tableQuery);
      const uuid = uuidv4();

      const insertQuery = `INSERT INTO archived_accounts (id, profileId, address, name, privateKey, createdAt, updatedAt) VALUES (
        "${uuid}", 
        "${profileId || ""}", 
        "${address || ""}", 
        "${name || ""}", 
        "${privateKey || ""}", 
        "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}",
        "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}"
      )`;

      await db.execute(insertQuery);

      const sql = `SELECT * FROM archived_accounts WHERE id = "${uuid}" ORDER BY createdAt DESC`;
      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default ArchievedAccounts;
