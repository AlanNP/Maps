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
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
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
		
		var directionsDisplay = new google.maps.DirectionsRenderer;
  		var directionsService = new google.maps.DirectionsService;
			directionsDisplay.setMap(map);
			directionsDisplay.setPanel(document.getElementById('right-panel'));
		
			LAT_ORIGEN = pos.coords.latitude;
			LON_ORIGEN = pos.coords.longitude;
			calculateAndDisplayRoute(directionsService, directionsDisplay);
	}

	function calculateAndDisplayRoute(directionsService, directionsDisplay) {	  
	  var start = LAT_ORIGEN+','+LON_ORIGEN;
	  var LAT_DESTINO = sessionStorage.getItem('LAT_DESTINO')||0;
	  var LON_DESTINO = sessionStorage.getItem('LON_DESTINO')||0;

	  	if(LAT_DESTINO !=0 && LON_DESTINO !=0){
	  		var end = LAT_DESTINO+','+LON_DESTINO;
	  			directionsService.route({
	  				origin: start,
	  				destination: end,
	  				travelMode: google.maps.TravelMode.DRIVING
	  			}, function(response, status) {
	  				if (status === google.maps.DirectionsStatus.OK){
	  					directionsDisplay.setDirections(response);
	  				}else{
	  					$("#avisoUbicacion").popup('open');
	  					$("#botones").hide();
	  				}
	  			});
	  			$("#botones").removeClass("footer-hidden");
	  	}else{
	  		map = new google.maps.Map(document.getElementById('map-canvas'), {
				zoom: 15,
				center: {lat: LAT_ORIGEN, lng: LON_ORIGEN},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});

			currentPositionMarker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(
				LAT_ORIGEN,
				LON_ORIGEN
			),
			title: "posición",
			icon: image
			});

			$("#botones").hide();
			$("#avisoUbicacion").popup('open');
			
	  	}
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
	function initLocation() {
		//navigator.geolocation.getCurrentPosition(displayAndWatch, locError);
		//alert('buscar posición')
		navigator.geolocation.getCurrentPosition(checkConnection);
	}

	function locError(error) {
		$("#avisoUbicacion").popup('open');
		$("#botones").hide();
	}

	function IniciarRecorrido(){
		 
					            
		if(!!navigator.geolocation) {
			var positionTimer = navigator.geolocation.getCurrentPosition(
			function (position) {
				currentPositionMarker.setIcon(image_send1);
				$.ajax({
					url:'http://recorridos.vallen.mx/SIS/IniciarRecorrido/index.asp',
					data:{ID_PARADA:ID_PARADA,LATITUD_INICIO:position.coords.latitude,LONGITUD_INICIO:position.coords.longitude},
					type:'get',
					dataType: 'jsonp',
					callbackParameter: 'callback',
					success: function(data){
			            
						$.each(data.datosA, function(i,itemA){
							var ESTADO_CONSULTA=itemA.ESTADO_CONSULTA||'';
							ESTATUS_PARADA=itemA.ESTATUS_PARADA||'Estatus sin definir';
							sessionStorage.setItem("ESTATUS_PARADA",ESTATUS_PARADA);
							console.log('ESTATUS_PARADA '+ESTATUS_PARADA)
							var db = window.openDatabase("RUTA", "1.0", "DATABASE", -1);
							 db.transaction(function(tx){
						     tx.executeSql('UPDATE PARADA SET ESTATUS_PARADA= "'+sessionStorage.getItem('ESTATUS_PARADA')+'" WHERE ID_PARADA= '+sessionStorage.getItem('ID_PARADA'));
							 });
							setInterval(function() {
								GuardarMovimientos();
							}, 5000);	
						})
						
					}
				});

			});
		}
	}
	function recorrido(){
		setInterval(function() {
        GuardarMovimientos();
		}, 3000);
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
						
						currentPositionMarker.setIcon(image_send2);
						ID=sessionStorage.getItem('ID_PARADA');
						$.ajax({
							url:'http://recorridos.vallen.mx/SIS/ReportarUbicacion/index.asp',
							data:{ID_PARADA:ID,latitude:position.coords.latitude,longitude:position.coords.longitude},
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
		function GuardaMovimiento(ID,latitud,longitud){

		if (sessionStorage.getItem('ESTATUS_P')=='En Ruta'){
			$.ajax({
							url:'http://recorridos.vallen.mx/SIS/ReportarUbicacion/index.asp',
							data:{ID_PARADA:ID,latitude:latitud,longitude:longitud},
							type:'get',
							dataType: 'jsonp',
							callbackParameter: 'callback',
							success: function(data){
							}
						});
		};
	};

	var onSuccess = function(position) {
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n');
    };

    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    function checkConnection() {
    var networkState = navigator.connection.type;
 
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    sessionStorage.setItem('CONNECT',states[networkState]);
}