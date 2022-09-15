/* eslint-disable @typescript-eslint/no-var-requires */
import { db } from "../index";
const cron = require("node-cron");
const moment = require("moment");

cron.schedule("0 * * * *", async () => {
  try {
    console.log("trending cron job pending");

    const sql = `SELECT * FROM trending`;
    const [trending] = await db.execute(sql);
    const data = trending
      // @ts-ignore
      .filter((item) => {
        const endTime = moment(item.articleEndDate)
          .add(1, "hours")
          .format("YYYY-MM-DD hh:mm:ss");
        return moment(new Date()).format("YYYY-MM-DD hh:mm:ss") == endTime;
      })
      .map((item) => item.articleId);

    const articleIds = JSON.stringify(data).replace("[", "(").replace("]", ")");

    const updateSql = `UPDATE trending SET articleStatus = 4 WHERE articleId IN ${articleIds}`;

    console.log("trending cron job fullfilled");

    return db.execute(updateSql);
  } catch (error) {
    console.error(error);
    console.log("trending cron job rejected");
    throw new Error(error);
  }
});
