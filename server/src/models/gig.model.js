const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  totalStars: {
    type: Number,
    default: 0,
  },
  starNumber: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  shortTitle: {
    type: String,
    required: true,
  },
  shortDesc: {
    type: String,
    required: true,
  },
  deliveryTime: {
    type: String,
    required: true,
  },
  revisionNumber: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
  },
  sales: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false,
  timestamps: true
});

module.exports = mongoose.model('Gig', gigSchema);
