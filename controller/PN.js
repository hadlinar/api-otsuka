const db = require('../config/database.js');

class PN {
    async getPN(tanggal){
        let results = await db.query(`SELECT * FROM "vw_pn_otsuka" WHERE tanggal = $1`, [tanggal]).catch(console.log);
        return results.rows;
    };

};

module.exports = PN;