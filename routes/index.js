var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('mongodb://Recipify:MSIN636!@ds229474.mlab.com:29474/recipify');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db =req.db;
  var posts= db.get('posts');
  posts.find({},{ sort : { date : -1 } },function(err,posts){
    console.log('here');
    res.render('index', { title: 'Home', posts : posts});
  })
});

module.exports = router;
