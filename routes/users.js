var express = require('express');
var router = express.Router();
var authenticated = require('../config/authenticated');

const user_controller = require('../controllers/userController');

router.get('/create', user_controller.user_create_get);
router.post('/create', user_controller.user_create_post);

// GET request to update User.
router.get('/update', authenticated, user_controller.user_update_get);
router.post('/update', authenticated, user_controller.user_update_put);
// GET request for one User.
router.get('/profile', authenticated, user_controller.user_detail);

module.exports = router;