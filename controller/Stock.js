const db = require('../config/database.js');

class Stock {
    async getStock(){
        let results = await db.query(`SELECT * FROM "vw_stock_otsuka"`).catch(console.log);
        return results.rows;
    };

};

module.exports = Stock;