var image = 'http://recorridos.vallen.mx/icon_map.png';
var image_send1 = 'http://recorridos.vallen.mx/icon_map1.png';
var image_send2 = 'http://recorridos.vallen.mx/icon_map2.png';
var LAT_ORIGEN = "";
var LON_ORIGEN = "";
var map;
var	currentPositionMarker;	
var styles = [
	    {
	      featureType: "poi.business",
	      elementType: "labels",
	      stylers: [
	        { visibility: "off" }
	      ]
	    }
	  ];
	  
function displayAndWatch(position) {
	setCurrentPosition(position);
	watchCurrentPosition();
}

function setCurrentPosition(pos) {
	var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});  

	map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: {lat: pos.coords.latitude, lng:pos.coords.longitude},
		scrollwheel: false,
		zoom: 13
	});

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

	currentPositionMarker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(
			pos.coords.latitude,
			pos.coords.longitude
			),
		title: "posición",
		icon: image
	});


	var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:false,polylineOptions:{strokeColor: '#660FFC'}});
	var directionsService = new google.maps.DirectionsService();
	var request = {
		origin:"22.215998, -97.858238",
		destination:"22.264226, -97.786010",
		travelMode: google.maps.DirectionsTravelMode["DRIVING"],
		unitSystem: google.maps.DirectionsUnitSystem["METRIC"],
		provideRouteAlternatives: false
	}
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setMap(map);
			directionsDisplay.setDirections(response);
		} else {
		}
	});
}
function watchCurrentPosition() {
	var positionTimer = navigator.geolocation.watchPosition(
		function (position) {
			setMarkerPosition(currentPositionMarker,position);
		});
}
function setMarkerPosition(marker, position) {
	marker.setPosition(
		new google.maps.LatLng(
			position.coords.latitude,
			position.coords.longitude)
		);
}
function initLocationProcedure() {
	navigator.geolocation.getCurrentPosition(displayAndWatch, locError);
		//alert('buscar posición')
		//navigator.geolocation.getCurrentPosition(checkConnection);
	}
	

	function locError(error) {
		$("#avisoUbicacion").popup('open');
		$("#botones").hide();
	}

