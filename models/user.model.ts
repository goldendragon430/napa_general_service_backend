import { UserInterface } from "../interfaces/user.interfaces";

const db = require("../config");

class User {
  user: UserInterface;
  constructor(user: UserInterface) {
    this.user = user;
  }

  save() {
    let tableQuery =
      "CREATE TABLE IF NOT EXISTS users(metamask_wallet_account_number VARCHAR(255) PRIMARY KEY, profile_name VARCHAR(100), Bio VARCHAR(512), Timezone VARCHAR(255), primary_currency VARCHAR(10), language VARCHAR(255))";

    db.execute(tableQuery);
    let sql = `INSERT INTO users (metamask_wallet_account_number, profile_name, Bio, Timezone, primary_currency, language) VALUES ("${this.user.accountNumber}", "${this.user.profileName}", "${this.user.bio}", "${this.user.timezone}", "${this.user.primaryCurrency}", "${this.user.language}")`;

    return db.execute(sql);
  }
}

module.exports = User;
