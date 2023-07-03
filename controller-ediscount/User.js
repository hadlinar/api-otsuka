const db = require('../config/database.js');

class User {
    async user(){
        let results = await db.pool2.query(`SELECT * FROM  mst_user`).catch(console.log);
        return results.rows;
    };

};

module.exports = User;