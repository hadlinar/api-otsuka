const express = require("express");
const router = express.Router();
const Stock = require('../controller/Stock');

router.get(`/otsuka/stock`, async (req,res) => {
    let stock = await new Stock().getStock()
    return res.status(200).json({
        "result": stock
    })
});

module.exports = router;