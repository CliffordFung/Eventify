var express = require('express');
var router = express.Router();
var authenticated = require('../config/authenticated');
var authController = require('../controllers/authController');
var user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', authenticated, function(req, res, next) {
    res.render('index', { title: 'Eventify', user: req.user});
});

router.get('/profile', authenticated, user_controller.user_detail);

router.get('/logout', authController.logout);

module.exports = router;