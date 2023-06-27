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
        "CREATE TABLE IF NOT EXISTS napa_accounts (rowId INTEGER AUTO_INCREMENT NOT NULL UNIQUE KEY, profileId VARCHAR(45), napaWalletAccount VARCHAR(45), napaWalletAccountPhrase VARCHAR(255), NWA_1_AC VARCHAR(45), NWA_1_NE VARCHAR(45), NWA_1_PK VARCHAR(255), NWA_1_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1' , NWA_2_AC VARCHAR(45), NWA_2_NE VARCHAR(45), NWA_2_PK VARCHAR(255), NWA_2_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1' , NWA_3_AC VARCHAR(45), NWA_3_NE VARCHAR(45), NWA_3_PK VARCHAR(255), NWA_3_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1' , NWA_4_AC VARCHAR(45), NWA_4_NE VARCHAR(45), NWA_4_PK VARCHAR(255), NWA_4_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1' , NWA_5_AC VARCHAR(45), NWA_5_NE VARCHAR(45), NWA_5_PK VARCHAR(255), NWA_5_ST ENUM('1', '2', '3') NOT NULL DEFAULT '1', activeWalletAC VARCHAR(45), createdAt Text, updatedAt Text, NWA_1_Type VARCHAR(45), NWA_1_CreatedAt TIMESTAMP DEFAULT NOW(), NWA_2_Type VARCHAR(45), NWA_2_CreatedAt TIMESTAMP DEFAULT NOW(), NWA_3_Type VARCHAR(45), NWA_3_CreatedAt TIMESTAMP DEFAULT NOW(), NWA_4_Type VARCHAR(45), NWA_4_CreatedAt TIMESTAMP DEFAULT NOW(), NWA_5_Type VARCHAR(45), NWA_5_CreatedAt TIMESTAMP DEFAULT NOW())";

      await db.execute(tableQuery);
      //   const uuid = uuidv4();

      const insertQuery = `INSERT INTO napa_accounts (profileId, napaWalletAccount, napaWalletAccountPhrase, NWA_1_AC, NWA_1_NE, NWA_1_PK, NWA_1_ST, NWA_2_AC, NWA_2_NE, NWA_2_PK, NWA_2_ST, NWA_3_AC, NWA_3_NE, NWA_3_PK, NWA_3_ST, NWA_4_AC, NWA_4_NE, NWA_4_PK, NWA_4_ST , NWA_5_AC, NWA_5_NE, NWA_5_PK, NWA_5_ST, activeWalletAC, createdAt, updatedAt, NWA_1_Type, NWA_1_CreatedAt, NWA_2_Type, NWA_2_CreatedAt, NWA_3_Type, NWA_3_CreatedAt,NWA_4_Type, NWA_4_CreatedAt, NWA_5_Type, NWA_5_CreatedAt) VALUES ("${
        this.user.profileId || ""
      }", "${this.user.napaWalletAccount || ""}", "${
        this.user.napaWalletAccountPhrase || ""
      }", "${this.user.NWA_1_AC || ""}", "${this.user.NWA_1_NE || ""}", "${
        this.user.NWA_1_PK || ""
      }", "${this.user.NWA_1_ST || "1"}", 
      "${this.user.NWA_2_AC || ""}",
      "${this.user.NWA_2_NE || ""}",
      "${this.user.NWA_2_PK || ""}",
      "${this.user.NWA_2_ST || ""}",
      "${this.user.NWA_3_AC || ""}",
      "${this.user.NWA_3_NE || ""}",
      "${this.user.NWA_3_PK || ""}",
      "${this.user.NWA_3_ST || ""}",
      "${this.user.NWA_4_AC || ""}",
      "${this.user.NWA_4_NE || ""}",
      "${this.user.NWA_4_PK || ""}",
      "${this.user.NWA_4_ST || ""}",
      "${this.user.NWA_5_AC || ""}",
      "${this.user.NWA_5_NE || ""}",
      "${this.user.NWA_5_PK || ""}",
      "${this.user.NWA_5_ST || ""}",
      "${this.user.activeWalletAC || "1"}",
      "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}", 
      "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}",
      "${this.user.NWA_1_Type || ""}",
      "${this.user.NWA_1_CreatedAt || ""}",
      "${this.user.NWA_2_Type || ""}",
      "${this.user.NWA_2_CreatedAt || ""}",
      "${this.user.NWA_3_Type || ""}",
      "${this.user.NWA_3_CreatedAt || ""}",
      "${this.user.NWA_4_Type || ""}",
      "${this.user.NWA_4_CreatedAt || ""}",
      "${this.user.NWA_5_Type || ""}",
      "${this.user.NWA_5_CreatedAt || ""}")`;

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

  static async add(
    profileId: string,
    name: string,
    index: number,
    newAcWalletPrivatekeyEncrpted,
    newAcWalletAddress,
    totalAccounts,
    type
  ) {
    try {
      const updateSql = `UPDATE napa_accounts SET ${`NWA_${
        Number(index) + 1
      }_AC`} = "${newAcWalletAddress}", ${`NWA_${
        Number(index) + 1
      }_NE`} = "${name}", ${`NWA_${
        Number(index) + 1
      }_PK`} = "${newAcWalletPrivatekeyEncrpted}", ${`NWA_${
        Number(index) + 1
      }_ST`} = "1", totalAccounts = "${totalAccounts}", NWA_${Number(index) + 1}_Type = "${type}", NWA_${Number(index) + 1}_CreatedAt = "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}" WHERE profileId = "${profileId}"`;

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

  static async update(
    NWA_1_AC: string,
    NWA_1_NE: string,
    NWA_1_PK: string,
    profileId: string
  ) {
    try {
      const updateSql = `UPDATE napa_accounts SET NWA_1_AC = "${NWA_1_AC}", NWA_1_NE = "${NWA_1_NE}", NWA_1_PK = "${NWA_1_PK}", totalAccounts = "${1}", updatedAt = CURRENT_TIMESTAMP WHERE profileId = "${profileId}"`;

      await db.execute(updateSql);

      const sql = `SELECT * FROM napa_accounts WHERE profileId = "${profileId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
  static async delete(
    index: number,
    NW_AC_ID: string,
    profileId: string,
    activeAccountIndex: number
  ) {
    try {
      const updateSql = `UPDATE napa_accounts SET NWA_${index}_ST = "${"2"}", activeWalletAC = "${activeAccountIndex}" WHERE NWA_${index}_AC = "${NW_AC_ID}"`;
      await db.execute(updateSql);
      const sql = `SELECT * FROM napa_accounts WHERE profileId = "${profileId}"`;
      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
  static async updateAccount(
    index: number,
    NW_AC_ID: string,
    profileId: string,
    name: string,
    PK: string,
    address: string,
    totalAccounts,
    type
  ) {
    try {
      const updateSql = `UPDATE napa_accounts SET NWA_${index}_ST = "${"1"}", ${`NWA_${Number(
        index
      )}_NE`} = "${name}", NWA_${index}_PK = "${PK}", NWA_${index}_AC = "${address}", totalAccounts = "${totalAccounts}", NWA_${index}_Type = "${type}", NWA_${index}_CreatedAt = "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}" WHERE NWA_${index}_AC = "${NW_AC_ID}"`;
      await db.execute(updateSql);
      const sql = `SELECT * FROM napa_accounts WHERE profileId = "${profileId}"`;
      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getRecoveryPhrase(profileId: string) {
    try {
      const sql = `SELECT napaWalletAccountPhrase FROM napa_accounts WHERE profileId = "${profileId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default NapaAccounts;
