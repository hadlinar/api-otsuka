const express = require("express");
const router = express.Router();
const PN = require('../controller/PN');

router.get(`/otsuka/so`, async (req,res) => {
    let date = req.query.date
    let month = req.query.month
    let year = req.query.year
    let tgl

    if(date !=  "") {
        tgl = `${year}-${month}-${date}`
        let pn = await new PN().getPNDate(tgl)
        return res.status(200).json({
            "result": pn
        })
    } 
    else if(date == "" && month != "") {
        let pn = await new PN().getPNMonth(month)
        return res.status(200).json({
            "result": pn
        })
    }
    else if(date == "" && month == "" && year != "") {
        let pn = await new PN().getPNYear(year)
        return res.status(200).json({
            "result": pn
        })
    }


    let pn = await new PN().getPNDate(date)
    return res.status(200).json({
        "result": pn
    })
});

module.exports = router;