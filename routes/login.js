var express = require('express');
var router = express.Router();
var auth_controller = require('../controllers/authController');

/* GET users listing. */
router.get('/', auth_controller.login_get);

router.post('/', auth_controller.login_post);

module.exports = router;