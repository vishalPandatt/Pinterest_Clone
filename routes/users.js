const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password:{
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
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
    default: '',
  },
  posts: [],
}
);


module.exports = mongoose.model('User', userSchema);
