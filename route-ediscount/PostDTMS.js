const oracledb = require('oracledb')
const db = require('../config/database.js');

async function postDTMS(payload) {

    let connection

    let queryDB = `
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
            TOTAL_DISC
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
                '${payload.total_disc}'
            );
        END;
    `

    try {

        connection = await oracledb.getConnection(db.oracle)

        await connection.execute(queryDB,  [], { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true})

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

        let queryDB = `
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
                TOTAL_DISC
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
                    '${payload[e].total_disc}'
                );
            END;
        `

        try {

            connection = await oracledb.getConnection(db.oracle)

            await connection.execute(queryDB,  [], { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true})

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