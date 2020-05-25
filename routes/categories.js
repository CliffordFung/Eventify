var express = require('express');
var router = express.Router();

const category_controller = require('../controllers/categoryController');

router.post('/get_events', category_controller.get_events_by_category_post);

module.exports = router;