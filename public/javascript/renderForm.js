//adds the resource to the form
function addResources() {
    var textInput = $('#addResource').val()
    var empty = true;
    if ($('#addResource').val() != '') {
        var checkbox = `<div class="resList"><input class="checkbox" type="checkbox" checked name="resources" value="${textInput}">${textInput}<button type="button" class="btn btn-default btn-xs float-right res" onClick="removeRes()"><i class="fa fa-minus-circle"></i></button></div>`
    }
    $('#populateResources').append(checkbox)
}

// Removes clicked element from resources
function removeRes() {
    $('.res').on('click', function () {
        $(this).parent().remove();
    });
}


//adds the category to the form
function addCategory(clicked_id) {
    var textInput = clicked_id;
    var checkbox = `<div class="catList"><input class="checkbox" type="checkbox" checked name="resources" value="${textInput}">${textInput}<button type="button" class="btn btn-default btn-xs float-right cat" onClick="removeCat()"><i class="fa fa-minus-circle"></i></button></div>`
    $('#populateCategories').append(checkbox)
}

// removes selected Category
// Implemented from: https://stackoverflow.com/questions/50524683/delete-specific-list-item-from-unordered-list-when-delete-button-is-clicked
function removeCat() {
    $('.cat').on('click', function () { 
        $(this).parent().remove();
    });
}

function getValues() {
    
    var formVals = $('form').serializeArray()
    var valsforserver = []
    var objforserver = {}
    var resourcesobj = {
        'listofresources': []
    }
    for (var i = 0; i < formVals.length; i++) {
        if (formVals[i].name != 'resources') {
            var name = formVals[i].name
            formVals[i][name] = formVals[i].value
            delete formVals[i].name
            delete formVals[i].value

            valsforserver.push(formVals[i])
        } else {
            var name = formVals[i].name
            formVals[i][name] = formVals[i].value
            delete formVals[i].name
            delete formVals[i].value

            resourcesobj.listofresources.push(formVals[i])
        }
    }
    valsforserver.push(resourcesobj)
    

}
// creates the event mode screen on the map and prepares the form
//partially adapted from: https://developers.google.com/maps/documentation/javascript/examples/marker-simple
function createEventMode() {
    var element = document.getElementById('map_canvas');
    var compare = document.getElementById("createEventBtn").value;
    var mapText = document.getElementById("overlayText");
    if (compare == "Create Event") {
        mapText.innerHTML = "Click on the Map to Place Marker";
        element.style.opacity = "0.5";
        google.maps.event.addListener(map, 'click', function (event) {
            if (pendingMarkers.length != 0) {
                deleteMarker();
            }
            addMarker(event.latLng, map);
            mapText.innerHTML = "";
            element.style.opacity = "1";
            google.maps.event.clearListeners(map, 'click');
            document.getElementById("createEventBtn").value = "Create Event";
        });
        document.getElementById("createEventBtn").value = "Cancel";

    } else if (compare == "Cancel") {
        mapText.innerHTML = "";
        element.style.opacity = "1";
        google.maps.event.clearListeners(map, 'click');
        document.getElementById("register_form").reset();
        document.getElementById("createEventBtn").value = "Create Event";
        $("#createEventWindow").hide()
        $('#informationWindow').show()
    }
}
$(document).ready(function () {
    $("#createEventWindow").hide()
    $('#informationWindow').show()

    $('#createBtn').click(function () {
        validateForm()

    });
    $('#cancelBtn').click(function () {
        document.getElementById("register_form").reset();
        $("#populateCategories").empty()
        $("#populateResources").empty()
        $("#createEventWindow").hide()
        $('#informationWindow').show()
        $('#createEventBtn').show()

    });

});

function validateForm() {


    if (($('#eventName #addressFromMap, #startTime, #endTime, #maxCapacity').val().length == 0) || (($('#eventDate').val().length == 0))) {
        alert('Please fill in Event Name, Event Date, Address, Start Time, End Time, and Max Capacity');
    } else {

        var eventJsonObj = []
        // get data from form
        var eventName = $("#eventName").val();
        var date = $("#eventDate").val();
        var address = $("#addressFromMap").val();
        var startTime = $("#startTime").val();
        var endTime = $("#endTime").val();
        var maxCapacity = $("#maxCapacity").val();
        var description = $("#description").val();
        var categories = $("#populateCategories").val();

        // from mapload.js
        var lat = globalLat
        var long = globalLng

        // post categories
        var categoryNames = []
        var categoriesJsonObj = {
            "categories": []
        }
        $("#populateCategories input[type=checkbox]").each(function () {
            categoryName = $(this).val()
            categoryNames.push(categoryName)
            console.log("categoryName" + categoryName)
            var category = {
                "categoryName": categoryName
                // "eventID": createdEventID
            }
            console.log("category" + category)
            categoriesJsonObj['categories'].push(category)
        });

        eventJsonObj = {
            // "eventID": 2303,
            "eventName": eventName,
            "eventDate": date,
            "description": description,
            "startTime": startTime,
            "endTime": endTime,
            // "hostID": ,

            "address": address,
            "latitude": lat,
            "longitude": long,
            "max_capacity": maxCapacity,
            "categoryNames": categoryNames
        }


        $.ajax({

            type: 'POST',
            data: eventJsonObj,
            url: "/events/create",
            dataType: 'json',
            success: function (data) {
                console.log("eventID is " + data["eventID"])
                var createdEventID = data["eventID"]
                var resourcesJsonObj = {
                    "resources": []
                }
                $("#populateResources input[type=checkbox]").each(function () {
                    resourceName = $(this).val()
                    var resource = {
                        "resourceName": resourceName,
                        "EventId": createdEventID
                    }
                    resourcesJsonObj['resources'].push(resource)
                });
                console.log("finished creating event")
                $.ajax({
                    type: "POST",
                    url: "/resources/create",
                    dataType: 'json',
                    data: resourcesJsonObj,
                    success: function (data) {
                        if (!alert("Event successfully created")) {
                            window.location.reload();
                        }


                    },
                    error: function (xhr, status, error) {
                        // check status && error
                        if (!alert(xhr.responseJSON.error)) {
                        }

                    },
                    async: false
                });

            },
            error: function (xhr, status, error) {
                
                if (!alert(xhr.responseJSON.error)) {
                }
            },
            async: false
        });
    }
}

