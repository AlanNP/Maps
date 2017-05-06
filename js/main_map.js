var image = 'http://recorridos.vallen.mx/icon_map.png';
var image_send1 = 'http://recorridos.vallen.mx/icon_map1.png';
var image_send2 = 'http://recorridos.vallen.mx/icon_map2.png';
var LAT_ORIGEN = "";
var LON_ORIGEN = "";
var map;
var	currentPositionMarker;	
var map = $("#map-canvas");
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

	$('#preloader').fadeOut('slow');
	
	var gmCenterAddress = map.attr("data-address");
	var gmMarkerAddress = map.attr("data-address");
	map.gmap3({
		zoom: 3,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	})
	.route({
		origin:"irak 304, tampico",
		destination:"avenida universidad 906,tampico",
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	})
	.directionsrenderer(function (results) {
		if (results) {
			return {
				panel: "#box",
				directions: results
			}
		}
	});

	currentPositionMarker= map.gmap3({})
	.marker({
		position: [pos.coords.latitude,pos.coords.longitude],
		icon: image
	});
	
$('#map-canvas').gmap3({
      action:'clear', 
      marker:{
         tag:'1',
         name:'marker'}
});

}
function watchCurrentPosition() {
	var positionTimer = navigator.geolocation.watchPosition(
		function (position) {
			setMarkerPosition(position);
		});
}
function setMarkerPosition(position) {
	map.gmap3({})
	.marker({
		position: [position.coords.latitude,position.coords.longitude],
		icon: image
	});
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
								url:'http://recorridos.vallen.mx/SIS/ReportarUbicacion/index2.asp',
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