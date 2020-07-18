const express = require('express');
const bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');

var path = require('path');
const cors = require('cors');
require("./middleware/jwt");
var passport = require('passport');
const errorHandler = require('./middleware/errorhandler');
require('./config/connection');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());
app.use(errorHandler);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
const port = process.env.port || "3000";
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//CORS Solution
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, OPTIONS, PUT');
    next();
});
const api = require('./routes/api');
app.use('/', api);

app.listen(port, () => {
    console.log(`server is running on port ${port}.`)
})