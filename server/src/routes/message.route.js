const express = require('express');
const { userMiddleware } = require('../middlewares');
const { createMessage, getMessages } = require('../controllers/message.controller');
const app = express.Router();

// Create a message
app.post('/', userMiddleware, createMessage);

// Get all messages in a conversation
app.get('/:conversationID', userMiddleware, getMessages);

module.exports = app;
