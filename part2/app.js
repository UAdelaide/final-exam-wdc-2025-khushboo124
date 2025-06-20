const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session') //added
const app = express();

// Middleware
//added//
// app.use(session({
//     secret: 'mykey',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false}
// }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;