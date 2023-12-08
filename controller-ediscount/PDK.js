const db = require('../config/database.js');
const postDTMS = require('../route-ediscount/PostDTMS.js')
const oracledb = require('oracledb')

class PDK {

    async listPDK(branch, cat, role){
        let branchAgg = ''
        cat = cat.length == 2 ? "('S', 'U')" : "('" + cat[0] + "')"
        if(branch.length > 1) {
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
        WHERE ${role == 3 ? `` : `branch_id in ${branchAgg} AND`} kategori_otsuka in ${cat} AND no_register IS NULL AND final_status IS NULL AND
        user_approve_${role} IS NULL AND ${role == 1 ? 'maker' : `user_approve_${role-1}`} IS NOT NULL
        ORDER BY date ASC`).catch(console.log)

        return results
    };

    async donePDK(branch, cat, role) {
        let branchAgg = ''
        cat = cat.length == 2 ? "('S', 'U')" : "('" + cat[0] + "')"
        if(branch.length > 1) {
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
        WHERE ${role == 3 ? `` : `branch_id in ${branchAgg} AND`} kategori_otsuka in ${cat} AND user_approve_${role} IS NOT NULL ${role == 2 || role == 4 ? `AND level != 9` : ''}
        ORDER BY date ASC`).catch(console.log)

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

    async postDTMS() {
        let res = await db.pool2.query(
            `SELECT p.no_register, p.branch_id, p.kategori_otsuka, p.kode_pelanggan, p.supplier_id, p.no_draft, kode_barang, qty, hna, total_sales, percent_disc_rn, percent_disc_outlet, percent_disc_konversi, total_disc, f_get_date_appr(p.level, p.no_draft) date_approved
            FROM trn_pdk as p, trn_detail_pdk
            WHERE p.id = id_ref AND no_register IS  NOT NULL AND maker != 'maker'`).catch(console.log)

        postDTMS.manualPostDTMS(res.rows)
        

        return res.rows
    }

};

module.exports = PDK;