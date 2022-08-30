const mysql = require("mysql2");
const {
  HOST_NAME,
  USER_NAME,
  PASSWORD,
  PORT,
  DB_NAME,
} = require("./vars.config");

const pool = mysql.createPool({
  host: HOST_NAME,
  user: USER_NAME,
  database: DB_NAME,
  password: PASSWORD,
  port: PORT,
});

module.exports = pool.promise();
