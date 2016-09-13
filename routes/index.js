var express = require('express');
var router = express.Router();
//var myPolls=require('./myPolls');
var Verify=require('./verify');

/* GET home page. */
router.get('/', Verify.verifyOrdinaryUser, function(req, res, next) {
  if(req.decoded){
    var user=req.decoded._doc.username;
  }
  else{
    var user=null;
  }
  res.render('home', {name: user});
});

router.get('/about', function(req,res){

  res.render('about')
})

router.get('/signup', function(req,res){
  res.render('signup')
})

router.route('/profile')
.get(Verify.verifyOrdinaryUser,function(req,res){
  console.log(req.decoded)
  res.render('profile', {name: req.decoded._doc.username});
});


router.get("/newPoll", function(req,res){
  res.render('newPoll')
})

//router.get('/myPolls', myPolls);

//router.get('/poll/(:id)', function(req,res){
//  res.render('viewPoll')
//})

//router.get('/polls/poll/(:id)', findPoll);

//router.post('/addNew', addNewPoll);

//router.post('/votePoll', votePoll);

//router.get('/proba', function(req,res){
//  res.render('viewPoll')
//})

module.exports = router;