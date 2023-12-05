const db = require('../config/database.js');

class PDK {
    async listPDK(branch, cat, role){
        let branchAgg = ''
        cat = cat.length == 2 ? "('S', 'U')" : "('" + cat[0] + "')"
        if(branch.length > 2) {
            for(let i = 0; i <= branch.length-1; i++) {
                if(i == 0) {
                    branchAgg += `('${branch[i]}', `
                }
                else if (i == branch.length-1) {
                    branchAgg += `'${branch[branch.length-1]}')`
                }
                else {
                    branchAgg += `'${branch[i]}', `
                }
            }

        } else {
            branchAgg = "('" + branch[0] + "')"
        }

        let results = await db.pool2.query(`SELECT *, f_branch_name(branch_id) branch, f_user_name(maker) maker_name, f_user_name(user_approve_1) approver_1, f_user_name(user_approve_2) approver_2, 
        f_user_name(user_approve_3) approver_3, f_user_name(user_approve_4) approver_4, f_user_name(user_approve_5) approver_5, f_user_name(user_approve_6) approver_6, f_cust_name(kode_pelanggan) cust
        FROM trn_pdk
        WHERE branch_id in ${branchAgg} AND kategori_otsuka in ${cat} AND no_register IS NULL AND final_status IS NULL AND
        user_approve_${role} IS NULL AND ${role == 1 ? 'maker' : `user_approve_${role-1}`} IS NOT NULL
        ORDER BY date ASC`).catch(console.log)

        return results
    };

    async donePDK(branch, cat, role) {
        let results

        if(role == 1 ) {
            results = await db.pool2.query(`SELECT *, f_branch_name($1) branch, f_user_name(maker) maker_name, f_user_name(user_approve_1) approver_1, f_user_name(user_approve_2) approver_2, 
            f_user_name(user_approve_3) approver_3, f_user_name(user_approve_4) approver_4, f_user_name(user_approve_5) approver_5, f_user_name(user_approve_6) approver_6, f_cust_name(kode_pelanggan) cust
            FROM trn_pdk
            WHERE branch_id = $1 AND user_approve_1 IS NOT NULL
            ORDER BY date ASC`, [branch]).catch(console.log)
        }
        else if(role == 3 || role == 5) {
            results = await db.pool2.query(`SELECT *, f_branch_name(branch_id) branch, f_user_name(maker) maker_name, f_user_name(user_approve_1) approver_1, f_user_name(user_approve_2) approver_2, 
            f_user_name(user_approve_3) approver_3, f_user_name(user_approve_4) approver_4, f_user_name(user_approve_5) approver_5, f_user_name(user_approve_6) approver_6, f_cust_name(kode_pelanggan) cust
            FROM trn_pdk
            WHERE user_approve_${role} IS NOT NULL
            ORDER BY date ASC`).catch(console.log)
        }
        else if(role == 6) {
            results = await db.pool2.query(`SELECT *, f_branch_name(branch_id) branch, f_user_name(maker) maker_name, f_user_name(user_approve_1) approver_1, f_user_name(user_approve_2) approver_2, 
            f_user_name(user_approve_3) approver_3, f_user_name(user_approve_4) approver_4, f_user_name(user_approve_5) approver_5, f_user_name(user_approve_6) approver_6, f_cust_name(kode_pelanggan) cust
            FROM trn_pdk
            WHERE user_approve_6 IS NOT NULL
            ORDER BY date ASC`).catch(console.log)
        }
        
        else {
            results = await db.pool2.query(`SELECT *, f_branch_name(branch_id) branch, f_user_name(maker) maker_name, f_user_name(user_approve_1) approver_1, f_user_name(user_approve_2) approver_2, 
            f_user_name(user_approve_3) approver_3, f_user_name(user_approve_4) approver_4, f_user_name(user_approve_5) approver_5, f_user_name(user_approve_6) approver_6, f_cust_name(kode_pelanggan) cust
            FROM trn_pdk
            WHERE branch_id = '${branch}' AND kategori_otsuka = '${cat}' AND user_approve_${role} IS NOT NULL AND level != 9
            ORDER BY date ASC`).catch(console.log)
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