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
        "CREATE TABLE IF NOT EXISTS napa_accounts (rowId INTEGER AUTO_INCREMENT NOT NULL UNIQUE KEY, profileId VARCHAR(45), napaWalletAccount VARCHAR(45), napaWalletAccountPhrase VARCHAR(255), NWA_1_AC VARCHAR(45), NWA_1_NE VARCHAR(45), NWA_1_PK VARCHAR(255), NWA_1_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1' , NWA_2_AC VARCHAR(45), NWA_2_NE VARCHAR(45), NWA_2_PK VARCHAR(255), NWA_2_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1' , NWA_3_AC VARCHAR(45), NWA_3_NE VARCHAR(45), NWA_3_PK VARCHAR(255), NWA_3_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1' , NWA_4_AC VARCHAR(45), NWA_4_NE VARCHAR(45), NWA_4_PK VARCHAR(255), NWA_4_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1' , NWA_5_AC VARCHAR(45), NWA_5_NE VARCHAR(45), NWA_5_PK VARCHAR(255), NWA_5_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1', activeWalletAC VARCHAR(45), createdAt Text, updatedAt Text)";

      await db.execute(tableQuery);
      //   const uuid = uuidv4();

      const insertQuery = `INSERT INTO napa_accounts (profileId, napaWalletAccount, napaWalletAccountPhrase, NWA_1_AC, NWA_1_NE, NWA_1_PK, NWA_1_ST, NWA_2_AC, NWA_2_NE, NWA_2_PK, NWA_2_ST, NWA_3_AC, NWA_3_NE, NWA_3_PK, NWA_3_ST, NWA_4_AC, NWA_4_NE, NWA_4_PK, NWA_4_ST , NWA_5_AC, NWA_5_NE, NWA_5_PK, NWA_5_ST, activeWalletAC, createdAt, updatedAt) VALUES ("${
        this.user.profileId || ""
      }", "${this.user.napaWalletAccount || ""}", "${
        this.user.napaWalletAccountPhrase || ""
      }", "${this.user.NWA_1_AC || ""}", "${this.user.NWA_1_NE || ""}", "${
        this.user.NWA_1_PK || ""
      }", "${this.user.NWA_1_ST || "1"}", 
      "${this.user.NWA_2_AC || ""}",
      "${this.user.NWA_2_NE || ""}",
      "${this.user.NWA_2_PK || ""}",
      "${this.user.NWA_2_ST || "1"}",
      "${this.user.NWA_3_AC || ""}",
      "${this.user.NWA_3_NE || ""}",
      "${this.user.NWA_3_PK || ""}",
      "${this.user.NWA_3_ST || "1"}",
      "${this.user.NWA_4_AC || ""}",
      "${this.user.NWA_4_NE || ""}",
      "${this.user.NWA_4_PK || ""}",
      "${this.user.NWA_4_ST || "1"}",
      "${this.user.NWA_5_AC || ""}",
      "${this.user.NWA_5_NE || ""}",
      "${this.user.NWA_5_PK || ""}",
      "${this.user.NWA_5_ST || "1"}",
      "${this.user.activeWalletAC || "1"}",
      "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}", "${moment(
        new Date()
      ).format("YYYY-MM-DDTHH:mm:ssZ")}")`;

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

  static async add(profileId: string, name: string, index: number, newAcWalletPrivatekeyEncrpted, newAcWalletAddress) {
    try {
      const updateSql = `UPDATE napa_accounts SET ${`NWA_${Number(index)+1}_AC`} = "${newAcWalletAddress}", ${`NWA_${Number(index)+1}_NE`} = "${name}", ${`NWA_${Number(index)+1}_PK`} = "${newAcWalletPrivatekeyEncrpted}", ${`NWA_${Number(index)+1}_ST`} = "1", updatedAt = CURRENT_TIMESTAMP WHERE profileId = "${profileId}"`;

      await db.execute(updateSql);

      const sql = `SELECT * FROM napa_accounts WHERE profileId = "${profileId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static async switchAccount(profileId: string, index: string) {
    try {      
      const updateSql = `UPDATE napa_accounts SET activeWalletAC = "${index}", updatedAt = CURRENT_TIMESTAMP WHERE profileId = "${profileId}"`;

      await db.execute(updateSql);

      const sql = `SELECT * FROM napa_accounts WHERE profileId = "${profileId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default NapaAccounts;
