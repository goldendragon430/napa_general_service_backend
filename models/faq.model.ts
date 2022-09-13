import { db } from "../index";
import { FaqInterface } from "interfaces/faq.interface";
import { v4 as uuidv4 } from "uuid";

class Faq {
  faq: FaqInterface;
  constructor(faq: FaqInterface) {
    this.faq = faq;
  }

  async create() {
    try {
      const tableQuery =
        "CREATE TABLE IF NOT EXISTS faq (questionId VARCHAR(45) NOT NULL PRIMARY KEY, question TEXT NOT NULL, response TEXT NOT NULL, createdAt TIMESTAMP NOT NULL DEFAULT NOW(), updatedAt TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now())";

      await db.execute(tableQuery);

      const uuid = uuidv4();

      const insertQuery = `INSERT INTO faq (questionId, question, response) VALUES ("${uuid}", "${this.faq.question}", "${this.faq.response}")`;

      await db.execute(insertQuery);

      const sql = `SELECT * FROM faq WHERE questionId = "${uuid}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(questionId: string) {
    try {
      const updateSql = `UPDATE faq SET question = "${this.faq.question}", response = "${this.faq.response}", updatedAt = CURRENT_TIMESTAMP WHERE questionId = "${questionId}"`;

      await db.execute(updateSql);

      const sql = `SELECT * FROM faq WHERE questionId = "${questionId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }

  static findOne(questionId: string) {
    try {
      const sql = `SELECT * FROM faq WHERE questionId = "${questionId}"`;

      return db.execute(sql);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Faq;
