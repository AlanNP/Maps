var app = {     
    initialize: function() { 
        this.bindEvents(); 
    },     
    bindEvents: function() { 
        document.addEventListener('deviceready', this.onDeviceReady, false); 
    },     
    onDeviceReady: function() {        
        app.receivedEvent('deviceready'); 
    },     
    receivedEvent: function(id) {
    alert(id)    
        var parentElement = document.getElementById(id);
        var pushNotification = window.plugins.pushNotification;
    	pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"1012969710793","ecb":"app.onNotificationGCM"});
	},    
    successHandler: function(result) { 
        //alert('Callback Success! Result = '+result)
    }, 
    errorHandler:function(error) { 
        alert(error);
    }, 
    onNotificationGCM: function(e) {
		
        switch( e.event ){
			
            case 'registered':
                if (e.regid.length>0){
                    var REGID=e.regid;
                    sessionStorage.setItem("REGID",REGID);
                }
            break;
	
			case 'message':
			
				if ( e.foreground )
				{
					alert(e.message);
					BuscarNotificaciones(ID_USUARIO);
				}
				else
				{  
					
					if ( e.coldstart )
					{
						alert(e.message);
						BuscarNotificaciones(ID_USUARIO);
					}
					else
					{
						alert(e.message);
						BuscarNotificaciones(ID_USUARIO);
					}
				}
					
			break;
		
			case 'error':
				//alert('GCM error = '+e.message);
			break; 
						
						
			default:
				alert('No se ha podido conectar al servidor. Intente más tarde');
			break;

        } 
    }
};

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
