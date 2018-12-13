var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('mongodb://Recipify:MSIN636!@ds229474.mlab.com:29474/recipify');

router.get('/add', function(req, res, next) {
  var categories = db.get('categories');
  categories.find({},{},function(err,categories){
    res.render('addcategory', {title:"Add Category", categories: categories});
  });
});

router.get('/delete/:id', function(req, res, next) {
  var categories = db.get('categories');
    categories.remove({_id: req.params.id})
    req.flash('success', 'Category Deleted');
    res.location('/categories/add');
    res.redirect('/categories/add');
});


router.get('/show/:category', function(req, res, next){
var db = req.db;
var posts = db.get('posts');
posts.find({category: req.params.category},{},  function(err, posts){
  res.render('index', {title: req.params.category, posts: posts})
})

});

router.post('/add', function(req, res, next){
var title = req.body.title;
 req.checkBody('title', 'title field id required').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    var categories = db.get('categories');
    categories.find({},{},function(err,categories){
      res.render('addcategory', {title:"Add Category", errors: errors, categories: categories});
    });
  }else{
    var categories = db.get('categories');
    categories.insert({"title" : title}, function(err,category){
        req.flash('success', 'Category Submitted');
        res.location('/categories/add');
        res.redirect('/categories/add');
    });
  }
  });




module.exports = router;
