import { db } from "../index";
import { PartnersInterface } from "../interfaces/partners.interface";
import { v4 as uuidv4 } from "uuid";

class Partners {
  partners: PartnersInterface;
  constructor(partners: PartnersInterface) {
    this.partners = partners;
  }

  async save() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS partners (partnerUUID VARCHAR(45) NOT NULL PRIMARY KEY, accountNumber VARCHAR(255) NOT NULL, profileName VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, website VARCHAR(100) NULL, contactPerson VARCHAR(100) NULL, newsFeedSubscriber VARCHAR(206) NULL, bio VARCHAR(512) NULL, timezone VARCHAR(255) NULL, primaryCurrency ENUM('NAPA','BNB','ETH') DEFAULT 'NAPA', language VARCHAR(255) DEFAULT 'English', createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), avatar TEXT NOT NULL, UNIQUE(accountNumber), UNIQUE(email))";

      await db.execute(tableQuery);

      const uuid = uuidv4();

      const insertQuery = `INSERT INTO partners (partnerUUID, accountNumber, profileName, email, website, contactPerson, newsFeedSubscriber, bio, timezone, primaryCurrency, language, avatar) VALUES ("${uuid}", "${this.partners.accountNumber}", "${this.partners.profileName}", "${this.partners.email}", "${this.partners.website}", "${this.partners.contactPerson}", "${this.partners.newsFeedSubscriber}", "${this.partners.bio}", "${this.partners.timezone}", "${this.partners.primaryCurrency}", "${this.partners.language}", "${this.partners.avatar}")`;

      await db.execute(insertQuery);

      const sql = `SELECT * FROM partners WHERE partnerUUID = "${uuid}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getPartnerAccountDetails(partnerUUID: string) {
    try {
      const sql = `SELECT * FROM partners WHERE partnerUUID = "${partnerUUID}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(partnerUUID: string) {
    try {
      const updateSql = `UPDATE partners SET accountNumber = "${this.partners.accountNumber}", profileName = "${this.partners.profileName}", email = "${this.partners.email}", contactPerson = "${this.partners.contactPerson}", newsFeedSubscriber = "${this.partners.newsFeedSubscriber}", bio = "${this.partners.bio}", timezone = "${this.partners.timezone}", primaryCurrency = "${this.partners.primaryCurrency}", language = "${this.partners.language}", avatar = "${this.partners.avatar}" WHERE partnerUUID = "${partnerUUID}"`;

      await db.execute(updateSql);

      const sql = `SELECT * FROM partners WHERE partnerUUID = "${partnerUUID}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Partners;
