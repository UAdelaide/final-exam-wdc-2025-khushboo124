const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session'); //added
const app = express();

const dogRoutes = require('./routes/dogRoutes');

// Middleware

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/api/dogs', dogRoutes);
app.use(session({
    secret: 'my-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const { truncateSync } = require('fs');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;