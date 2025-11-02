const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'cristo',
  password: 'cristo123',
  database: 'cristolib',
  port: 3306
});

conn.connect(err => {
  if (err) {
    console.error('Erro ao conectar:', err.message);
    process.exit(1);
  }
  console.log('Conectou com sucesso ao MySQL!');
  conn.end();
});
