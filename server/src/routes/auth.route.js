const express = require('express');
const { authLogin, authLogout, authRegister, authStatus } = require('../controllers/auth.controller');
const userMiddleware = require('../middlewares/userMiddleware'); // ✅ make sure this path and name match

const app = express.Router();

// Register
app.post('/register', authRegister);

// Login
app.post('/login', authLogin);

// Logout
app.post('/logout', authLogout);

// Check Auth status
app.get('/me', userMiddleware, authStatus);

module.exports = app;
