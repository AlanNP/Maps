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
	var g= new Date();	
	var hora=g.getHours();
	var minuto=g.getMinutes();
	var dia=g.getDate();
	var mes=g.getMonth()+1;
	if (g.getHours()<10) {
		hora="0"+hora;
	}
	if(g.getMinutes()<10){
		minuto="0"+minuto;
	}
	if(g.getDate()<10){
		dia="0"+dia;
	}
	if(g.getMonth()<10){
		mes="0"+mes;
	}
	
	$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").removeAttr("href","");
	$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").html("Guardando <img src='img/ajax-loader-cancelar.gif'>")
	var horaf=g.getFullYear()+"-"+mes+"-"+dia+" "+hora+":"+minuto;
	var db = window.openDatabase("RUTA", "1.0", "DATABASE", -1);
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM PARADA_T WHERE ID_PARADA= '+ID_PARADA, [], function(tx, results) {
			val=results.rows.length;
			for (var i = 0; i < val; i++){
				var obj=String(results.rows.item(i).HORARIO_INICIO);
				var tiempo=restarHoras(obj,horaf);
				if(REPROGRAMAR_PARADA==0){
					db.transaction(function(tx){
						tx.executeSql('UPDATE PARADA_T SET TIEMPO="'+tiempo+'",ESTATUS_PARADA="Cancelada",HORARIO_FIN ="'+horaf+'",COMENTARIO_FINAL="'+COMENTARIO_FINAL+'" WHERE ID_PARADA='+ID_PARADA);
					});
				}else{
					db.transaction(function(tx){
						tx.executeSql('UPDATE PARADA_T SET TIEMPO="'+tiempo+'",ESTATUS_PARADA="Reprogramada",HORARIO_FIN ="'+horaf+'",COMENTARIO_FINAL="'+COMENTARIO_FINAL+'" WHERE ID_PARADA='+ID_PARADA);
					});	
				}
			}
		},null);	
	});	
	var positionTimer = navigator.geolocation.getCurrentPosition(
		function (pos) {
			$.ajax({	
				url:'http://recorridos.vallen.mx/sis/RutaNoCompletada/index.asp',
				data:{ID_USUARIO:ID_USUARIO,COMENTARIO_FINAL:COMENTARIO_FINAL,
					ID_PARADA:ID_PARADA,ID_CANCELACION:ID_CANCELACION,
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
								
								db.transaction(function(tx){
									tx.executeSql('DELETE FROM PARADA WHERE ID_PARADA='+ID_PARADA);
								});
								window.location="resumen.html"
							}else{
								alert("Datos no validos.")
							}
						})	
					},
					error: function(xhr,status,error){
						$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").attr("href","javascript:ComentarioNoFinal();");
						
						$("#btn_COMENTARIO_NO_COMPLETADA_FINAL").html("Guardando <img src='img/ajax-loader.gif'>")
						alert('No se ha podido conectar con el servidor.Datos almacenados en el dispositivo.');
						nocompleta();

					}
				});
		});
};