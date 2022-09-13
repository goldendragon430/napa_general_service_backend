import { db } from "../index";
import { TrendingFeed } from "../interfaces/trending.interface";
import { v4 as uuidv4 } from "uuid";

class Trending {
  trending: TrendingFeed;
  constructor(trending: TrendingFeed) {
    this.trending = trending;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS trending (articleId VARCHAR(45) NOT NULL PRIMARY KEY, articleTitle TEXT NOT NULL, articleBody TEXT NOT NULL, articleHeadline VARCHAR(206) NOT NULL, nftProject VARCHAR(100) NOT NULL, socialMediaCompaign VARCHAR(100) NULL, articleTags TEXT NOT NULL, articleType ENUM('SOCIAL', 'NFT') DEFAULT 'SOCIAL', partnerUUID VARCHAR(45) NOT NULL, author VARCHAR(100) NOT NULL, articleStartDate TIMESTAMP NOT NULL DEFAULT NOW(), totalRunDays VARCHAR(200) NOT NULL, articleEndDate TIMESTAMP NOT NULL DEFAULT NOW(), articleStatus ENUM('0','1','2','3','4') DEFAULT '0', postAdInNapaApp Boolean DEFAULT false, Paid Boolean DEFAULT false, Amount VARCHAR(150) NOT NULL, Txid VARCHAR(150) NOT NULL, createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(), FOREIGN KEY (partnerUUID) REFERENCES partners (partnerUUID))";

      await db.execute(tableQuery);

      const uuid = uuidv4();

      const totalRunDays =
        new Date(this.trending.articleEndDate).getDate() -
        new Date(this.trending.articleStartDate).getDate();

      const insertQuery = `INSERT INTO trending (articleId, articleTitle, articleBody, articleHeadline, nftProject, socialMediaCompaign, articleTags, articleType, partnerUUID, author, articleStartDate, totalRunDays, articleEndDate, articleStatus, postAdInNapaApp, Paid, Amount, Txid) VALUES ("${uuid}", "${this.trending.articleTitle}", "${this.trending.articleBody}", "${this.trending.articleHeadline}", "${this.trending.nftProject}", "${this.trending.socialMediaCompaign}", 
      "${this.trending.articleTags}",
       "${this.trending.articleType}", "${this.trending.partnerUUID}", "${this.trending.author}", "${this.trending.articleStartDate}", "${totalRunDays}", "${this.trending.articleEndDate}", "${this.trending.articleStatus}", "${this.trending.postAdInNapaApp}", "${this.trending.paid}", "${this.trending.amount}", "${this.trending.txid}")`;

      await db.execute(insertQuery);

      const sql = `SELECT * FROM trending WHERE articleId = "${uuid}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static delete(articleId: string) {
    try {
      const sql = `UPDATE trending SET articleStatus = 5 WHERE articleId = "${articleId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getAllTendingFeeds(status: string) {
    try {
      const sql = `SELECT * FROM trending WHERE articleStatus = ${status}`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static getTrendingFeed(articleId: string) {
    try {
      const sql = `SELECT * FROM trending WHERE articleId = "${articleId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Trending;
