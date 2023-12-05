const db = require('../config/database.js');

class User {
    async userCheck(usern){
        let results = await db.pool2.query(`
        SELECT username, password_mobile, password, nama, branch_id, role_id, is_active
        FROM mst_user
        WHERE is_active = 1 AND username = $1`, [usern]).catch(console.log);
        
        return results;
    };

    async user(role, usern) {
        // let results = await db.pool2.query(`
        // SELECT u.username, u.password_mobile, nama, ${role == 1 || role == 3 ? `u.branch_id, ` : `o.branch_id, `} kategori_otsuka, role_id, is_active, flg_am
        // FROM mst_user as u, mst_position_otsuka as o
        // WHERE ${role == 1 || role == 3 ? '' : (role == 9 ? ``: `user_approve_${role} = username AND `)} username = $1`, [usern]).catch(console.log)
        
        let results = await db.pool2.query(`
        SELECT distinct on (username) username, password_mobile, nama, string_agg(distinct ${role == 1 || role == 3 ? `u` : `o`}.branch_id::text, ', ') branch_id, string_agg(distinct kategori_otsuka, ', ') kategori_otsuka, role_id, is_active, flg_am
        FROM mst_user as u, mst_position_otsuka as o
        WHERE ${role == 1 || role == 3 ? `` : `user_approve_${role} = username AND`} username = '${usern}'
        GROUP BY username, password_mobile, nama, role_id, is_active, flg_am
        `)
        return results;
    }

    async changeName(usern, newName) {
        let results = await db.pool2.query(`UPDATE mst_user SET nama = $2 WHERE username = $1`, [usern, newName]).catch(console.log)

        return results;
    }

};

module.exports = User;