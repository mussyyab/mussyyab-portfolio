const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['work', 'education', 'project'],
    default: 'work'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Timeline', timelineSchema);