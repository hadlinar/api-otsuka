const express = require('express')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const db = require('../config/database.js')
const jwt = require('jsonwebtoken')
const Login = require('../controller-ediscount/Login.js')

dotenv.config()

const router = express.Router()

router.post('/otsuka/ediscount/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await new Login().login(username)
        const user = data.rows;
        if (user.length === 0) {
            res.status(404).json({
                error: "User is not registered",
            });
        }
        else {
            bcrypt.compare(password, user[0].password_mobile, (err, result) => { 
                if (err) {
                    res.status(500).json({
                        error: "Server error",
                    });
                } else if (result === true) { 
                    const token = jwt.sign({
                        username: username,
                    }, process.env.SECRET_KEY);
                    
                    res.status(200).json({
                        message: "ok",
                        token: token
                    });
                }
                else {
                    if (result != true)
                    res.status(401).json({
                        error: "Wrong password",
                    });
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error",
        });
    };
});

router.post('/otsuka/ediscount/change-password', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const newPass = req.body.newPassword;
    const retype = req.body.retype;

    try {
        const user = await new Login().user(username)
        var flag  =  1; 
        bcrypt.compare(password, user.rows[0].password, (err, result) => {  
            if (err) {
                res.status(500).json({
                    error: "Internal server error",
                });
            } else if (result == true) { 
                // if(newPass.length < 6 || newPass.length > 12) {
                //     res.status(422).json({
                //         error: "Kata sandi harus lebih dari 6 huruf dan kurang dari 12 huruf",
                //     });
                // }
                if(newPass != retype) {
                    res.status(420).json({
                        error: "Kata sandi baru tidak sama"
                    })
                } 
                else {
                    bcrypt.hash(newPass, 10, (err, hash) => {
                        if (err)
                            res.status(500).json({
                                error: "Database error",
                            });
                        db.pool2.query(`SELECT * FROM f_upt_pass($1, $2)`, [user.rows[0].username, hash], (err) => {
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
                    error: "Kata sandi salah",
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
});

module.exports = router;