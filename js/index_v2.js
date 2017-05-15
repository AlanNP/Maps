document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
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