const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  score: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Stat', statSchema);
