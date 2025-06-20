const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
    if(!req.session.user) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const owner_id = req.session.user.user_id;
    try {
        const [rows] = await db.query (
            'SELECT dog_id, name, size FROM Dogs WHERE owner_id = ?', [owner_id]
        );
        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: "failed to fetch dogs!" });
    }
})
