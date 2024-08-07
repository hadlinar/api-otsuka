const oracledb = require('oracledb')
const db = require('../config/database.js');

async function postDTMS(payload) {

    let connection

    var queryDB = `
            BEGIN 
            INSERT INTO RN.TRN_PDK(
                NO_REGISTER,
                BRANCH_ID,
                KATEGORI_OTSUKA,
                KODE_PELANGGAN,
                SUPPLIER_ID,
                NO_DRAFT,
                KODE_BARANG,
                QTY,
                HNA,
                TOTAL_SALES,
                PERCENT_DISC_RN,
                PERCENT_DISC_OUTLET,
                PERCENT_DISC_KONV,
                TOTAL_DISC,
                DATE_APPROVED,
                DATE_MIGRATED
                ) VALUES(
                    '${payload.no_register}',
                    '${payload.branch_id}',
                    '${payload.kategori_otsuka}',
                    '${payload.kode_pelanggan}',
                    '${payload.supplier_id}',
                    '${payload.no_draft}',
                    '${payload.kode_barang}',
                    '${payload.qty}',
                    '${payload.hna}',
                    '${payload.total_sales}',
                    '${payload.percent_disc_rn}',
                    '${payload.percent_disc_outlet}',
                    '${payload.percent_disc_konversi}',
                    '${payload.total_disc}',
                    '${payload.date_approved}',
                    SYSDATE
                );
            END;
        `

    try {
        connection = await oracledb.getConnection(db.oracle)

        if(payload.maker != 'maker') {
            await connection.execute(queryDB,  [], { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true})
        }

    } catch (err) {
        console.error(err.message);
    } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error(err.message);
            }
        }
    } 
}

async function manualPostDTMS(payload) {

    let connection
    
    for(let e in payload) {

        // if(payload.maker != maker) {
            var queryDB = `
            BEGIN 
            INSERT INTO RN.TRN_PDK(
                NO_REGISTER,
                BRANCH_ID,
                KATEGORI_OTSUKA,
                KODE_PELANGGAN,
                SUPPLIER_ID,
                NO_DRAFT,
                KODE_BARANG,
                QTY,
                HNA,
                TOTAL_SALES,
                PERCENT_DISC_RN,
                PERCENT_DISC_OUTLET,
                PERCENT_DISC_KONV,
                TOTAL_DISC,
                DATE_APPROVED,
                DATE_MIGRATED
                ) VALUES(
                    '${payload[e].no_register}',
                    '${payload[e].branch_id}',
                    '${payload[e].kategori_otsuka}',
                    '${payload[e].kode_pelanggan}',
                    '${payload[e].supplier_id}',
                    '${payload[e].no_draft}',
                    '${payload[e].kode_barang}',
                    '${payload[e].qty}',
                    '${payload[e].hna}',
                    '${payload[e].total_sales}',
                    '${payload[e].percent_disc_rn}',
                    '${payload[e].percent_disc_outlet}',
                    '${payload[e].percent_disc_konversi}',
                    '${payload[e].total_disc}',
                    '${payload[e].date_approved}',
                    SYSDATE
                );
            END;
        `
        // } 

        try {

            connection = await oracledb.getConnection(db.oracle)

            if(payload.maker != 'maker') {
                await connection.execute(queryDB,  [], { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true})
            }

        } catch (err) {
            console.error(err.message);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err.message);
                }
            }
        }
    }
}

module.exports = {postDTMS, manualPostDTMS}