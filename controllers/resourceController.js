var models = require('../models')

exports.view_resource_get = function (req, res, next) {
    
    models.Resource.findAll({
        //include? might need to join with events
        attributes: [
        'id', 
        'resourceName',
        'createdAt',
        'updatedAt',
        'EventId'
    ]
     }).then(resources => {
        // console.log(resources)
        res.json(resources)
    }).catch(function (error) {
        console.log(error);
        res.status(500).send({error: 'Error retrieving resources'});
    });

};

exports.create_resource_post = function (req, res) {
    console.log(req.body);
    
    for (var i = 0; i < Object.keys(req.body).length/2; i++) {
        const resourceName = req.body[`resources[${i}][resourceName]`];
        const eventId = req.body[`resources[${i}][EventId]`];
        var newResource = models.Resource.build({
            resourceName: resourceName,
            EventId: eventId
        });
        newResource.save().then(function (newResource) {
            // console.log(newResource)
        }).catch(function (error) {
            console.log(error);
            res.status(500).send({error: 'Error saving resources to database'});
        });

    }
    res.json({"status": "ok"});

}