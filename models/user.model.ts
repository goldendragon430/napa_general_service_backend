/* eslint-disable @typescript-eslint/no-var-requires */
import { UserInterface } from "../interfaces/user.interfaces";

const { db } = require("../config");

class User {
  user: UserInterface;
  constructor(user: UserInterface) {
    this.user = user;
  }

  async save() {
    const tableQuery =
      "CREATE TABLE IF NOT EXISTS users(metamask_wallet_account_number VARCHAR(255) PRIMARY KEY, profile_name VARCHAR(100), Bio VARCHAR(512), Timezone VARCHAR(255), primary_currency  ENUM('NAPA','BNB','ETH'), language VARCHAR(255), NAPA_social_media_account_email text)";

    await db.execute(tableQuery);

    const sql = `INSERT INTO users (metamask_wallet_account_number, profile_name, Bio, Timezone, primary_currency, language, NAPA_social_media_account_email) VALUES ("${this.user.accountNumber}", "${this.user.profileName}", "${this.user.bio}", "${this.user.timezone}", "${this.user.primaryCurrency}", "${this.user.language}", "${this.user.napaSocialMediaAccount}")`;

    return db.execute(sql);
  }

  static getUserByAccountNumber(accountNumber: string) {
    const sql = `SELECT * FROM users WHERE metamask_wallet_account_number = "${accountNumber}"`;
    return db.execute(sql);
  }
}

export default User;
