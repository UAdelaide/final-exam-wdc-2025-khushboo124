const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
  try {
   if (!req.session.user){
    return res.status(401).json({ error: 'Not logged in'});
   }
   const ownerId = req.session.user.user_id;
   const [rows] = await db.query('Select dog_id, name AS dog_name, size FROM Dogs WHERE owner_id =?', [ownerId]);
   res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});
