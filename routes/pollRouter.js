var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var Verify=require('./verify');
var Polls=require('../models/polls');
var ipInfo=require("ipinfo");

var pollRouter=express.Router();
pollRouter.use(bodyParser.json());

pollRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req, res){

  if(req.decoded){
    var search={$or: [{public: true}, {createdBy: req.decoded._doc._id}]};
  }
  else{
    var search={public: true};
  }

  Polls.find(search, function(err, poll){
    if (err) throw err;
    var poll=poll.map(function(poll){return {'question':poll.question, id: poll._id}})

    console.log(req.decoded);
  //  res.json(poll);
    if(req.decoded){
      var user=req.decoded._doc.username
    }
    else{
      var user=null;
    }

    res.render('myPolls', {polls: poll, name: user});

  });
})
.post(Verify.verifyOrdinaryUser,function(req,res,next){
  console.log(req.body);
  var ops=req.body.option;

  var ans=ops.map(function(item){
    return {"option": item, "votes": 0}
  });
  req.body.answers=ans;
  req.body.public!=req.body.public;
  req.body.createdBy=req.decoded._doc._id;
  Polls.create(req.body, function(err, poll){
    if(err) throw err;
    console.log('Poll created');
    var id=poll._id;
    res.send({redirect: '/polls'});
  })
})

pollRouter.route('/:id')
.get(Verify.verifyOrdinaryUser,function(req, res){
  if(req.decoded){
    var user=req.decoded._doc.username;
  }
  else{
    var user=null;
  }
  res.render('viewPoll', {name: user});
})

.post(function(req,res){

  ipInfo(function(err, cLoc){
    var ip=cLoc.ip;
    console.log(ip)

    Polls.findById(req.params.id, function(err,poll){
      if(err) throw err;
      var arr=poll.answers;
      var j=arr.filter(function(item, i){

        return item.option==req.body.vote;

      });
      var voters=poll.voters.map(function(item){
        return item.ip;
      });
  //  console.log(poll.answers[0])
      poll.answers.id(j[0]._id).votes+=1;
      if(voters.indexOf(ip)<0){
        console.log("Ip: "+ip)
        poll.voters.push({ip: ip});
      }
      poll.save(function(err,poll){
        if(err) throw err;
        var add='/polls/'+String(j[0]._id);

        res.redirect(req.get('referer'));
      });

    });
  });
});

pollRouter.route('/polls/:id')
.get(function(req,res){
  //Polls.findById(req.params.id, function(err, poll){
  //  if(err) throw err;
  //  res.json(poll);
  //});
  Polls.findById(req.params.id)
  .populate('createdBy')
  .exec(function(err,poll){
    if(err) throw err;
    res.json(poll);
  })
});

module.exports=pollRouter;
