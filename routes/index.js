var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware');

//GET /profile
router.get('/profile', mid.logInRequired ,  function(req, res, next) {
  
    User.findById( req.session.userId )
        .exec(function(error , user){
            if(error) {
              next(error);
            } else {
              var title = `${user.name} Profile`
              return res.render('profile' , { title : user.name ,
                                              name : user.name ,
                                              favorite : user.favoriteBook });
            }
        })

});

//GET /logout
router.get('/logout', function( req, res, next ) {
      if(req.session){
        req.session.destroy( function( err ){
                if(err){
                  return next(err) ;
                }else{
                  return res.redirect('/');
                }
        });
      }
});

//GET /login
router.get('/login', mid.loggedOut ,function(req, res, next) {
  return res.render('login' , {title : 'Log In'});
});

//Post /login
router.post('/login', function(req, res, next) {
    if( req.body.email && req.body.password ){
        User.authenticate(req.body.email , req.body.password , function(error , user){
            if( error || !user){
               var err = new Error('Wrong Email or password');
               err.status = 401 ;
               return next(err);
             }else{
               console.dir(user)
               req.session.userId = user._id ;
               res.redirect('/profile');
             }
        });
    }else{
      var err = new Error('Email and password are required ! ');
      err.status = 401 ;
      next(err);
    }
});

//GET /register
router.get('/register',  mid.loggedOut ,function(req, res, next) {
  return res.render('register' , {title : 'Sign Up'});
});

//POST /register
router.post('/register', function(req, res, next) {
    if(req.body.email &&
       req.body.name  &&
       req.body.favoriteBook &&
       req.body.password  &&
       req.body.confirmPassword ){

          if(req.body.password !== req.body.confirmPassword ){
            var err = new Error('Passwords Do not match .');
            err.status = 400 ;
            return next(err);
          }

          var userData = {
            email : req.body.email ,
            name : req.body.name ,
            favoriteBook : req.body.favoriteBook ,
            password : req.body.password
          }

          User.create(userData ,(err ,user) => {
             if(err){
                next(err);
             }else{
                console.dir(user)
                req.session.userId = user._id ;
                res.redirect('/profile');
             }
          });

       }else{
         var err = new Error('All Fields Required.');
         err.status = 400 ;
         return next(err);
       }
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
