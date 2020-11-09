const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  passport.use(new FacebookStrategy({
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_API_SECRET,
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ['id', 'email', 'name'],
      passReqToCallback: true,
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  ));
  // load up the user model


  // const opts = {};
  // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
  // opts.secretOrKey = "secret";
  // passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  //   User.findOne({id: jwt_payload.id}, function(err, user) {
  //         if (err) {
  //             return done(err, false);
  //         }
  //         if (user) {
  //             done(null, user);
  //         } else {
  //             done(null, false);
  //         }
  //     });
  // }));
}