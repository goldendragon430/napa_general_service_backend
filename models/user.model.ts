/* eslint-disable @typescript-eslint/no-var-requires */
import { UserInterface } from "../interfaces/user.interfaces";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { decryptString, encryptString } from "../utils/encryption";
const { db, socialArtDb, stakingDB } = require("../index");

class User {
  user: UserInterface;
  constructor(user: UserInterface) {
    this.user = user;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS users (rowId INTEGER AUTO_INCREMENT NOT NULL UNIQUE KEY, profileId VARCHAR(45) NOT NULL PRIMARY KEY, biometricPublickey VARCHAR(255), metamaskAccountNumber VARCHAR(255), napaWalletAccount VARCHAR(255), binanceWalletAccount VARCHAR(255), emailAddress VARCHAR(255) NOT NULL, accountStatus ENUM('1', '2', '3') NOT NULL DEFAULT '1', profileName VARCHAR(100) NOT NULL, bio VARCHAR(512) NULL, timezone VARCHAR(255) NULL, primaryCurrency  ENUM('NAPA','BNB','ETH') DEFAULT 'NAPA', language VARCHAR(255) DEFAULT 'English', accountType text NULL, registrationType VARCHAR(45), pin VARCHAR(255), createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), avatar LONGTEXT, awardsEarned INT, awardsGiven INT, netAwardsAvailable INT, dailyActive VARCHAR(45) NOT NULL, monthlyActive VARCHAR(45) NOT NULL, fans INT DEFAULT 0, fansOf INT DEFAULT 0, deviceToken VARCHAR(255), termsAndCondition VARCHAR(20) DEFAULT 'false', allowNotifications VARCHAR(20) DEFAULT 'false', recoveryPin VARCHAR(6), expirationTime BIGINT)";

      await db.execute(tableQuery);
      await socialArtDb.execute(tableQuery);
      await stakingDB.execute(tableQuery);
      const uuid = uuidv4();

      const insertQuery = `INSERT INTO users (profileId, biometricPublickey, metamaskAccountNumber, napaWalletAccount, binanceWalletAccount, emailAddress, accountStatus, profileName, bio, timezone, primaryCurrency, language, accountType, registrationType, pin, avatar, dailyActive, monthlyActive, fans, fansOf, deviceToken, termsAndCondition, allowNotifications, recoveryPin, expirationTime) VALUES ("${uuid}", "${
        this.user.biometricPublickey || ""
      }", "${this.user.metamaskAccountNumber || ""}", "${
        this.user.napaWalletAccount || ""
      }", "${this.user.binanceWalletAccount || ""}", "${
        this.user.emailAddress || ""
      }", "1", "${this.user.profileName}", "${this.user.bio || ""}", "${
        this.user.timezone || ""
      }", "${this.user.primaryCurrency || "NAPA"}", "${
        this.user.language || "English"
      }", "${this.user.accountType || ""}", 
      "${this.user.registrationType || "Biometric"}",
      "${this.user.pin || ""}",
      "${this.user.avatar || ""}", "false", "false", "${this.user.fans || 0}", "${this.user.fansOf || 0}", "${this.user.deviceToken || ""}", "${this.user.termsAndCondition || "false"}", "${this.user.allowNotifications || "false"}" , "", "")`;

      await db.execute(insertQuery);
      await socialArtDb.execute(insertQuery);
      await stakingDB.execute(insertQuery);

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

      const sql = `SELECT * FROM users WHERE profileId = "${uuid}" OR metamaskAccountNumber = "${this.user.metamaskAccountNumber}" OR napaWalletAccount = "${this.user.napaWalletAccount}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getUserProfileDetails(id: string) {
    try {
      const sql = `SELECT * FROM users WHERE profileId = "${id}" OR metamaskAccountNumber = "${id}" OR napaWalletAccount = "${id}" OR emailAddress = "${id}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getUserProfileDetailsByPin(emailAddress: string, pin) {
    try {
      const encryptedPin = encryptString(pin);
      const sql = `SELECT * FROM users WHERE emailAddress = "${emailAddress}" AND pin = "${encryptedPin}" AND accountStatus = "1"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static findByMetamaskAccountNumber(metamaskAccountNumber: string) {
    try {
      const sql = `SELECT * FROM users WHERE metamaskAccountNumber = "${metamaskAccountNumber}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string) {
    try {
      const updateSql = `UPDATE users SET metamaskAccountNumber = "${
        this.user.metamaskAccountNumber || ""
      }", biometricPublickey = "${
        this.user.biometricPublickey || ""
      }", binanceWalletAccount = "${
        this.user.binanceWalletAccount || ""
      }", profileName = "${this.user.profileName}", bio = "${
        this.user.bio || ""
      }", timezone = "${this.user.timezone || ""}", primaryCurrency = "${
        this.user.primaryCurrency || "NAPA"
      }", language = "${this.user.language || "English"}", accountType = "${
        this.user.accountType || ""
      }", avatar = "${
        this.user.avatar || ""
      }", updatedAt = CURRENT_TIMESTAMP WHERE profileId = "${id}" OR metamaskAccountNumber = "${id}" OR napaWalletAccount = "${id}" OR emailAddress = "${id}"`;

      await db.execute(updateSql);
      await socialArtDb.execute(updateSql);
      await stakingDB.execute(updateSql);

      const sql = `SELECT * FROM users WHERE profileId = "${id}" OR metamaskAccountNumber = "${id}" OR napaWalletAccount = "${id}" OR emailAddress = "${id}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  // updateStatus

  async updateStatus(id: string) {
    try {
      const updateSql = `UPDATE users SET accountStatus = "${
        this.user.accountStatus || "1"
      }", updatedAt = CURRENT_TIMESTAMP WHERE profileId = "${id}" OR metamaskAccountNumber = "${id}" OR napaWalletAccount = "${id}" OR emailAddress = "${id}"`;

      await db.execute(updateSql);
      await socialArtDb.execute(updateSql);
      await stakingDB.execute(updateSql);

      const sql = `SELECT * FROM users WHERE profileId = "${id}" OR metamaskAccountNumber = "${id}" OR napaWalletAccount = "${id}" OR emailAddress = "${id}"`;

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

  static async updateDeviceToken(deviceToken, id) {
    try {
      const updateSql = `UPDATE users SET deviceToken = "${deviceToken}", updatedAt = CURRENT_TIMESTAMP WHERE profileId = "${id}" OR metamaskAccountNumber = "${id}" OR napaWalletAccount = "${id}" OR emailAddress = "${id}"`;

      await db.execute(updateSql);
      await socialArtDb.execute(updateSql);
      await stakingDB.execute(updateSql);

      const sql = `SELECT * FROM users WHERE profileId = "${id}" OR metamaskAccountNumber = "${id}" OR napaWalletAccount = "${id}" OR emailAddress = "${id}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default User;
