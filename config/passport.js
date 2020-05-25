const LocalStrategy = require('passport-local').Strategy;
const models = require('../models/');
const config = require('../config/config');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done) {
        //get username and match
        models.User.findOne( {
            where: {
                username: username
            }
        }
        ).then(function(user) {
            if (!user) {
                return done(null, false, {message: 'User not found.'});
            }
            //Match password
            if(!user.validPassword(password)){
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }));
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        models.User.findByPk(id).then(function(user){
            done(null, user);
        }).catch(function(err){
            if(err){
                throw err;
            }
        });
    });
}