const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: '170.1.70.64',
  database: 'dtms_cp',
  password: 'Nusindo123**',
  port: 5432,
})

module.exports = pool;