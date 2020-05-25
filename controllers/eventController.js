var models = require('../models')
var moment = require('moment');
var async = require('async');
var request = require('request')
const {
    Op
} = require('sequelize');

exports.view_event_get = function (req, res, next) {

    models.Event.findAll({
        attributes: [
            'id',
            'eventName',
            'eventDate',
            'description',
            'eventAddress',
            'maxCapacity',
            'numberAttending',
            'status',
            'startTime',
            'endTime',
            'latitude',
            'longitude',
            'createdAt',
            'updatedAt',
            'hostId'
        ]
    }).then(events => {
        // console.log(events)
        res.json(events)
    }).catch(function (error) {
        console.log(error);
        res.status(500).send({
            error: 'Error retrieving events'
        });
    });

};



exports.create_event_post = function (req, res) {

    const eventName = req.body.eventName;
    const eventDate = req.body.eventDate;
    const description = req.body.description;
    const address = req.body.address;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const max_capacity = req.body.max_capacity;
    const hostId = req.user.id;

    const categoryList = req.body["categoryNames[]"]


    console.log('Before Eevent Build');
    var newEvent = models.Event.build({
        hostId: hostId,
        eventName: eventName,
        eventDate: eventDate,
        description: description,
        eventAddress: address,
        maxCapacity: max_capacity,
        numberAttending: 0,
        status: 'planned',
        startTime: eventDate + " " + startTime,
        endTime: eventDate + " " + endTime,
        latitude: latitude,
        longitude: longitude
    });

    newEvent.save().then(function (newEvent) {
        console.log('After Event Build');
        models.Category.findAll({
            attributes: [
                'id'
            ],
            where: {
                name: {
                    [Op.or]: categoryList
                }
            },
            raw: true
        }).then(categories => {
            console.log(categories)
            var eventCategoryList = []
            for (var i = 0; i < categories.length; i++) {
                categoryID = categories[i].id
                eventCategoryList.push(categoryID)
            }
            newEvent.setCategories(eventCategoryList);
        });

        eventID = newEvent['dataValues']['id']
        res.json({
            "eventID": eventID
        })
    }).catch(function (error) {
        console.log(error);
        res.status(500).send({
            error: 'Error saving event to database'
        });
    });
};

exports.my_events_get = function (req, res, next) {
    // Get User Hosted Events, Planned Events, and Past Events
    async.parallel({
        hostedEvents: function (callback) {
            models.Event.findAll({
                attributes: [
                    'id',
                    'eventName',
                    'eventDate',
                    'description',
                    'eventAddress',
                    'maxCapacity',
                    'numberAttending',
                    'status',
                    'startTime',
                    'endTime',
                    'latitude',
                    'longitude',
                    'createdAt',
                    'updatedAt',
                    'hostId'
                ],
                where: {
                    hostId: req.user.id
                }
            }).then(function (hostedEventsResult) {
                callback(null, hostedEventsResult);
            });
        },
        plannedEvents: function (callback) {
            models.Event.findAll({
                attributes: [
                    'id',
                    'eventName',
                    'eventDate',
                    'description',
                    'eventAddress',
                    'maxCapacity',
                    'numberAttending',
                    'status',
                    'startTime',
                    'endTime',
                    'latitude',
                    'longitude',
                    'createdAt',
                    'updatedAt',
                    'hostId'
                ],
                include: [{
                    model: models.User,
                    where: {
                        'id': req.user.id
                    }
                }],
                where: {
                    eventDate: {
                        [Op.gte]: moment().toDate()
                    },
                    startTime: {
                        [Op.gt]: moment().toDate()
                    },
                }
            }).then(function (plannedEventsResult) {
                callback(null, plannedEventsResult);
            });
        },
        pastEvents: function (callback) {
            models.Event.findAll({
                attributes: [
                    'id',
                    'eventName',
                    'eventDate',
                    'description',
                    'eventAddress',
                    'maxCapacity',
                    'numberAttending',
                    'status',
                    'startTime',
                    'endTime',
                    'latitude',
                    'longitude',
                    'createdAt',
                    'updatedAt',
                    'hostId'
                ],
                include: [{
                    model: models.User,
                    where: {
                        'id': req.user.id
                    }
                }],
                where: {
                    eventDate: {
                        [Op.lte]: moment().toDate()
                    },
                    startTime: {
                        [Op.lt]: moment().toDate()
                    },
                }
            }).then(function (pastEventsResults) {
                callback(null, pastEventsResults);
            });
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        res.render('myevents', {
            user: req.user,
            hostedEvents: results.hostedEvents,
            plannedEvents: results.plannedEvents,
            pastEvents: results.pastEvents
        })
    });
};

exports.event_detail_get = function (req, res, next) {

    models.Event.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'eventName',
            'eventDate',
            'description',
            'eventAddress',
            'maxCapacity',
            'numberAttending',
            'status',
            'startTime',
            'endTime',
            'latitude',
            'longitude',
            'createdAt',
            'updatedAt',
            'hostId'
        ]
    }).then(event => {
        models.User.findByPk(event.hostId)
            .then(host => {
                res.render('event_detail', {
                    user: req.user,
                    event: event,
                    moment: moment,
                    hostId: host.id
                });
            })
    }).catch(function (error) {
        console.log(error);
    });
};

