const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  freelancerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ or 'Freelancer' if you have a separate model
    required: true,
  },
  gigID: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Gig',
  required: false, // changed from true
},

  buyerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
