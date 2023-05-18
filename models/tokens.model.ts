/* eslint-disable @typescript-eslint/no-var-requires */
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { TokensInterface } from "../interfaces/tokens.interface";
const { db } = require("../index");

class Tokens {
  token: TokensInterface;
  constructor(token: TokensInterface) {
    this.token = token;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS tokens (rowId INTEGER AUTO_INCREMENT NOT NULL UNIQUE KEY, tokenId VARCHAR(45) NOT NULL PRIMARY KEY, profileId VARCHAR(45), napaWalletAccount VARCHAR(255), networkId VARCHAR(45), decimals VARCHAR(45), name VARCHAR(255), symbol VARCHAR(45), tokenAddresses LONGTEXT, createdAt TEXT, updatedAt TEXT)";

      await db.execute(tableQuery);
      const uuid = uuidv4();

      const insertQuery = `INSERT INTO tokens (tokenId, profileId, napaWalletAccount, networkId, decimals, name, symbol, tokenAddresses, createdAt, updatedAt) VALUES ("${uuid}","${
        this.token.profileId || ""
      }", "${this.token.napaWalletAccount || ""}", "${
        this.token.networkId || ""
      }", "${this.token.decimals || ""}", "${this.token.name || ""}", "${
        this.token.symbol
      }", "${
        this.token.tokenAddresses
      }",
      "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}",
      "${moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ")}"
      )`;

      await db.execute(insertQuery);

      const sql = `SELECT * FROM tokens WHERE napaWalletAccount = "${this.token.napaWalletAccount}" AND decimals = "${this.token.decimals}" ORDER BY createdAt DESC`;
      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static get(napaWalletAccount: string, networkId: string, symbol: string) {
    try {
      const sql = `SELECT * FROM tokens WHERE napaWalletAccount = "${napaWalletAccount}" AND networkId = "${networkId}" AND symbol = "${symbol}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getTokens(napaWalletAccount: string, networkId) {
    try {
      const sql = `SELECT * FROM tokens WHERE napaWalletAccount = "${napaWalletAccount}" AND networkId = "${networkId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Tokens;
