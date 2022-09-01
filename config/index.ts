import mysql from "mysql2";

export const publishKey = "pub-c-a0c50e24-85ba-488c-a760-fcc9cdc8d42f";
export const subscribeKey = "sub-c-d4377c6d-6c5f-4199-adbc-8885a5a5270a";
export const secretKey =
  "sec-c-NTVjYTA3NWUtNjE5Zi00N2QxLTg0MDItNWI0NWRhZGMxNjNk";
const RDS_HOSTNAME =
  "napa-general-services.clfuekgzzk52.ap-southeast-1.rds.amazonaws.com";
const RDS_USERNAME = "admin";
const RDS_PASSWORD = "napa12345";
const RDS_DB_NAME = "napa-development";

const pool = mysql.createPool({
  host: RDS_HOSTNAME,
  user: RDS_USERNAME,
  database: RDS_DB_NAME,
  password: RDS_PASSWORD,
});

module.exports = { db: pool.promise(), publishKey, subscribeKey };
