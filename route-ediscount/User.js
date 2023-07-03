const express = require("express");
const router = express.Router();
const User = require('../controller-ediscount/User');
const jwt = require('jsonwebtoken')

router.get(`/otsuka/ediscount/user`, verifyToken, (req,res) => {
    
    jwt.verify(req.token, process.env.SECRET_KEY,(err,authData)=>{
        try {
            let user = new User().user();
            user.then(function(result) {
                res.status(200).json({
                    "message": "ok",
                    "result": result.rows[0]
                })
                
            })
        } catch(e) {

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