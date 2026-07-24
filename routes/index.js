var express = require('express');
var router = express.Router();
const UserModel = require('./users');
const PostModel = require('./posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get("/createUser", async function(req, res) {
  try {
    const createdUser = await UserModel.create({
      username: "vishal",
      password: "vishal123",
      fullName: "Vishal Vashishth",
      email: "vishal@example.com",
      dp: '',
      posts: [],
    });
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