exports.event_update_get = function (req, res, next) {
    models.Event.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'eventName',
            'eventDate',
            'description',
            'eventAddress',
            'maxCapacity',
            'numberAttending',
            'status',
            'startTime',
            'endTime',
            'latitude',
            'longitude',
            'createdAt',
            'updatedAt',
            'hostId'
        ]
    }).then(event => {
        if(req.user.id === event.hostId){
            res.render('event_details_form', {
                title: 'Event Update',
                moment: moment,
                event: event,
                user: req.user,
                hostId: event.hostId
            });
        }else{
            res.status(403).send('You do not have permission to edit this event.');
        }
    }).catch(function (error) {
        console.log(error);
    });
}

exports.event_update_delete = function (req, res, next) {
    models.Event.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'eventName',
            'eventDate',
            'description',
            'eventAddress',
            'maxCapacity',
            'numberAttending',
            'status',
            'startTime',
            'endTime',
            'latitude',
            'longitude',
            'createdAt',
            'updatedAt',
            'hostId'
        ]
    }).then(event => {
        // console.log(event);
        if(req.user.id === event.hostId){
            return event.destroy();
        }
        else{
            res.status(403).send('You do not have permission to delete this event.');
        }

    }).then(event => {

        var myJSONObject = {
            "to": req.user.email,
            "from": 'noreply@cmpt470.com',
            "subject":"Deleting Event from Eventify Notification",
            "body":"We are informing you that the event you created will be deleted"
        };
        request({
            url: "https://us-central1-cmpt470finalproject.cloudfunctions.net/sendgridEmail?sg_key=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",
            method: "POST",
            json: true, // <--Very important!!!
            body: myJSONObject
        }, function (error, response, body) {
            console.log('Sent an email to: ', req.user.email);
        });
        res.redirect('/events')
    }).catch(function (error) {
        console.log(error);
    });
};

exports.event_attend_user_post = function (req, res, next) {

    var clickedEventID = req.body.eventId;

    models.Event.findOne({
        where: {
            id: clickedEventID
        },
        attributes: [
            'id',
            'eventName',
            'eventDate',
            'description',
            'eventAddress',
            'maxCapacity',
            'numberAttending',
            'status',
            'startTime',
            'endTime',
            'latitude',
            'longitude',
            'createdAt',
            'updatedAt',
            'hostId'
        ]
    }).then(event => {

        event.getUsers().then(users => {

            userIdList = [];
            for (var i = 0; i < users.length; i++) {
                userIdList.push(users[i].id);
            }
            if (!userIdList.includes(req.user.id)) {
                event.addUser(req.user).then(() => {
                    event.increment('numberAttending').then(() => {
                        res.status(200).send({
                            'msg': 'attend success'
                        });
                    })
                });
            } else {
                res.status(200).send({
                    'msg': 'already attending'
                })
            }

        })

    }).catch(function (error) {
        console.log(error);
    });
};
