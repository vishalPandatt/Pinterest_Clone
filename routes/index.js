var express = require('express');
var router = express.Router();
const UserModel = require('./users');
const PostModel = require('./posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get("/createUser", function(req, res) {
  UserModel.create({
    username: "vishal",
    password: "vishal123",
    fullName: "Vishal Vashishth",
    email: "vishal@example.com",
    dp: {
      type: String,
      default: '',
    },
    posts: [],
  })
})
module.exports = router;
