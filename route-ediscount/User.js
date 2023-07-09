const express = require("express");
const router = express.Router();
const User = require('../controller-ediscount/User');
const jwt = require('jsonwebtoken')

router.get(`/otsuka/ediscount/user`, verifyToken, (req,res) => {
    
    jwt.verify(req.token, process.env.SECRET_KEY,async (err,authData)=>{
        try {
            const user = await new User().user(authData.username);
            if (user.rows.length === 0) {
                res.status(504).json({
                    error: "User not found"
                })
            } else {
                if (user.rows[0].branch_id == 0) {
                    const userOI = await new User().userOI(user.rows[0].role_id, authData.username)
                    if(userOI.rows != 0) { 
                        res.status(200).json({
                            "message": "ok",
                            "result": userOI.rows[0]
                        })
                    } else {
                        res.status(504).json({
                            error: "User not found"
                        })
                    }
                } else {
                    res.status(200).json({
                        "message": "ok",
                        "result": user.rows[0]
                    })
                }
            }
        } catch(err) {
            console.log(err);
            res.status(500).json({
                error: "Database error",
            });
        }
    });
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

module.exports = router;