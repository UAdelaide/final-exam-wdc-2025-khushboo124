var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');
var fs = require('fs').promises;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// Hardcoded just for example, needs to be present in .env file //
const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASSWORD = '';
const DB_DATABASE = 'DogWalkService';

const pool = mysql.createPool ({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    da
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
