var express = require('express');
var router = express.Router();
const UserModel = require('./users');
const PostModel = require('./posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
