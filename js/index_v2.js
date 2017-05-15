document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
           // Android customization
              cordova.plugins.backgroundMode.setDefaults({ text:'Realizando tareas.'});
              // Enable background mode
              cordova.plugins.backgroundMode.enable();
              // Called when background mode has been activated


              cordova.plugins.backgroundMode.onactivate = function () {
                  // Modify the currently displayed notification
                  setTimeout(function () {
                  // Modify the currently displayed notification
                  cordova.plugins.backgroundMode.configure({
                    title: 'Ejecutándose en segundo plano.'
                  });
                }, 3000);               

                  var callbackFn = function(location) {

                    backgroundGeolocation.finish();
                  };
                  var failureFn = function(error) {
                    alert('BackgroundGeolocation error');
                  };
                  backgroundGeolocation.configure(callbackFn, failureFn, {
                    desiredAccuracy: 10,
                    stationaryRadius: 20,
                    distanceFilter: 30,
                    interval: 60000
                  });
                  backgroundGeolocation.start();

                  
                }
}