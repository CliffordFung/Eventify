var gmarkers = []; // hold copies of markers and html used by side_bar (function closure trick doesnt work there)
var map = null;
var geocoder = new google.maps.Geocoder(); //used for the geocoder in google maps API
var pendingMarkers = []; //holds the markers if it needs to be deleted
var filteredMarkers = []; //holds the filters markers to be displayed
var allMarkers = []; //holds all the markers on the map
var tempAllMarkers = []; //set of markers manipulated for filtering
var entireSetOfMarkers = []; // all marker lists

var infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(150, 50)
});
var globalLat = null;
var globalLng = null;

var recievedEventsJson = null;
var recievedResourcesJson = null;
var receivedCategoriesJson = null;
var receivedFilteredEventsJson = null;

var clickedEventID = -1;

$.ajax({
    type: 'GET',
    url: "/events/create",
    dataType: 'json',
    success: function (data) {
        recievedEventsJson = data;
        $.ajax({
            type: 'GET',
            url: "/resources/create",
            dataType: 'json',
            success: function (data) {
                recievedResourcesJson = data;
                console.log(recievedResourcesJson);
            },
            error: function (xhr, status, error) {
                // check status && error
                if (!alert(xhr.responseJSON.error)) {}
            },
            async: false
        });

    },
    error: function (xhr, status, error) {
        // check status && error
        if (!alert(xhr.responseJSON.error)) {}

    },
    async: false
});

//adapted from:https://developers.google.com/maps/documentation/javascript/tutorial
//adapted from :https://stackoverflow.com/questions/35610873/google-maps-with-responsive-sidebar
function initialize() {

    // center map on current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        });
    }
    var myOptions = {
        zoom: 12,
        center: new google.maps.LatLng(49.2827, -123.1207),
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);

    google.maps.event.addListener(map, 'click', function () {
        infowindow.close(); // click anywhere else on map to close infowindow
    });

    // Grabs the address from the existing events
    for (var i = 0; i < recievedEventsJson.length; i++) {
        event = recievedEventsJson[i];
        var marker = loadMarker(event['latitude'], event['longitude'], event);
        address = event['eventAddress'];

        recievedEventsJson[i]['resources'] = [];
        for (var j = 0; j < recievedResourcesJson.length; j++) {
            if (recievedResourcesJson[j].EventId === recievedEventsJson[i].id) {
                recievedEventsJson[i].resources.push(recievedResourcesJson[j])
            }

        }
        entireSetOfMarkers = allMarkers;
    }

}
//adapted from: https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
//places markers to the location of existing events
function geocodeAddress(geocoder, resultsMap, address) {
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status === 'OK') {
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });

}
//adapted from https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
//retrieves the address from the lat and lng values when a marker is placed
function geocodeLatLng(geocoder, map, lat, lng) {
    var latlngStr = [lat.toString(10), lng.toString(10)];
    var latlng = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1])
    };
    geocoder.geocode({
        'location': latlng
    }, function (results, status) {
        if (status === 'OK') {
            //results[0] is the array that stores all the details of the pinged location
            if (results[0]) {
                //produces human readable address in a string
                $('#addressFromMap').val(results[0].formatted_address)
            } else {
                console.log("No Result Found");
            }
        } else {
            console.log('Geocoder failed due to: ' + status);
        }
    });
}

function convertDate(eventDate) {
    var date = new Date(Date.parse(eventDate));
    var dateStringsplit = String(date).split('GMT')
    return dateStringsplit[0]
}

// A function to create the marker and set up the event window function 
function loadMarker(latitude, longitude, eventobj) {
    var position = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        zIndex: Math.round(position.lat() * -100000) << 5
    });
    allMarkers.push(marker);
    tempAllMarkers = allMarkers;

    // add click listener for each marker
    google.maps.event.addListener(marker, 'click', function () {
        // set content of info window
        infowindow.setContent(`<strong>Event:</strong> ${eventobj['eventName']} 
                                <br><strong>From:</strong> ${eventobj['startTime']} 
                                <br><strong>To:</strong> ${eventobj['endTime']} 
                                <br><strong>Address:</strong> ${eventobj['eventAddress']}`);
        infowindow.open(map, marker);
        clickedEventID = eventobj['id'];
        // set content of View Event container
        $("#event-content-title").text(eventobj['eventName']);
        $("#event-date").text(eventobj['eventDate']);
        $("#event-start-time").text(eventobj['startTime']);
        $("#event-end-time").text(eventobj['endTime']);
        $("#event-description").text(eventobj['description']);
        $("#event-address").text(eventobj['eventAddress']);
        $("#event-max-capacity").text(eventobj['maxCapacity']);
        $("#event-num-attending").text(eventobj['numberAttending']);
        // set sidebar to highlight onclicked marker
        $('#side_bar li').css('color', '#000000');
        $('#' + eventobj['id']).css('color', 'red');

        $("#event-resources").empty(); //comes from another table in db  
        if (eventobj.resources.length > 0) {
            for (var i = 0; i < eventobj.resources.length; i++) {
                $("#event-resources").append(`<li>${eventobj.resources[i]['resourceName']}</li>`); //comes from another table in db        
                console.log(eventobj.resources[i]);
            }
        } else {
            $("#event-resources").append(`<li>None</li>`); //comes from another table in db       
        }

    });

    // load sidebar to include marker information and events
    // var sidebar = $('#side_bar');
    var sidebar = $('#sidebar-list');

    var sidebar_entry = $('<li/>', {
        'id': eventobj['id'],
        'html': eventobj['eventName'],
        'click': function () {
            $('#side_bar li').css('color', '#000000');
            $(this).css('color', 'red');
            google.maps.event.trigger(marker, 'click');
        }
    })

    sidebar_entry.appendTo(sidebar);

}
// Add the marker at the clicked location
//adapted from: https://developers.google.com/maps/documentation/javascript/examples/marker-simple
function addMarker(position, map) {
    $('#createEventBtn').hide()
    $('#informationWindow').hide()
    $("#createEventWindow").show()
    document.getElementById("createEventBtn").value = "Cancel";

    var lat = position.lat();
    var lng = position.lng();
    // console.log(lat);
    // console.log(lng);
    globalLat = lat;
    globalLng = lng;

    var marker = new google.maps.Marker({
        position: position,
        map: map
    });
    pendingMarkers.push(marker);
    console.log(pendingMarkers);

    // convert coordinates to address  (optional for now)
    geocodeLatLng(geocoder, map, lat, lng);

}

