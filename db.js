const { Pool } = require('pg');

// Cria uma pool de conexões com o banco de dados
const pool = new Pool({
    
    user: 'postgres',
    host: 'localhost',
    database: 'projeto_banco_dados_3',
    password: 'postgresql',
    port: 5432,
  });

  console.log(`conectado ao banco ${pool.options.database}`);

  module.exports = pool;