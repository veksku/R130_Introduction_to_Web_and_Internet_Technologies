const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/201920Jan1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const preglediRoutes = require('./routes/pregledi');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/pregledi', preglediRoutes);

app.use(function (req, res, next) {
    const err = new Error('Pokušali ste da učitate stranicu koja ne postoji: ' + req.url);
    err.status = 404;

    next(err);
});

app.use(function (error, req, res, next) {
    console.error(error.stack);

    const statusCode = error.status || 500;
    res.status(statusCode).render('error.ejs', {
        errorMessage: error.message,
        errorCode: statusCode
    });
});

module.exports = app;