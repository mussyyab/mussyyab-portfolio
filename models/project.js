const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['ai', 'management', 'ecommerce'],
    default: 'management'
  },
  badge: {
    type: String,
    default: 'Featured Project'
  },
  description: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  liveUrl: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: 'Launch Live Demo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);