var image = 'http://recorridos.vallen.mx/icon_map.png';
var image_send1 = 'http://recorridos.vallen.mx/icon_map1.png';
var image_send2 = 'http://recorridos.vallen.mx/icon_map2.png';
var LAT_ORIGEN = "";
var LON_ORIGEN = "";
var map;
var	currentPositionMarker;	

function displayAndWatch(position) {
	setCurrentPosition(position);
	watchCurrentPosition();
}

function setCurrentPosition(pos) {
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: {lat: pos.coords.latitude, lng:pos.coords.longitude},
		scrollwheel: false,
		zoom: 13
	});

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
			directionsDisplay.setPanel($("#panel_ruta").get(0));
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

	var LATITUDE_ANTERIOR='0';
	var LONGITUDE_ANTERIOR='0';
	function GuardarMovimientos(){
		currentPositionMarker.setIcon(image);
		if (sessionStorage.getItem('ESTATUS_PARADA')=='En Ruta'){
			setInterval(function() {
				var positionTimer = navigator.geolocation.getCurrentPosition(
					function (position) {
						if (LATITUDE_ANTERIOR!=position.coords.latitude && LONGITUDE_ANTERIOR!=position.coords.longitude){
							$.ajax({
								url:'http://recorridos.vallen.mx/SIS/ReportarUbicacion/index.asp',
								data:{ID_PARADA:12516,latitude:position.coords.latitude,longitude:position.coords.longitude},
								type:'get',
								dataType: 'jsonp',
								callbackParameter: 'callback',
								success: function(data){
									$.each(data.datosB, function(j,itemB){
										var ESTADO_CONSULTA=itemB.ESTADO_CONSULTA||'',
										LATITUDE_ANTERIOR=itemB.latitude_ANTERIOR||'',
										LONGITUDE_ANTERIOR=itemB.longitude_ANTERIOR||'';
										currentPositionMarker.setIcon(image);
									})
								}
							});

						}else{
							currentPositionMarker.setIcon(image);
						}
					});
			}, 10000);
		};
	};
	function IniciarRecorrido(){

		if(!!navigator.geolocation) {
			var positionTimer = navigator.geolocation.getCurrentPosition(
				function (position) {
					currentPositionMarker.setIcon(image_send1);
					$.ajax({
						url:'http://recorridos.vallen.mx/SIS/IniciarRecorrido/index.asp',
						data:{ID_PARADA:12516,LATITUD_INICIO:position.coords.latitude,LONGITUD_INICIO:position.coords.longitude},
						type:'get',
						dataType: 'jsonp',
						callbackParameter: 'callback',
						success: function(data){

							$.each(data.datosA, function(i,itemA){
								var ESTADO_CONSULTA=itemA.ESTADO_CONSULTA||'';
								ESTATUS_PARADA=itemA.ESTATUS_PARADA||'Estatus sin definir';
								sessionStorage.setItem("ESTATUS_PARADA",ESTATUS_PARADA);
                                
								setInterval(function() {
									GuardarMovimientos();
								}, 3000);	
							})

						}
					});

				});
		}
	}