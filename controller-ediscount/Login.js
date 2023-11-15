const db = require( '../config/database.js')

class Login {

    async login(username) {
        let result = await db.pool2.query(`SELECT username, password_mobile, nama, branch_id, role_id, is_active, flg_am
        FROM public.mst_user 
        WHERE username=$1;`, [username])

        return result;
    }
}

module.exports = Login;