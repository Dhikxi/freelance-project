const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const gigRoutes = require('./routes/gig.route');
const orderRoutes = require('./routes/order.route');
const conversationRoutes = require('./routes/conversation.route');
const messageRoutes = require('./routes/message.route');
const reviewRoutes = require('./routes/review.route');
const projectRoutes = require('./routes/project.route');

dotenv.config();

const app = express();

// ✅ CORS: Allow frontend at http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Required for cookies/auth headers
}));

app.use(express.json());
app.use(cookieParser());
const path = require('path');
 
// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/projects', projectRoutes);

// ✅ Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('🟢 Connected to MongoDB');
}).catch((err) => {
  console.error('🔴 MongoDB connection error:', err);
});

// ✅ Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
