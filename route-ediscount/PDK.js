const express = require("express");
const router = express.Router();
const PDK = require('../controller-ediscount/PDK');
const jwt = require('jsonwebtoken')

router.get(`/otsuka/ediscount/list/process`, verifyToken, (req,res) => {
    
    jwt.verify(req.token, process.env.SECRET_KEY,async (err,authData)=>{
        let branch = req.body.branch
        let cat = req.body.cat
        let role = req.body.role

        try {
            const list = await new PDK().listPDK(branch, cat, role);
            res.status(200).json({
                "message": "ok",
                "result": list.rows
            })
        } catch(err) {
            console.log(err);
            res.status(500).json({
                error: "Database error",
            });
        }
    });
});


router.get(`/otsuka/ediscount/list/done`, verifyToken, (req,res) => {
    
    jwt.verify(req.token, process.env.SECRET_KEY,async (err,authData)=>{
        let branch = req.body.branch
        let cat = req.body.cat
        let role = req.body.role

        try {
            const list = await new PDK().donePDK(branch, cat, role);
            res.status(200).json({
                "message": "ok",
                "result": list.rows
            })
        } catch(err) {
            console.log(err);
            res.status(500).json({
                error: "Database error",
            });
        }
    });
});

router.post(`/otsuka/ediscount/approve/:id/:det`, verifyToken, (req,res) => {
    let id = req.params.id
    let idDet = req.params.det

    let desc = req.body.desc
    let date = req.body.date
    let role = req.body.role
    let cat = req.body.cat
    let branch = req.body.branch
    let disc = req.body.disc
    
    jwt.verify(req.token, process.env.SECRET_KEY, async (err,authData)=>{

        try {
            let appr = await new PDK().approvePDK(authData.username, desc, date, role, id, cat, branch, disc, idDet);
            if (appr.rows[0].f_upt_appr == 'UPDATED') {
                res.status(200).json({
                    "message": "updated"
                })
            } else {
                res.status(409).json({
                    "message": "error while updating database"
                })
            }
        } catch(err) {
            res.status(500).json({
                message: 'Failed to authenticate token'
           });

           res.status(403).json({
               message: "Session time out",
           });
        }
    });
});

router.post(`/otsuka/ediscount/reject/:id`, verifyToken, (req,res) => {
    let id = req.params.id

    let desc = req.body.desc
    let date = req.body.date
    let role = req.body.role
    let cat = req.body.cat
    let branch = req.body.branch
    
    jwt.verify(req.token, process.env.SECRET_KEY,async (err,authData)=>{

        try {
            let reject = await new PDK().rejectPDK(authData.username, desc, date, role, id, cat, branch)
            if (reject.rows[0].f_upt_reject == 'REJECTED') {
                res.status(200).json({
                    "message": "rejected"
                })
            } else {
                res.status(409).json({
                    "message": "error while updating database"
                })
            }
        } catch(err) {
            res.status(500).json({
                message: 'Failed to authenticate token'
           });

           res.status(403).json({
               message: "Session time out",
           });
        }
    });
})

function verifyToken(req, res, next) { 
    const bearerHearder = req.headers['authorization'];
    if(typeof bearerHearder != 'undefined'){
        const bearer = bearerHearder.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();  
    } else {  
        res.sendStatus(403);  
    }  
}

module.exports = router;