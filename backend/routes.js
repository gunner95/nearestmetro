var mongoose        = require('mongoose');
var User            = require('./model.js');

module.exports = function(app){

  app.get('/users',function(req,res){
    var query = User.find({}).limit(100);
    query.exec(function(err,users){
      if(err){
        res.send(err);
      }else{
        res.send(users);
      }

    });
  });
  app.get('/users2',function(req,res){
    var query = User.find({}).skip(100).limit(100);
    query.exec(function(err,users){
      if(err){
        res.send(err);
      }else{
        res.send(users);
      }

    });
  });

  app.post('/users',function(req,res){
    var newUser = new User(req.body);
    newUser.save(function(err){
      if(err){
        res.send(err);
      }
      else{
        res.json(req.body);
      }
    });
  });

  app.post('/query',function(req,res){
      var lat = req.body.latitude;
      var long = req.body.longitude;

      var query = User.find({});
      query  = query.where('location').near({
        center:{
          type:'Point',
          coordinates:[long,lat]
        },
        spherical:true
        // maxDistance:0.0015696123
      }).limit(1);
      query.exec(function(err,users){
        if(err){
          res.send(err);
        }
        else{
          console.log(users);
          res.json(users);
        }
      });
    });
  };
