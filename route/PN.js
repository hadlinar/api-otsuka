const express = require("express");
const router = express.Router();
const PN = require('../controller/PN');

router.get(`/otsuka/so`, async (req,res) => {
    let date = req.query.date
    let pn = await new PN().getPN(date)
    return res.status(200).json({
        "result": pn
    })
});

module.exports = router;