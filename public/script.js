var map;
var clients = [];
var attributes = [];
var clientsSearch = [];
var clientsSearchMarkers = [];
var clientSelectedMarker = null;
var latlngbounds;

var initialize = function() {
    var brazil = {lat: -18.8800397, lng: 47.05878999999999};
    map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: brazil});
    latlngbounds = new google.maps.LatLngBounds();
}

var addMarker = function(point, marker_img){
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(point.latitude, point.longitude),
        title: point.name,
        map: map,
        icon: marker_img
    });

    var infowindow = new google.maps.InfoWindow(), marker;

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
            infowindow.setContent(point.name);
            infowindow.open(map, marker);
        }
    })(marker))

    latlngbounds.extend(marker.position);

    return marker;
}

var clearMarkers = function(){
    for (var i = 0; i < clientsSearchMarkers.length; i++ ) {
        clientsSearchMarkers[i].setMap(null);
    }
    clientsSearchMarkers.length = 0;
}

$(function(){

    $inputClients = $("#inputClients");

    $.get("/api/clients", function(data){
        clients = data;
        $inputClients.html("<option value='-1' selected>Escolha o cliente</option>");
        for(var i=0; i < clients.length; i++){
            $inputClients.append("<option value='"+i+"'>"+clients[i].name+"</option>")
        }
    });

    $.get("/api/attributes", function(data){
        attributes = [];
        for(var i = 0; i < data.length; i++){
            attributes.push(data[i].name);
        }
        $("#attr").autocomplete({
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(attributes, request.term);
                response(results.slice(0, 10));
            }
        });
    });

    $inputClients.on('change', function() {
        if(this.value == -1) return;

        var client = clients[this.value];

        if(clientSelectedMarker != null){
            clientSelectedMarker.setMap(null);
        }

        clearMarkers();

        clientSelectedMarker = addMarker(client, "img/marker2.png");

        map.setCenter({lat: client.latitude, lng: client.longitude});
    });


    $("form").submit(function(){
        var selectValue = $inputClients.val();

        if(selectValue == -1) return false;

        var client = clients[selectValue];

        var n = $("#n").val();

        if(n < 0) return;

        var url = "/api/findNearest/"+client._id+"/"+n;
        if($("#attr").val().trim().length != 0){
            url = url + "/" + $("#attr").val();
        }

        $.get(url, function(data){
            latlngbounds = new google.maps.LatLngBounds();

            clientsSearch = data;
            clearMarkers();

            for(var i=0; i < clientsSearch.length; i++){
               clientsSearchMarkers.push(addMarker(clientsSearch[i], "img/marker.png"));
            }

            latlngbounds.extend(clientSelectedMarker.position);

            map.fitBounds(latlngbounds);
        });

        return false;
    });
});
