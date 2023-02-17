/* eslint-disable @typescript-eslint/no-var-requires */
import { UserInterface } from "../interfaces/user.interfaces";
import { v4 as uuidv4 } from "uuid";
const { db, socialArtDb } = require("../index");

class User {
  user: UserInterface;
  constructor(user: UserInterface) {
    this.user = user;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS users (profileId VARCHAR(45) NOT NULL PRIMARY KEY, accountNumber VARCHAR(255) NOT NULL, profileName VARCHAR(100) NOT NULL, bio VARCHAR(512) NULL, timezone VARCHAR(255) NULL, primaryCurrency  ENUM('NAPA','BNB','ETH') DEFAULT 'NAPA', language VARCHAR(255) DEFAULT 'English', napaSocialMediaAccount text NULL, createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), avatar LONGTEXT, UNIQUE(accountNumber), awardsEarned INT, awardsGiven INT, netAwardsAvailable INT, dailyActive NOT NULL DEFAULT 'false', monthlyActive NOT NULL DEFAULT 'false')";

      await db.execute(tableQuery);
      await socialArtDb.execute(tableQuery);
      const uuid = uuidv4();

      const insertQuery = `INSERT INTO users (profileId, accountNumber, profileName, bio, timezone, primaryCurrency, language, napaSocialMediaAccount, avatar, dailyActive, monthlyActive) VALUES ("${uuid}", "${
        this.user.accountNumber
      }", "${this.user.profileName}", "${this.user.bio || ""}", "${
        this.user.timezone || ""
      }", "${this.user.primaryCurrency || "NAPA"}", "${
        this.user.language || "English"
      }", "${this.user.napaSocialMediaAccount}", "${this.user.avatar || ""}", "false", "false")`;

      await db.execute(insertQuery);
      await socialArtDb.execute(insertQuery);
      
      const sql = `SELECT * FROM users WHERE profileId = "${uuid}" OR accountNumber = "${this.user.accountNumber}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getUserProfileDetails(id: string) {
    try {
      const sql = `SELECT * FROM users WHERE profileId = "${id}" OR accountNumber = "${id}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string) {
    try {
      const updateSql = `UPDATE users SET accountNumber = "${
        this.user.accountNumber
      }", profileName = "${this.user.profileName}", bio = "${
        this.user.bio || ""
      }", timezone = "${this.user.timezone || ""}", primaryCurrency = "${
        this.user.primaryCurrency || "NAPA"
      }", language = "${
        this.user.language || "English"
      }", napaSocialMediaAccount = "${
        this.user.napaSocialMediaAccount || ""
      }", avatar = "${
        this.user.avatar || ""
      }", updatedAt = CURRENT_TIMESTAMP WHERE profileId = "${id}" OR accountNumber = "${id}"`;

      await db.execute(updateSql);
      await socialArtDb.execute(updateSql);

      const sql = `SELECT * FROM users WHERE profileId = "${id}" OR accountNumber = "${id}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getAllUsers() {
    try {
      const sql = `SELECT profileId FROM users ORDER BY createdAt DESC`;
      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default User;
