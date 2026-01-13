const { Pool } = require("pg");

const pool = new Pool({
  user: "receipt_master",
  host: "localhost",
  database: "receiptsystem",
  password: "StrongPassword123",
  port: 5432
});

module.exports = pool;