//deletes the most recent unsaved marker
//adapted from: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
function deleteMarker() {
    var index = pendingMarkers.length;
    pendingMarkers[index - 1].setMap(null);
    pendingMarkers = [];
}

//clears all the markers displayed
//adapted from https://developers.google.com/maps/documentation/javascript/examples/marker-remove
function clearAllMarkers() {
    for (var i = 0; i < tempAllMarkers.length; i++) {
        tempAllMarkers[i].setMap(null);
    }
}

//shows all the markers on the map
//adapted from: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
function showAllMarkers(map) {
    clearAllMarkers();
    tempAllMarkers = entireSetOfMarkers;
    for (var i = 0; i < tempAllMarkers.length; i++) {
        tempAllMarkers[i].setMap(map);
    }
}

//parses the category id with the events
//adapted from: https://stackoverflow.com/questions/17292176/pass-element-id-to-javascript-function
function parseCategory(clicked_id) {

    var textInput = clicked_id;
    var parsedCat = textInput.substring(0, textInput.length - 1);

    //replaces dropdown menu placeholder
    $('#dropdownMenuButton1').html(parsedCat);

    var categoryJsonObj = {
        "categoryName": parsedCat
    }

    if (parsedCat != "All") {
        document.getElementById("sidebar-list").innerHTML = "";
        clearAllMarkers();
        $.ajax({
            type: 'POST',
            url: "/categories/get_events",
            dataType: 'json',
            data: categoryJsonObj,
            success: function (data) {
                receivedFilteredEventsJson = data;
            },
            error: function (xhr, status, error) {
                // check status && error
                if (!alert(xhr.responseJSON.error)) {
                    // window.location.reload();
                }

            },
            async: false
        });
        for (var i = 0; i < receivedFilteredEventsJson.length; i++) {
            event = receivedFilteredEventsJson[i];
            var marker = loadMarker(event['latitude'], event['longitude'], event);
        }
    } else if (parsedCat = "All") {
        document.getElementById("sidebar-list").innerHTML = "";
        clearAllMarkers();
        for (var i = 0; i < recievedEventsJson.length; i++) {
            event = recievedEventsJson[i];
            var marker = loadMarker(event['latitude'], event['longitude'], event);
        }
    }

}
//filters the markers, and displays only the markers with the selected category
function filterCategory(category) {
    var cat = category;
    filteredMarkers = [];
    tempAllMarkers = filteredMarkers;
    diplayFilteredMarkers(map);
}

//displays the filtered markers
function displayFilteredMarkers(map) {
    clearAllMarkers();
    for (var i = 0; i < tempAllMarkers.length; i++) {
        tempAllMarkers[i].setMap(map);
    }
}

$(document).ready(function () {
    console.log("ready!");
    $('#attendButton').click(function () {
        console.log("clicked event: " + clickedEventID);
        var clickedEventIDJSONObj = {
            'eventId': clickedEventID
        }

        $.ajax({
            type: "POST",
            url: "/events/attend_user",
            dataType: 'json',
            data: clickedEventIDJSONObj,
            success: function (data) {
                console.log(data['msg'])
                if (data['msg'] == 'attend success') {
                    if (!alert("Event successfully attended")) {
                        window.location.reload();
                    }
                } else if (data['msg'] == 'already attending') {
                    if (!alert("You are already attending this event!")) {}
                }
            },
            error: function (xhr, status, error) {
                // check status && error
                if (!alert(xhr.responseJSON.error)) {}
            },
            async: false
        });
    });
});



google.maps.event.addDomListener(window, 'load', initialize);