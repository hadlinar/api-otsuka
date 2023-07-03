const db = require('../config/database.js');

class PN {
    async getPNDate(date){
        let results = await db.pool.query(`SELECT * FROM "vw_pn_otsuka" WHERE tanggal = $1`, [date]).catch(console.log);
        return results.rows;
    };

    async getPNMonth(month){
        let results = await db.pool.query(`SELECT * FROM "vw_pn_otsuka" WHERE per_month = $1`, [month]).catch(console.log);
        return results.rows;
    };
    async getPNYear(year){
        let results = await db.pool.query(`SELECT * FROM "vw_pn_otsuka" WHERE per_year = $1`, [year]).catch(console.log);
        return results.rows;
    };

};

module.exports = PN;