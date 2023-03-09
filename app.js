const compression = require('compression')
const express = require("express");
const cors = require("cors");
const app = express();

const pnRoute = require('./route/PN')
const stockRoute = require('./route/Stock')

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

const http = require('http')

const port = 3001

app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});

const hostname = '127.0.0.1'

http.createServer(app).listen(port, () => {
    console.log(`Server running at on port ${port}`);
});