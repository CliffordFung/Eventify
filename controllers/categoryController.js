var models = require('../models')

exports.get_events_by_category_post = function (req, res) {

    console.log("get_event from categories start")
    console.log(req.body.categoryName)

    models.Category.findOne({
        attributes: ['id', 'name'],


        where: { name: req.body.categoryName}
    }).then(category => {
        console.log(category)
        // console.log(events)
        category.getEvents({
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
            console.log(events)

            res.json(events)
        })
    }).catch(function (error) {
        console.log(error);
        res.status(500).send({
            error: 'Error retrieving events'
        });
    });

}