function ComentarioFinal(){
	var COMENTARIO_FINAL = $('#COMENTARIO_COMPLETADA_FINAL').val();	
	$("#btn_COMENTARIO_FINAL").attr("disabled", "disabled");
	sessionStorage.setItem('CONTE',1);
	sessionStorage.setItem('REGISTRO',0);
	sessionStorage.setItem('PARADAOFF',0);
	if(COMENTARIO_FINAL==''){	
		alert("Escribe tus comentarios.");
		setTimeout(function () {
			$("#btn_COMENTARIO_FINAL").removeAttr("disabled");
		}, 3000);
		return false;
	}

	$("#btn_COMENTARIO_FINAL").removeAttr("href","");
	$("#btn_COMENTARIO_FINAL").html("Guardando <img src='img/ajax-loader.gif'>")

	var positionTimer = navigator.geolocation.getCurrentPosition(
		function (position) {
			var RUTA_MANUAL=sessionStorage.getItem('RutaManual')||0;

			$.ajax({
				url:'http://recorridos.vallen.mx/SIS/RutaCompletada/index.asp',
				data:{COMENTARIO_FINAL:COMENTARIO_FINAL,ID_PARADA:12516,LATITUD_FIN:position.coords.latitude,LONGITUD_FIN:position.coords.longitude,RUTA_MANUAL:RUTA_MANUAL},
				type:'get',
				dataType: 'jsonp',
				callbackParameter: 'callback',
				success: function(data){
					$.each(data.datos, function(i,item){
						var ESTADO_CONSULTA=item.ESTADO_CONSULTA||'';
						N_ID_PARADA=item.ID_PARADA||'';
						
						if(ESTADO_CONSULTA=='OK'){
							alert("Completado");
							location.reload();
							$('#startroute').css('display','block');
							$('#mensajesComplete').css('display','none');
						}else{
							alert("Datos no validos.")
						}
					})
				},
				error: function(xhr,status,error){
					$("#btn_COMENTARIO_FINAL").attr("href","javascript:ComentarioFinal();");
					$("#btn_COMENTARIO_FINAL").html("Guardando <img src='img/ajax-loader.gif'>")
					
				}
			});
		});
};