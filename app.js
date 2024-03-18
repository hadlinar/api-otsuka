const compression = require('compression')
const express = require("express");
const cors = require("cors");
const app = express()
const { Client } = require('pg')

const pnRoute = require('./route/PN')
const stockRoute = require('./route/Stock')

const userRoute = require('./route-ediscount/User')
const loginRoute = require('./route-ediscount/Login')
const PDKRoute = require('./route-ediscount/PDK')

const postDTMS = require('./route-ediscount/PostDTMS')

const poolDB = require('./config/database')

app.use(compression())
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended:true
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTION, PUT, PATCH, DELETE, HEAD"
    )
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

app.use(pnRoute)
app.use(stockRoute)

app.use(userRoute)
app.use(loginRoute)
app.use(PDKRoute)

const http = require('http')

const port = 3000

var connectionURL = 'postgres://tekinfo:apps2022!@170.1.70.67:5432/ediscount'

const client = new Client ({
    connectionString: connectionURL
})

client.connect((err, client) => {
    let payload
    if (err) {
        console.log("Error when connecting database: ", err)
    } else {
        client.on('notification', (msg) => {
            payload = JSON.parse(msg.payload)
            postDTMS.postDTMS(payload)
        })
        client.query("LISTEN update_dtms")
    }
})

app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});

const hostname = '127.0.0.1'


http.createServer(app).listen(port, () => {
    console.log(`Server running at on port ${port}`);
});