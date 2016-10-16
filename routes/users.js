var express = require('express');
var router = express.Router();
var passport=require('passport');
var User=require('../models/user');
var Verify=require('./verify');


//mounted at localhost:3000/users

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req,res){
  console.log(req.body)
  User.register(new User({username: req.body.username}), req.body.password, req.body.email, function(err,user){
    if (err){
      return res.status(500).json({err: err})
    }
//    passport.authenticate('local')(req,res, function(){
//      return res.status(200).json({status: 'Registration successful'});
//    });
    req.logIn(user, function(err){
      if(err){
        return res.status(500).json({err: 'Could not log in user'});
      }

      var token=Verify.getToken(user);
      res.cookie('auth', token)
      //res.status(200).json({
      //  status: 'Login successful',
      //  success: true,
      //  token: token
      //});
      res.send({redirect: '/polls'});

    });

  });
});

router.post('/login', function(req,res,next){
  passport.authenticate('local', function(err,user, info){
    if(err){
      return next(err);
    }
    if(!user){
      return res.status(401).json({err: info});
    }

    req.logIn(user, function(err){
      if(err){
        return res.status(500).json({err: 'Could not log in user'});
      }

      var token=Verify.getToken(user);
      res.cookie('auth', token)
    //  res.status(200).json({
    //    status: 'Login successful',
    //    success: true,
    //    token: token
    //  });
      res.send({redirect: '/myPolls'});
    });
  })(req,res,next);
});

router.get('/logout', function(req,res){
  req.logout();
  res.clearCookie("auth");
//  res.status(200).json({
//    status: 'Bye'
//  });
  res.redirect('..')
});


// Facebook login
router.get('/facebook', passport.authenticate('facebook'), function(req, res){});

router.get('/facebook/callback', function(req,res,next){
  passport.authenticate('facebook', function(err, user, info){
    if(err){
      return next(err);
    }
    if(!user){
      return res.status(401).json({err: info});
    }
    req.logIn(user, function(err){
      if(err){
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      var token=Verify.getToken(user);
      res.cookie('auth', token);
      res.redirect('/myPolls');
    });
  })(req,res,next);
});

module.exports = router;
