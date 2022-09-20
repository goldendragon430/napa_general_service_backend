import { db } from "../index";
import { LeadersInterface } from "interfaces/leaders.interface";
import { v4 as uuidv4 } from "uuid";

class Leaders {
  leaders: LeadersInterface;
  constructor(leaders: LeadersInterface) {
    this.leaders = leaders;
  }

  async create() {
    const tableQuery =
      "CREATE TABLE IF NOT EXISTS leaders (leaderId VARCHAR(45) NOT NULL PRIMARY KEY, napaSocialMediaAccountId VARCHAR(255) NOT NULL, profileName TEXT NOT NULL, leaderType ENUM('1', '2', '3', '4') NOT NULL DEFAULT '1', number INT NOT NULL, ranked INT NOT NULL, createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), UNIQUE(napaSocialMediaAccountId))";

    await db.execute(tableQuery);

    const uuid = uuidv4();

    const insertQuery = `INSERT INTO leaders (leaderId, napaSocialMediaAccountId, profileName, leaderType, number, ranked) VALUES ("${uuid}", "${
      this.leaders.napaSocialMediaAccountId || ""
    }", "${this.leaders.profileName || ""}", "${
      this.leaders.leaderType || 1
    }", "${this.leaders.numbers}", "${this.leaders.rank}")`;

    await db.execute(insertQuery);

    const sql = `SELECT * FROM leaders WHERE leaderId = "${uuid}"`;

    return db.execute(sql);
  }

  static getLeadersAll(type: string) {
    const sql = `SELECT * FROM leaders WHERE leaderType = "${type}"`;

    return db.execute(sql);
  }
}

export default Leaders;
