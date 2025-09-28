const express = require('express');
const { userMiddleware } = require('../middlewares');
const { createGig, deleteGig, getGig, getGigs } = require('../controllers/gig.controller');
const Gig = require('../models/gig.model');

const app = express.Router();

app.post('/', userMiddleware, createGig);
app.delete('/:_id', userMiddleware, deleteGig);
app.get('/single/:_id', getGig);
app.get('/', getGigs);

// ✅ Fetch active gigs for a specific user
app.get('/user/:userID', async (req, res) => {
    try {
      const gigs = await Gig.find({ userID: req.params.userID, isActive: true });
      res.send(gigs);
    } catch (err) {
      res.status(500).send({ error: true, message: err.message });
    }
  });
  

module.exports = app;
