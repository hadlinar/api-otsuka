const express = require("express")
const router = express.Router()
const User = require('../controller-ediscount/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../config/database.js')

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

router.post(`/otsuka/ediscount/change-name`, verifyToken, (req,res) => {
    let name = req.body.name
    
    jwt.verify(req.token, process.env.SECRET_KEY,async (err,authData)=>{
        try {
            const user = await new User().user(authData.username);
            if (user.rows.length === 0) {
                res.status(504).json({
                    error: "User not found"
                })
            } else {
                db.pool2.query(`UPDATE mst_user SET nama = $2 WHERE username = $1`, [user.rows[0].username, name], (err) => {
                    if(err) {
                        flag = 0
                        console.log(err)
                        return res.status(500).json({
                            error: "Database error"
                        })
                    } else {
                        res.status(200).json({
                            "message": "name has been changed"
                        })
                    }
                })
            }
        } catch(err) {
            console.log(err);
            res.status(500).json({
                error: "Database error",
            });
        }
    });
});

router.post('/otsuka/ediscount/change-password', verifyToken, async (req, res) => {
    const password = req.body.password;
    const newPass = req.body.newPassword;
    const retype = req.body.retype;

    jwt.verify(req.token, process.env.SECRET_KEY,async (err,authData)=>{

        try {
            const user = await new User().user(authData.username)
            var flag  =  1; 
            bcrypt.compare(password, user.rows[0].password_mobile, (err, result) => {  
                if (err) {
                    res.status(500).json({
                        error: "Internal server error",
                    });
                } else if (result == true) { 
                    if(newPass != retype) {
                        res.status(420).json({
                            error: "New password is not matched"
                        })
                    } 
                    else {
                        bcrypt.hash(newPass, 10, (err, hash) => {
                            if (err)
                                res.status(500).json({
                                    error: "Database error",
                                });
                                db.pool2.query(`UPDATE mst_user SET password_mobile = $2 WHERE username = $1`, [user.rows[0].username, hash], (err) => {
                                    if(err) {
                                        flag = 0
                                        console.log(err)
                                        return res.status(500).json({
                                            error: "Database error"
                                        })
                                    } else {
                                        flag = 1
                                    }
                                })
                            if (flag) {
                                const token = jwt.sign(
                                    {username: user.rows[0].username},
                                    process.env.SECRET_KEY
                                )
                                res.status(200).json({
                                    message: "ok",
                                    token: token
                                })
                            }
                        });
                    }
                }
                else {
                    if (result != true)
                    res.status(403).json({
                        error: "Wrong password",
                    });
                }
            })
        } catch (err) {
            console.log("error")
            console.log(err);
            res.status(500).json({
                error: "Database error",
            });
        };
    })
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