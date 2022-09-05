/* eslint-disable @typescript-eslint/no-var-requires */
import { UserInterface } from "../interfaces/user.interfaces";
import { v4 as uuidv4 } from "uuid";
const { db } = require("../config");

class User {
  user: UserInterface;
  constructor(user: UserInterface) {
    this.user = user;
  }

  async save() {
    const tableQuery =
      "CREATE TABLE IF NOT EXISTS users(napa_profile_id VARCHAR(45) NOT NULL PRIMARY KEY, metamask_wallet_account_number VARCHAR(255) NOT NULL, profile_name VARCHAR(100) NOT NULL, Bio VARCHAR(512) NULL, Timezone VARCHAR(255) NULL, primary_currency  ENUM('NAPA','BNB','ETH') DEFAULT 'NAPA', language VARCHAR(255) DEFAULT 'English', NAPA_social_media_account_email text NULL,  created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), UNIQUE(metamask_wallet_account_number))";

    await db.execute(tableQuery);

    const insertQuery = `INSERT INTO users (napa_profile_id, metamask_wallet_account_number, profile_name, Bio, Timezone, primary_currency, language, NAPA_social_media_account_email) VALUES ("${uuidv4()}", "${
      this.user.accountNumber
    }", "${this.user.profileName}", "${this.user.bio}", "${
      this.user.timezone
    }", "${this.user.primaryCurrency}", "${this.user.language}", "${
      this.user.napaSocialMediaAccount
    }")`;

    await db.execute(insertQuery);

    const sql = `SELECT * FROM users WHERE napa_profile_id = "${this.user.napaProfileId}" OR metamask_wallet_account_number = "${this.user.accountNumber}"`;

    return db.execute(sql);
  }

  static getUserProfileDetails(id: string) {
    console.log(id);
    const sql = `SELECT * FROM users WHERE napa_profile_id = "${id}" OR metamask_wallet_account_number = "${id}"`;

    return db.execute(sql);
  }

  async update(id: string) {
    const updateSql = `UPDATE users SET metamask_wallet_account_number = "${this.user.accountNumber}", profile_name = "${this.user.profileName}", Bio = "${this.user.bio}", Timezone = "${this.user.timezone}", primary_currency = "${this.user.primaryCurrency}", language = "${this.user.language}", NAPA_social_media_account_email = "${this.user.napaSocialMediaAccount}" WHERE napa_profile_id = "${id}" OR metamask_wallet_account_number = "${id}"`;

    await db.execute(updateSql);

    const sql = `SELECT * FROM users WHERE napa_profile_id = "${id}" OR metamask_wallet_account_number = "${id}"`;

    return db.execute(sql);
  }
}

export default User;
