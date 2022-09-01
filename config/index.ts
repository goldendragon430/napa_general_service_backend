import mysql from "mysql2";

export const publishKey = "pub-c-a0c50e24-85ba-488c-a760-fcc9cdc8d42f";
export const subscribeKey = "sub-c-d4377c6d-6c5f-4199-adbc-8885a5a5270a";
export const secretKey = process.env.SECRET_KEY;

const pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  database: process.env.RDS_DB_NAME,
  password: process.env.RDS_PASSWORD,
});

module.exports = pool.promise();
