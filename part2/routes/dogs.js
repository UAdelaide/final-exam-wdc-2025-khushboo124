const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
    if(!req.session.user) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const owner_id
})
