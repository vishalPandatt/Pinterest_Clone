var express = require('express');
var router = express.Router();
const UserModel = require('./users');
const PostModel = require('./posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/allUsersPosts', async function(req, res, next) {
//   let user = await UserModel.findOne({_id: "6a6395575dfedf52091f84e7"});
//   await user.populate('posts');
//   res.send(user)
// });


// router.get("/createUser", async function(req, res) {
//   try {
//     const createdUser = await UserModel.create({
//       username: "vishal",
//       password: "vishal123",
//       fullName: "Vishal Vashishth",
//       email: "vishal@example.com",
//       dp: '',
//       posts: [],
//     });
//     res.send(createdUser);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// router.get("/createPost", async function(req, res){
//   let createdPost = await PostModel.create({
//     postText: "Hello, this is a sample post.",
//     user: "6a6395575dfedf52091f84e7",
//   });
//   let user = await UserModel.findOne({_id: "6a6395575dfedf52091f84e7"});
//   user.posts.push(createdPost._id);
//   await user.save();
//   res.send(createdPost);
// });

router.get("/register", async function(req, res){
  const { username, email, password, fullname } = req.body;
const userData = new userModel({ username, email, password, fullname });

userModel.register(userData, req.body.password,)
.than(function(){
  passport.authenticate("local")(req, res, function(){
    res.redirect("/profile");
  });
});
});

module.exports = router;
