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
	$("#btn_COMENTARIO_FINAL").removeAttr("href","");
	$("#btn_COMENTARIO_FINAL").html("Guardando <img src='img/ajax-loader.gif'>")
	var horaf=g.getFullYear()+"-"+mes+"-"+dia+" "+hora+":"+minuto;
	var db = window.openDatabase("RUTA", "1.0", "DATABASE", -1);
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM PARADA_T WHERE ID_PARADA= '+ID_PARADA, [], function(tx, results) {
			val=results.rows.length;
			for (var i = 0; i < val; i++){
				var obj=String(results.rows.item(i).HORARIO_INICIO);
				var tiempo=restarHoras(obj,horaf);
				db.transaction(function(tx){
					tx.executeSql('UPDATE PARADA_T SET TIEMPO="'+tiempo+'",ESTATUS_PARADA="Completada",HORARIO_FIN ="'+horaf+'",COMENTARIO_FINAL="'+COMENTARIO_FINAL+'" WHERE ID_PARADA='+ID_PARADA);
				});
			}
		},null);	          
	});	
	
	var positionTimer = navigator.geolocation.getCurrentPosition(
		function (position) {
			var RUTA_MANUAL=sessionStorage.getItem('RutaManual')||0;

			$.ajax({
				url:'http://recorridos.vallen.mx/SIS/RutaCompletada/index.asp',
				data:{COMENTARIO_FINAL:COMENTARIO_FINAL,ID_PARADA:ID_PARADA,LATITUD_FIN:position.coords.latitude,LONGITUD_FIN:position.coords.longitude,RUTA_MANUAL:RUTA_MANUAL},
				type:'get',
				dataType: 'jsonp',
				callbackParameter: 'callback',
				success: function(data){
					$.each(data.datos, function(i,item){
						var ESTADO_CONSULTA=item.ESTADO_CONSULTA||'';
						N_ID_PARADA=item.ID_PARADA||'';
						
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
					$("#btn_COMENTARIO_FINAL").attr("href","javascript:ComentarioFinal();");
					$("#btn_COMENTARIO_FINAL").html("Guardando <img src='img/ajax-loader.gif'>")
					alert('No se ha podido conectar con el servidor.Datos almacenados en el dispositivo.');
					completa();
				}
			});
		});
};