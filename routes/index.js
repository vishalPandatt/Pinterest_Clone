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
    res.send(createdUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/createPost", async function(req, res){
  let createdPost = await PostModel.create({
    postText: "Hello, this is a sample post."
  });
  res.send(createdPost); 
});

module.exports = router;
