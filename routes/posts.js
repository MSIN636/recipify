var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('mongodb://Recipify:MSIN636!@ds229474.mlab.com:29474/recipify');

var multer=require('multer');
var upload = multer({ dest: 'public/images/uploads/' })

router.get('/show/:id', function(req, res, next) {
  var db =req.db;
  var posts= db.get('posts');
  posts.findOne({_id: req.params.id}, function(err,posts){
    res.render('show', {post:posts});
  })
});

/* GET home page. */
router.get('/add', function(req, res, next) {
  var categories = db.get('categories');

  categories.find({},{}, function(err,categories){
      res.render('addpost', { title: 'Add Post', categories: categories});
  })
});

router.get('/delete/:id', function(req, res, next) {
    var posts=db.get('posts');
    posts.remove({_id: req.params.id})
    req.flash('success', 'Post Deleted');
    res.location('/');
    res.redirect('/');
});

router.post('/add',upload.single('mainimage'), function(req,res,next){
  //get form values
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category;
  var author = req.body.author;
  var date = new Date();

  if(req.file){

    var mainImageOriginalName = req.file.originalname;
    var mainImageName = req.file.filename;
    var mainImageMime = req.file.mimetype;
    var mainImagePath = req.file.path;
    var mainImageExt = req.file.extension;
    var mainImageSize = req.file.size;
  }else{
    var mainImageName = 'noimage.jpg';
  }

 req.checkBody('title', 'Title field is requires').notEmpty();
 req.checkBody('body', 'body field is requires').notEmpty();
 var errors = req.validationErrors();
 if(errors){
    var categories = db.get('categories');
    categories.find({},{}, function(err,categories){
       res.render('addpost', {errors:errors, title:title, categories:categories})
   })

 }else{
    var posts=db.get('posts');
    posts.insert({
      "title":title,
      "body":body,
      "category":category,
      "date":date,
      "author":author,
      "mainimage":mainImageName
    }, function(err,post){
      if(err) {
        res.send('Error!!');
      }
      else{
        req.flash('success', 'Post Submitted');
        res.location('/');
        res.redirect('/');
      }
    });
 }
})


router.post('/addcomment', function(req,res,next){
  //get form values
  var name = req.body.name;
  var email = req.body.email;
  var body = req.body.body;
  var postid = req.body.postid;
  var commentdate = new Date();
 console.log(name,email,body)
 req.checkBody('name', 'Name field is requires').notEmpty();
 req.checkBody('email', 'Email field is requires').notEmpty();
 req.checkBody('email', 'Email is not formatted correctly').isEmail();
 req.checkBody('body', 'Body field is requires').notEmpty();
 var errors = req.validationErrors();
 if(errors){
        var posts = db.get('posts');
        posts.findOne({_id:postid}, function(err,posts){
          console.log(posts);
           res.render('show', {errors:errors, post:posts})
       });
 }else{
        var comments = {"name":name, "email":email, "body":body, "commentdate":commentdate}
        var posts = db.get('posts');
        posts.update({"_id":postid},{$push:{comments}}, function(err,doc){
                if(err){
                      throw err;
                }else{
                  req.flash('success', 'Comment Added');
                  res.location('/posts/show/'+postid);
                  res.redirect('/posts/show/'+postid);

                }
        });
      }
});
module.exports = router;
