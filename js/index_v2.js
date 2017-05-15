
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady(){
   var push = PushNotification.init({ "android": {"senderID": "1012969710793"}});
   push.on('registration', function(data) {
       var REGID=data.registrationId;
       sessionStorage.setItem("REGID",REGID);
   });

   push.on('notification', function(data) {
       alert(data.title+" Message: " +data.message);
   });

   push.on('error', function(e) {
       alert(e);
   });
}