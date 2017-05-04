function ComentarioNoFinal(){
	var COMENTARIO_FINAL = $('#COMENTARIO_NO_COMPLETADA_FINAL').val();
	var ID_CANCELACION = $('#MotivoCancelacion').val();
	var REPROGRAMAR_PARADA = 0;
	sessionStorage.setItem('CONTE',1);
	sessionStorage.setItem('REGISTRO',0);
	sessionStorage.setItem('PARADAOFF',0);
	if($("#REPROGRAMAR").is(':checked')) {  
		REPROGRAMAR_PARADA=1
	}

	var FECHA_REPROGRAMAR = $('#FECHA_REPROGRAMAR').val();
	var HORA_REPROGRAMAR  = $('#HORA_REPROGRAMAR').val();

	$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").attr("disabled", "disabled");

	if(COMENTARIO_FINAL==''){	
		alert("Escribe tus comentarios.");
		setTimeout(function () {
			$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").removeAttr("disabled");
		}, 2000);
		return false;
	}
	
	if(REPROGRAMAR_PARADA==1 && FECHA_REPROGRAMAR==''){	
		alert("Selecciona una Fecha para Reprogramar.");
		setTimeout(function () {
			$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").removeAttr("disabled");
		}, 2000);
		return false;
	}

	if(ID_CANCELACION==''){	
		alert("Selecciona el motivo de la cancelación.");
		setTimeout(function () {
			$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").removeAttr("disabled");
		}, 2000);
		return false;
	}
	
	$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").removeAttr("href","");
	$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").html("Guardando <img src='img/ajax-loader-cancelar.gif'>")

	var positionTimer = navigator.geolocation.getCurrentPosition(
		function (pos) {
			$.ajax({	
				url:'http://recorridos.vallen.mx/sis/RutaNoCompletada/index.asp',
				data:{ID_USUARIO:3095,COMENTARIO_FINAL:COMENTARIO_FINAL,
					ID_PARADA:12516,ID_CANCELACION:ID_CANCELACION,
					REPROGRAMAR:REPROGRAMAR_PARADA,FECHA_REPROGRAMAR:FECHA_REPROGRAMAR,
					HORA_REPROGRAMAR:HORA_REPROGRAMAR,LATITUD_FIN:pos.coords.latitude,
					LONGITUD_FIN:pos.coords.longitude},
					type:'get',
					dataType: 'jsonp',
					callbackParameter: 'callback',
					success: function(data){
						$.each(data.datos, function(i,item){
							var ESTADO_CONSULTA=item.ESTADO_CONSULTA||'',
							N_ID_PARADA=item.ID_PARADA||'';

							sessionStorage.setItem("ID_PARADA",N_ID_PARADA);
							
							if(ESTADO_CONSULTA=='OK'){
								alert("No completado");
								location.reload();
								$('#startroute').css('display','block');
								$('#mensajesComplete').css('display','none');
							}else{
								alert("Datos no validos.")
							}
						})	
					},
					error: function(xhr,status,error){
						$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").attr("href","javascript:ComentarioNoFinal();");
						
						$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").html("Guardando <img src='img/ajax-loader.gif'>")

					}
				});
		});
};