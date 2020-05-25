var User = require('../models/user')
var async = require('async')
var passport = require('passport');
var flash = require('connect-flash')
var session = require('express-session')


exports.login_get = function(req, res, next) {
    res.render('login', { title: 'login' });
};

exports.login_post = function(req, res, next){    
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

exports.logout = function(req, res){
    req.logout();
    res.redirect('/login');
}