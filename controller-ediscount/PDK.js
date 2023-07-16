const db = require('../config/database.js');

class PDK {
    async listPDK(branch, cat, role){
        let results

        if(role == 1 ) {
            results = await db.pool2.query(`SELECT *, f_branch_name($1) branch, f_user_name(maker) approver_name, f_cust_name(kode_pelanggan) cust
            FROM trn_pdk
            WHERE branch_id = $1 AND no_register IS NULL AND 
            user_approve_1 IS NULL AND maker IS NOT NULL`, [branch]).catch(console.log)
        }
        else if(role == 3) {
            results = await db.pool2.query(`SELECT *, f_branch_name($1) branch, f_user_name(user_approve_${role-1}) approver_name,f_cust_name(kode_pelanggan) cust
            FROM trn_pdk
            WHERE branch_id = $1 AND no_register IS NULL AND 
            user_approve_${role} IS NULL AND user_approve_${role-1} IS NOT NULL`, [branch]).catch(console.log)
        }
        else {
            results = await db.pool2.query(`SELECT *, f_branch_name($1) branch, f_user_name(user_approve_${role-1}) approver_name, f_cust_name(kode_pelanggan) cust
            FROM trn_pdk
            WHERE branch_id = $1 AND kategori_otsuka = $2 AND no_register IS NULL AND 
            user_approve_${role} IS NULL AND user_approve_${role-1} IS NOT NULL`, [branch, cat]).catch(console.log)
        }

        return results
    };

    async donePDK(branch, cat, role) {
        let results

        if(role != 5) {
            let query = `SELECT * 
            FROM trn_pdk
            WHERE branch_id = '${branch}' AND kategori_otsuka = '${cat}' AND user_approve_${role} IS NOT NULL AND final_status IS NOT NULL`
            results = await db.pool2.query(query).catch(console.log)
        } 
        if (cat == null) {
            results = await db.pool2.query(`
            SELECT * 
            FROM trn_pdk
            WHERE branch_id = $1 AND user_approve_${role} IS NOT NULL AND final_status IS NOT NULL
            `, [branch]).catch(console.log)
        }
        if (role == 6) {
            let query = `SELECT * 
            FROM trn_pdk
            WHERE branch_id = '${branch}' AND kategori_otsuka = '${cat}' AND user_approve_6 IS NOT NULL AND final_status IS NOT NULL`
            results = await db.pool2.query(query).catch(console.log)
        }
        else {
            results = await db.pool2.query(`
            SELECT * 
            FROM trn_pdk
            WHERE branch_id = $1 and kategori_otsuka = $2 AND user_approve_5 IS NOT NULL AND final_status IS NOT NULL
            `, [branch, cat]).catch(console.log)
        } 

        return results;
    }

    async detailPDK(id) {
        let results = await db.pool2.query(`SELECT *, f_prod_name(kode_barang) prod_name FROM trn_detail_pdk WHERE id_ref = $1;`, [id]).catch(console.log)
        return results
    }
    
    async approvePDK(usern, desc, date, role, id, cat, branch, disc, id_det) {
        let results = await db.pool2.query(
            `SELECT * FROM f_upt_appr($1, $2, $3, $4, $5, $6, $7, $8, $9);`, [usern, desc, date, role, id, cat, branch, disc, id_det]
        ).catch(console.log)

        return results
    }
    
    async rejectPDK(usern, desc, date, role, id, cat, branch) {
        let results = await db.pool2.query(
            `SELECT * FROM f_upt_reject($1, $2, $3, $4, $5, $6, $7);`, [usern, desc, date, role, id, cat, branch]
        ).catch(console.log)

        return results
    }

};

module.exports = PDK;