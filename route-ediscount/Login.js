const express = require('express')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const db = require('../config/database.js')
const jwt = require('jsonwebtoken')
const Login = require('../controller-ediscount/Login.js')
const User = require('../controller-ediscount/User')

dotenv.config()

const router = express.Router()

router.post('/otsuka/ediscount/login', async (req, res) => {
    let listBranch = []

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
            bcrypt.compare(password, user[0].password_mobile, async (err, result) => {
                if (err) {
                    res.status(500).json({
                        error: "Server error",
                    });
                } else if (result === true) { 
                    const userDetail = await new User().user(user[0].role_id, username)
                    if(userDetail.rows.length > 1) {
                        for(let i=0; i < userDetail.rows.length; i++) {
                            listBranch.push(userDetail.rows[i].branch_id)
                        }
                    }
                    const token = jwt.sign({
                        username: username,
                        password: userDetail.rows[0].password_mobile,
                        nama: userDetail.rows[0].nama,
                        branch: userDetail.rows[0].branch_id.split(", "),
                        cat: userDetail.rows[0].kategori_otsuka.split(", "),
                        role: userDetail.rows[0].role_id,
                        flg_am: userDetail.rows[0].flg_am
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
                                {
                                    username: user.rows[0].username
                                },
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
        console.log(err);
        res.status(500).json({
            error: "Database error",
        });
    };
});

router.post('/otsuka/ediscount/logout', async (req, res) => {
    const token = req.headers["Authorization"]
    jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
        if(logout) {
            res.status(200).json({
                "message": "you've been logged out"
            })
        } else {
            res.status(500).json({
                error: "Internal error"
            })
        }
    })
})

module.exports = router;