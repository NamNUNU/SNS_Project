var express = require("express")
var app = express();
var router = express.Router();
var mysql = require("mysql")
var passport = require("passport")
var localStrategy = require("passport-local").Strategy;

// DATABASE SETTING
var connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "14858",
  database : "sns"
})
connection.connect();

router.get('/', function(req, res){
  res.render('login.ejs')
})

passport.serializeUser(function(user, done){
  console.log("passport session save :", user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("passport session get id :", id);
  done(null, id);
});


passport.use('local-login', new localStrategy({
    usernameField: 'email',
    passwordField: 'pw',
    passReqToCallback: true
  }, function(req, email, password, done){
    var query = connection.query('select * from user where email = ? and pw = ?', [email, password], function(err, rows){
      if(err) return done(err);
      if(rows.length){
          return done(null, {'email': email, 'id' :rows[0].id})
      }else{
          if(err) {throw err};
          return done(null, false, {'message':''});
      }
    })
  }
));

router.post('/', function(req, res, next){
  passport.authenticate('local-login',function(err, user, info){
    if(err) res.status(500).json(err);
    if(!user){return res.status(400).json(info.message);}

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json(user);
    });
  })(req, res, next);
})

module.exports = router;
