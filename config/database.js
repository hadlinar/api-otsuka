const Pool = require('pg').Pool
const PubSub = require('pg-pubsub')
const oracledb = require('oracledb');

const pool = new Pool({
  user: 'postgres',
  host: '170.1.70.64',
  database: 'dtms_cp',
  password: 'Nusindo123**',
  port: 5432,
})

const pool2 = new Pool({
  user: 'tekinfo',
  host: '170.1.70.67',
  database: 'ediscount',
  password: 'Jakarta!@#09876',
  port: 5432,
})

const oracle = {
  user: "RN",
  password: "ORARNNUS",
  connectString: "NUSINDO38"
}

const pubsub = new PubSub(pool2)

module.exports = { pool, pool2, pubsub, oracle};