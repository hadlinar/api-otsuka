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
  password: 'apps2022!',
  port: 5432,
})

const oracle = {
  user: "RN",
  password: "RNNUS",
  connectString: "NUSINDO49"
}

const pubsub = new PubSub(pool2)

module.exports = { pool, pool2, pubsub, oracle};