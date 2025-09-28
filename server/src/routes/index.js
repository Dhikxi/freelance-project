const express = require('express');
const authRoutes = require('./auth.route');
const conversationRoutes = require('./conversation.route');
const gigRoutes = require('./gig.route');
const messageRoutes = require('./message.route');
const orderRoutes = require('./order.route');
const projectRoutes = require('./project.route');
const reviewRoutes = require('./review.route');

const router = express.Router();

// Route mount points
router.use('/auth', authRoutes);
router.use('/conversations', conversationRoutes);
router.use('/gigs', gigRoutes);
router.use('/messages', messageRoutes);
router.use('/orders', orderRoutes);
router.use('/projects', projectRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router; // ✅ Must export a Router instance
