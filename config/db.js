// config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Ameth2005',
  database: 'image_manager',
});

module.exports = pool;
