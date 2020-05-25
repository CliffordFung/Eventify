var express = require('express');
var router = express.Router();

const models = require('../models/');
const resource_controller = require('../controllers/resourceController');
var authenticated = require('../config/authenticated');


router.get('/create', authenticated, resource_controller.view_resource_get);

router.post('/create', authenticated, resource_controller.create_resource_post);

module.exports = router;