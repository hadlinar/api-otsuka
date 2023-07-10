const db = require('../config/database.js');

class User {
    async user(usern){
        let results = await db.pool2.query(`
        SELECT username, password_mobile, nama, branch_id, role_id, is_active
        FROM mst_user
        WHERE is_active = 1 AND username = $1`, [usern]).catch(console.log);
        
        return results;
    };

    async userOI(role, usern) {
        let results = await db.pool2.query(`
        SELECT nama, o.branch_id, kategori_otsuka, role_id, is_active
        FROM mst_user as u, mst_position_otsuka as o
        WHERE username = user_approve_${role} and user_approve_${role} = $1`, [usern]).catch(console.log)

        return results;
    }

    async changeName(usern, newName) {
        let results = await db.pool2.query(`UPDATE mst_user SET nama = $2 WHERE username = $1`, [usern, newName]).catch(console.log)

        return results;
    }

};

module.exports = User;