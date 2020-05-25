var express = require('express');
var router = express.Router();
const event_controller = require('../controllers/eventController');
var authenticated = require('../config/authenticated');


router.get('/', authenticated, event_controller.my_events_get);

router.get('/create', authenticated,  event_controller.view_event_get);

router.post('/create', authenticated, event_controller.create_event_post);

router.get('/:id',authenticated, event_controller.event_detail_get);

router.post('/attend_user', event_controller.event_attend_user_post);

// Update Event
router.get('/:id/update', authenticated, event_controller.event_update_get);
router.post('/:id/delete', authenticated, event_controller.event_update_delete);


module.exports = router;