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
    successHandler: function(result) { 
        //alert(result);
    }, 
    errorHandler:function(error) { 
        //alert(error);
    }, 
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var pushNotification = window.plugins.pushNotification;

        alert('pushNotification '+pushNotification) 
    	pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"1012969710793","ecb":"app.onNotificationGCM"});
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    },
    onNotificationGCM: function(e) {
        switch( e.event ){
            case 'registered':
                if (e.regid.length>0){
                    var REGID=e.regid;
                    sessionStorage.setItem("REGID",REGID);
					$("#btn_session").removeClass('ui-disabled');
					$("#btn_session").html('Iniciar Sesión');
                }
            break;
			case 'message':
				if ( e.foreground )
				{
					//alert('foreground message = '+e.message+' msgcnt = '+e.msgcnt+' room= '+e.payload.room_msg+' lat = '+lat_r+' lng = '+lng_r);
                    alert(e.message);
				}
				else
				{  
					if ( e.coldstart )
					{
						//alert('foreground message = '+e.message);
                        alert(e.message);
					}
					else
					{
						alert(e.message);
                        //alert('foreground message = '+e.message+' msgcnt = '+e.msgcnt+' room= '+e.payload.room_msg+' lat = '+lat_r+' lng = '+lng_r);         
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
