var User=require('../models/user');
var jwt=require('jsonwebtoken');

exports.getToken = function(user){
  return jwt.sign(user, process.env.secretKey, {
    expiresIn: 3600 //1 hour
  });
};


exports.checkStatus = function(req,res,next){
  var token=req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.auth;

  if(token){
    req.loggedin=true;
  }
  else{
    req.loggedin=false;
  }
  next();
}

exports.verifyOrdinaryUser = function(req,res,next){

  var token=req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.auth;

  if(token){

    jwt.verify(token, process.env.secretKey, function(err, decoded){
      if(err){
        //handles expired token
        if(err.message=="jwt expired"){
          req.logout();
          res.clearCookie("auth");
          next()
        }
        else{
        var err=new Error('You are not authenticated!');
        err.status=401;
        return next(err);
        }
      }
      else{
        req.decoded=decoded;
        next();
      }
    });
  }
  else{
    req.decoded=false;
    next();
  }
};
