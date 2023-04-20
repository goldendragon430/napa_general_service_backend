/* eslint-disable @typescript-eslint/no-var-requires */
import { UserInterface } from "../interfaces/user.interfaces";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
const { db, socialArtDb, stakingDB } = require("../index");

class User {
  user: UserInterface;
  constructor(user: UserInterface) {
    this.user = user;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS users (profileId VARCHAR(45) NOT NULL PRIMARY KEY, accountNumber VARCHAR(255), napaWalletAccount VARCHAR(255), binanceWalletAccount VARCHAR(255), emailAddress VARCHAR(255), profileName VARCHAR(100) NOT NULL, bio VARCHAR(512) NULL, timezone VARCHAR(255) NULL, primaryCurrency  ENUM('NAPA','BNB','ETH') DEFAULT 'NAPA', language VARCHAR(255) DEFAULT 'English', napaSocialMediaAccount text NULL, createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), avatar LONGTEXT, UNIQUE(accountNumber), awardsEarned INT, awardsGiven INT, netAwardsAvailable INT, dailyActive VARCHAR(45) NOT NULL, monthlyActive VARCHAR(45) NOT NULL)";

      await db.execute(tableQuery);
      await socialArtDb.execute(tableQuery);
      await stakingDB.execute(tableQuery);
      const uuid = uuidv4();

      const insertQuery = `INSERT INTO users (profileId, accountNumber, napaWalletAccount, binanceWalletAccount, emailAddress, profileName, bio, timezone, primaryCurrency, language, napaSocialMediaAccount, avatar, dailyActive, monthlyActive) VALUES ("${uuid}", "${
        this.user.accountNumber || ""
      }", "${this.user.napaWalletAccount || ""}", "${
        this.user.binanceWalletAccount || ""
      }", "${this.user.emailAddress || ""}", "${this.user.profileName}", "${
        this.user.bio || ""
      }", "${this.user.timezone || ""}", "${
        this.user.primaryCurrency || "NAPA"
      }", "${this.user.language || "English"}", "${
        this.user.napaSocialMediaAccount || ""
      }", "${this.user.avatar || ""}", "false", "false")`;

      await db.execute(insertQuery);
      await socialArtDb.execute(insertQuery);
      await stakingDB.execute(insertQuery)

      const DAUsql = `SELECT profileId FROM users WHERE dailyActive = "true"`;
      const [DAU] = await socialArtDb.query(DAUsql);

      // @ts-ignore
      let rewardsTierCap = DAU.length * 0.0005;
      let category_1, category_2, category_3, category_4, category_5;

      const payoutUuid = uuidv4();

      await Promise.all(
        Array.from({ length: 5 }).map(async (_, index) => {
          rewardsTierCap =
            index == 0 ? rewardsTierCap : rewardsTierCap * 0.2 + rewardsTierCap;
          if (index == 0) {
            category_1 = rewardsTierCap;
            return;
          } else if (index == 1) {
            category_2 = rewardsTierCap;
            return;
          } else if (index == 2) {
            category_3 = rewardsTierCap;
            return;
          } else if (index == 3) {
            category_4 = rewardsTierCap;
            return;
          } else if (index == 4) {
            category_5 = rewardsTierCap;
            return;
          }
        })
      );

      const insertPayoutsTrackingQuery = `INSERT INTO payouts_tracking (updateUUID, category_1, category_2, category_3, category_4, category_5, tokenPrice, createdAt, updatedAt) VALUES (
        "${payoutUuid}",
        "${(category_1 / 10).toFixed(8)}",
        "${(category_2 / 10).toFixed(8)}",
        "${(category_3 / 10).toFixed(8)}",
        "${(category_4 / 10).toFixed(8)}",
        "${(category_5 / 10).toFixed(8)}",
        "${this.user.tokenPrice || ""}",
        "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}",
        "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}"
        )`;
      await socialArtDb.execute(insertPayoutsTrackingQuery);

      const sql = `SELECT * FROM users WHERE profileId = "${uuid}" OR accountNumber = "${this.user.accountNumber}" OR napaWalletAccount = "${this.user.napaWalletAccount}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getUserProfileDetails(id: string) {
    try {
      const sql = `SELECT * FROM users WHERE profileId = "${id}" OR accountNumber = "${id}" OR napaWalletAccount = "${id}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string) {
    try {
      const updateSql = `UPDATE users SET accountNumber = "${
        this.user.accountNumber || ""
      }", napaWalletAccount = "${
        this.user.napaWalletAccount || ""
      }", binanceWalletAccount = "${
        this.user.binanceWalletAccount || ""
      }", emailAddress = "${this.user.emailAddress || ""}", profileName = "${
        this.user.profileName
      }", bio = "${this.user.bio || ""}", timezone = "${
        this.user.timezone || ""
      }", primaryCurrency = "${
        this.user.primaryCurrency || "NAPA"
      }", language = "${
        this.user.language || "English"
      }", napaSocialMediaAccount = "${
        this.user.napaSocialMediaAccount || ""
      }", avatar = "${
        this.user.avatar || ""
      }", updatedAt = CURRENT_TIMESTAMP WHERE profileId = "${id}" OR accountNumber = "${id}" OR napaWalletAccount = "${id}"`;

      await db.execute(updateSql);
      await socialArtDb.execute(updateSql);
      await stakingDB.execute(updateSql);

      const sql = `SELECT * FROM users WHERE profileId = "${id}" OR accountNumber = "${id}" OR napaWalletAccount = "${id}"`;

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
