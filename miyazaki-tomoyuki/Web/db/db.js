const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1924zaki725@",
  database: "web_app",
  waitForConnections: true,
  connectionLimit: 3,
  namedPlaceholders: true,
});

module.exports = db;