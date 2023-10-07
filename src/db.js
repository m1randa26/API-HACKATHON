const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'JorgeLaika123',
  database: 'costumer_data'
});

module.exports = connection.promise();
