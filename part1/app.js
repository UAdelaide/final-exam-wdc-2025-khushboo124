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

//API Routes

// api/dogs
app.get('/api/dogs', async (req, res) =>{
    try {
        const [rows] = await pool.execute(`
            SELECT
                d.name AS dog_name,
                d.size,
                u.username AS owner_username
            FROM
                Dogs d
            JOIN
                Users u ON d.owner_id = u.user_id;
        `);
        res.json(rows);

    } catch (error) {
        console.error('Error Fetching Dogs:', error);
        res.status(500).json({ message: 'Server Internal Error', error: error.message });
    }
});

app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT
                wr.request_id,
                d.name AS dog_name,
                wr.requested_time,
                wr.duration_minutes,
                wr.location,
                u.username AS owner_username
            FROM
                WalkRequests wr
            JOIN
                Dogs d ON wr.dog_id = d.dog_id
            JOIN
                Users u ON d.owner_id = u.user_id
            WHERE
                wr.status = 'open';
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error Fetching Open Walk Requests:', error);
        res.status(500).json({ message: 'Internal Error of Server'});
    }
});

app.get('/api/walkers/summary', async (req, res) => {
    try {
    const [rows] = await pool.execute(`
        SELECT
            u.username AS walker_username,
            COUNT(r.rating_id) AS total_ratings,
            ROUND(AVG(r.rating), 1) AS average_rating,
            COUNT(DISTINCT CASE WHEN wr.status = 'completed' THEN wr.request_id END) AS completed_walks
        FROM Users u
            LEFT JOIN WalkApplications a ON u.user_id = a.walker_id
            LEFT JOIN WalkRequests wr ON a.request_id = wr.request_id
            LEFT JOIN WalkRatings r ON wr.request_id = r.request_id
        WHERE u.role = 'walker'
        GROUP BY u.username
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed Fetching Walker Summary.' });
    }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
