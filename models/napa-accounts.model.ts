/* eslint-disable @typescript-eslint/no-var-requires */
// import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { NapaAccountsInterface } from "../interfaces/napa-accounts.interface";
const { db } = require("../index");

class NapaAccounts {
  user: NapaAccountsInterface;
  constructor(user: NapaAccountsInterface) {
    this.user = user;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS napa_accounts (rowId INTEGER AUTO_INCREMENT NOT NULL UNIQUE KEY, profileId VARCHAR(45), napaWalletAccount VARCHAR(45), napaWalletAccountPhrase VARCHAR(255), subAcWalletAddress VARCHAR(45), subAcWalletName VARCHAR(45), subAcWalletPrivatekey VARCHAR(255), subAcWalletStatus ENUM('1', '2', '3') NOT NULL DEFAULT '1', isActive VARCHAR(45), createdAt Text, updatedAt Text)";

      await db.execute(tableQuery);
      //   const uuid = uuidv4();

      const insertQuery = `INSERT INTO napa_accounts (profileId, napaWalletAccount, napaWalletAccountPhrase, subAcWalletAddress, subAcWalletName, subAcWalletPrivatekey, subAcWalletStatus, isActive, createdAt, updatedAt) VALUES ("${
        this.user.profileId || ""
      }", "${this.user.napaWalletAccount || ""}", "${
        this.user.napaWalletAccountPhrase || ""
      }", "${this.user.subAcWalletAddress || ""}", "${
        this.user.subAcWalletName || ""
      }", "${this.user.subAcWalletPrivatekey || ""}", "${
        this.user.subAcWalletStatus || "1"
      }" ,"${this.user.isActive || "true"}", "${moment(new Date()).format(
        "YYYY-MM-DDTHH:mm:ssZ"
      )}", "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}")`;

      return db.execute(insertQuery);
    } catch (error) {
      throw new Error(error);
    }
  }

  static get(profileId: string) {
    try {
      const sql = `SELECT * FROM napa_accounts WHERE profileId = "${profileId}" ORDER BY createdAt DESC`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default NapaAccounts;
