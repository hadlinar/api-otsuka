const express = require("express");
const router = express.Router();
const PDK = require('../controller-ediscount/PDK');
const jwt = require('jsonwebtoken')

router.get(`/otsuka/ediscount/process`, verifyToken, (req,res) => {
    let filter = req.query.filter

    jwt.verify(req.token, process.env.SECRET_KEY,async (err,authData)=>{
        try {
            const list = await new PDK().listPDK(authData.branch, authData.cat, authData.role, filter)
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


router.get(`/otsuka/ediscount/done`, verifyToken, (req,res) => {
    let filter = req.query.filter
    
    jwt.verify(req.token, process.env.SECRET_KEY,async (err,authData)=>{
        const list = await new PDK().donePDK(authData.branch, authData.cat, authData.role, filter)
        res.status(200).json({
            "message": "ok",
            "result": list.rows
        })
    });
});

router.get(`/otsuka/ediscount/detail/:id`, verifyToken,(req, res) => {
    let id = req.params.id

    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        try {
            const detail = await new PDK().detailPDK(id);
            res.status(200).json({
                "message": "ok",
                "result": detail.rows
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: "Database error"
            })
        }
    })
})

router.post(`/otsuka/ediscount/approve/:id/:det`, verifyToken, (req,res) => {
    let id = req.params.id
    let idDet = req.params.det

    let desc = req.body.desc
    let date = req.body.date
    let cat = req.body.cat
    let branch = req.body.branch
    let disc = req.body.disc
    
    jwt.verify(req.token, process.env.SECRET_KEY, async (err,authData)=>{
        try {
            let appr = await new PDK().approvePDK(authData.username, desc, date, authData.role, id, cat, branch, disc, idDet);
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
            let reject = await new PDK().rejectPDK(authData.username, desc, date, authData.role, id, cat, branch)
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

router.post('/otsuka/ediscount/post-dtms', async (req, res) => {
    try {
        const data = await new PDK().postDTMS()
       
        if (data.length == 0) {
            res.status(404).json({
                error: "No new PDK finished",
            });
        }
        else {
            res.status(200).json({
                message: "done migrated",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error",
        });
    };
});

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

module.exports = router