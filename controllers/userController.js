var models = require('../models')
var async = require('async')
var bcrypt = require('bcryptjs')
var passport = require('../config/passport')
var moment = require('moment')

// Display detail of logged in User
exports.user_detail = function(req, res, next) {
        res.render('user_profile_detail', {title: 'User Detail', user: req.user, moment:moment } );
};

//used to test
/* GET users listing. */
exports.user_list = function(req, res, next) {
    models.User.findAll().then(function(users_list) {
        res.render('user_list', {title: 'User List', user_list: users_list });
    });
};

exports.user_create_get = function(req, res, next) {
    res.render('user_create_form', { title: 'Sign up' });
};

exports.user_create_post = function(req, res) {

    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const password2 = req.body.password2;
    const email = req.body.email;
    const dateOfBirth = req.body.dateOfBirth;
    const gender = req.body.gender;
    const city = req.body.city;
    const country = req.body.country;
    const bio = req.body.bio;
    
    req.checkBody('username', 'Username must not be empty.').notEmpty();
    req.checkBody('firstName', 'First name has non-alphanumeric characters').isAlpha();
    req.checkBody('firstName', 'First name must not be empty.').notEmpty();
    req.checkBody('lastName', 'Last name must not be empty.').notEmpty();
    req.checkBody('lastName', 'Last name has non-alphanumeric characters').isAlpha();
    req.checkBody('password', 'password must not be empty.').notEmpty();
    req.checkBody('password2', 'Passwords do not match.').equals(password);
    req.checkBody('email', 'Email must not be empty.').isEmail(),
    // req.checkBody('dateOfBirth', 'Date of birth must not be empty.').isDate();
    req.checkBody('gender', 'Gender must not be empty').notEmpty();
    req.checkBody('city', 'City must not be empty').notEmpty();
    req.checkBody('country', 'Country must not be empty').notEmpty();
    req.checkBody('username', 'user exists')

    req.sanitizeBody('*').escape();

    let errors = req.validationErrors();

    console.log(errors)

    if (errors) {
        console.log(errors)
        res.render('user_create_form', {
            errors: errors
        });
    } else {
        models.User.findOne( {
            where: {
                username: username
            }
        }).then(function(user) {
            if (user) {
                console.log('User exists already');
                req.flash('error_msg', 'User exists already');
                res.render('user_create_form');
            } else {
               var newUser = models.User.build({
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password,
                email: email,
                dateOfBirth: dateOfBirth,
                gender: gender,
                city: city,
                country: country,
                bio: bio
            });
            
            newUser.save().then(function(newUser){
                req.flash('success_msg', 'Registration success you can now login');
                res.redirect('/login');
            }).catch(function(error){
                console.log(error);
            });
        }
        });
    }
}; 

exports.user_update_get = function(req, res, next) {
    res.render('user_profile_form', {title: 'User Update', user: req.user } );
}


exports.user_update_put = function(req, res, next) {
    if(!req.user.validPassword(req.body.confirmPassword)){
        console.log('incorrect password');
        // throw new Error('PASSWORD NOT MATCH');
        res.status(404).send('Unauthorized Request, Please Check Password or Login')
    }
    models.User.update( {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        city: req.body.city,
        country: req.body.country,
        bio: req.body.bio
    }, {
        where: {
            id: req.user.id
        }
    }).then(function(User) {
        res.redirect('/users/profile');
    }).catch(function(error){
        console.log(error);
    });

}
