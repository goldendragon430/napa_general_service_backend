import { db } from "../index";
import { WhitelistInterface } from "interfaces/whitelist.interface";
import { v4 as uuidv4 } from "uuid";

class Whitelist {
  whitelist: WhitelistInterface;
  constructor(whitelist: WhitelistInterface) {
    this.whitelist = whitelist;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS whitelist (whitelistId VARCHAR(45) NOT NULL PRIMARY KEY, name VARCHAR(100) NOT NULL, address VARCHAR(100) NOT NULL, status ENUM('0','1','2') DEFAULT '1', currency ENUM('NAPA','USDT','ETH') DEFAULT 'NAPA', createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), profileId VARCHAR(45) NOT NULL, UNIQUE(address), FOREIGN KEY (profileId) REFERENCES users (profileId))";

      await db.execute(tableQuery);

      const uuid = uuidv4();

      const insertQuery = `INSERT INTO whitelist (whitelistId, name, address, status, currency, profileId) VALUES ("${uuid}", "${
        this.whitelist.name
      }", "${this.whitelist.address}", "${this.whitelist.status}", "${
        this.whitelist.currency || "NAPA"
      }", "${this.whitelist.profileId}")`;

      await db.execute(insertQuery);

      const sql = `SELECT * FROM whitelist WHERE whitelistId = "${uuid}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(whitelistId: string) {
    try {
      const updateSql = `UPDATE whitelist SET name = "${this.whitelist.name}", address = "${this.whitelist.address}", status = "${this.whitelist.status}", currency = "${this.whitelist.currency}", profileId = "${this.whitelist.profileId}" WHERE whitelistId = "${whitelistId}"`;

      await db.execute(updateSql);

      const sql = `SELECT * FROM whitelist WHERE whitelistId = "${whitelistId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static findAll(status: string) {
    try {
      const sql = `SELECT * FROM whitelist WHERE status = "${status}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Whitelist;
