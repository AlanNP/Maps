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


}