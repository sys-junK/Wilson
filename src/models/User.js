const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  lastDaily: {
    type: Date,
    required: true,
  },
  bank: {
    hasAccount: { type: Boolean, default: false },
    createdAt: { type: Date },
  },
  bankBalance: {
    type: Number,
    default: 0,
  },
});

module.exports = model('User', userSchema);