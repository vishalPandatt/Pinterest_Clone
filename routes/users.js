const mongoose = require('mongoose');
const plmImport = require('passport-local-mongoose');
const plm = typeof plmImport === 'function' ? plmImport : (plmImport.default || plmImport);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  dp: {
    type: String,
    default: 'default-avatar.png',
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
}, { timestamps: true });

userSchema.plugin(plm);


module.exports = mongoose.model('User', userSchema);

