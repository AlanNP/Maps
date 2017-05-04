document.addEventListener("deviceready", Notificaciones, false);

function Notificaciones(){
    var push = PushNotification.init({
        android: {
            senderID: "1012969710793"
        },
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        }
    });

    push.on('registration', function(data) {
        var REGID=data.registrationId;
            sessionStorage.setItem("REGID",REGID);
            $("#btn_session").removeClass('ui-disabled');
            $("#btn_session").html('Iniciar Sesión');
    });

    push.on('notification', function(data) {
        navigator.notification.alert(
            data.message,         // message
            null,                 // callback
            data.title,           // title
            'Ok'                  // buttonName
        );
        push.finish(function() {
        // Do something
        });
    });

    push.on('error', function(e) {
        if (e.code != 7) {
            modal_errores(e.message);
        }
    });
}

function ListaNotificaciones(ID_USUARIO){
	$.ajax({
		url:'http://recorridos.vallen.mx/SIS/ListaNotificaciones/index.asp',
		data:{ID_USUARIO:ID_USUARIO},
		type:'get',
		dataType: 'jsonp',
		callbackParameter: 'callback',
		success: function(data){

			$.each(data.datos, function(k,item){

				var ESTADO_CONSULTA=item.ESTADO_CONSULTA||'';
				var MENSAJE=item.MENSAJE||'';
				var	TOTAL=item.TOTAL||0;
				
				if (ESTADO_CONSULTA=='OK'){

					var liNot = '';
					var	notificaciones=item.notificaciones||0;
					
					$("#LISTA_NOTIFICACIONES").html('');
					
					$.each(notificaciones, function(h,itemc){
						
						var	ID_NOTIFICACION=itemc.ID_NOTIFICACION||0;
						var	CLASS_NOTIFICACIONES=itemc.CLASS_NOTIFICACIONES||'ui-link';
						var	FECHA_NOTIFICACION=itemc.FECHA_NOTIFICACION||'Sin definir';
						var	DESCRIPCION_NOTIFICACION=itemc.DESCRIPCION_NOTIFICACION||'Sin definir';
						
						liNot+="<li>"
						liNot+="	<a href='' rel='external' id='NOTIFICACION_"+ID_NOTIFICACION+"' class="+CLASS_NOTIFICACIONES+">"
						liNot+="		<div class='asterix-notify'>"
						liNot+="			<i class='fa fa-asterisk'></i>"
						liNot+="		</div>"
						liNot+="		<div class='text-notify'>"
						liNot+="			<p>"+DESCRIPCION_NOTIFICACION+"</p>"
						liNot+="			<span><i class='fa fa-clock-o'></i> "+FECHA_NOTIFICACION+"</span>"
						liNot+="		</div>"
						liNot+="	</a>"
						liNot+="</li>"

					});
					
					$("#LISTA_NOTIFICACIONES").append(liNot);

				};
				
				if (ESTADO_CONSULTA=='NO'){
					$("#LISTA_NOTIFICACIONES").remove();
				}

				if (ESTADO_CONSULTA=='ERROR'){
					$("#LISTA_NOTIFICACIONES").remove();
				}
				

			})	
		}
	});

};


function BuscarNotificaciones(ID_USUARIO){
	
	$.ajax({
		url:'http://recorridos.vallen.mx/SIS/ListaNotificaciones/index.asp',
		data:{ID_USUARIO:ID_USUARIO},
		type:'get',
		dataType: 'jsonp',
		callbackParameter: 'callback',
		success: function(data){

			$.each(data.datos, function(k,item){

				var ESTADO_CONSULTA=item.ESTADO_CONSULTA||'';
				var MENSAJE=item.MENSAJE||'';
				var	TOTAL=item.TOTAL||0;
				
				if (ESTADO_CONSULTA=='OK'){

					$("#numNotifications").html("<i class='fa fa-asterisk'></i>");
					$("#numNotifications").fadeIn();
					
					var liNot = '';
					var	notificaciones=item.notificaciones||0;
					
					$("#LISTA_NOTIFICACIONES").html('');
					
					$.each(notificaciones, function(h,itemc){
						
						var	ID_NOTIFICACION=itemc.ID_NOTIFICACION||0;
						var	CLASS_NOTIFICACIONES=itemc.CLASS_NOTIFICACIONES||'ui-link';
						var	FECHA_NOTIFICACION=itemc.FECHA_NOTIFICACION||'Sin definir';
						var	DESCRIPCION_NOTIFICACION=itemc.DESCRIPCION_NOTIFICACION||'Sin definir';
						
						liNot+="<li>"
						liNot+="	<a href='' rel='external' id='NOTIFICACION_"+ID_NOTIFICACION+"' class="+CLASS_NOTIFICACIONES+">"
						liNot+="		<div class='asterix-notify'>"
						liNot+="			<i class='fa fa-asterisk'></i>"
						liNot+="		</div>"
						liNot+="		<div class='text-notify'>"
						liNot+="			<p>"+DESCRIPCION_NOTIFICACION+"</p>"
						liNot+="			<span><i class='fa fa-clock-o'></i> "+FECHA_NOTIFICACION+"</span>"
						liNot+="		</div>"
						liNot+="	</a>"
						liNot+="</li>"

					});
					
					$("#LISTA_NOTIFICACIONES").append(liNot);
					
				};
				
				if (ESTADO_CONSULTA=='NO'){
					$("#LISTA_NOTIFICACIONES").remove();
				}

				if (ESTADO_CONSULTA=='ERROR'){
					$("#LISTA_NOTIFICACIONES").remove();
				}
				

			})	
		}
	});

};
