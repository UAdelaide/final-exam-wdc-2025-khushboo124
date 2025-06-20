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
    database: DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initializeDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            multipleStatements: true
        });

        console.log('Connected to Mysql server for database initialization.');

        const sqlScript = await fs.readFile('./dogwalks.sql', 'utf8');

        const sqlScript = await fs.readFile('./dogwalks.sql', 'utf8');

        await connection.query(sqlScript);

        console.log('Database initialised and populated successfully from dogwalks.sql file');

    } catch (error){
        console.error('Database initialisation Failed! Ensure mysql server is running.');
        console.error('Error details: ', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }

}

//Middleware setup Express

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
