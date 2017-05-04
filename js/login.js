function Login(){		
	var USUARIO_INTRANET  	= $('#USUARIO_INTRANET').val();
	var PASSWORD_USUARIO  	= $('#PASSWORD_USUARIO').val();
	
	$("#btn_session").attr("disabled", "disabled");

	if(USUARIO_INTRANET==''){	
		alert("Escribe tu Usuario.");
		setTimeout(function () {
			$("#btn_session").removeAttr("disabled");
		}, 3000);
		return false;
	}

	if(PASSWORD_USUARIO==''){	
		alert("Escribe tu Contraseña.");
		setTimeout(function () {
			$("#btn_session").removeAttr("disabled");
		}, 3000);
		return false;
	};

	var REGID = sessionStorage.getItem('REGID')||'S/REGID';
	var PLATAFORMA = 1;

	$.ajax({
		url:'http://recorridos.vallen.mx/SIS/login/index.asp',
		data:{USUARIO_INTRANET:USUARIO_INTRANET,PASSWORD_USUARIO:PASSWORD_USUARIO,REGID:REGID,PLATAFORMA:PLATAFORMA},
		type:'get',
		dataType: 'jsonp',
		callbackParameter: 'callback',
		success: function(data){
			$.each(data.datos, function(i,item){
				var ESTADO=item.ESTADO||'';
				var	ID_USUARIO=item.ID_USUARIO||0;
				var	ID_RUTA=item.ID_RUTA||0;
				var	NOMBRE_USUARIO=item.NOMBRE_USUARIO||'';
				var	APELLIDO_PATERNO_USUARIO=item.APELLIDO_PATERNO_USUARIO||'';
				var	MENSAJE=item.MENSAJE||'';

				sessionStorage.setItem("ID_USUARIO",ID_USUARIO);
				sessionStorage.setItem("NOMBRE_USUARIO",NOMBRE_USUARIO);
				sessionStorage.setItem("APELLIDO_PATERNO_USUARIO",APELLIDO_PATERNO_USUARIO);
				sessionStorage.setItem("ID_RUTA",ID_RUTA);
                
				if(ESTADO=='OK'){
					var RECORDAR =0;
					if($("#RECORDAR").is(':checked')){
						localStorage.setItem("ID_USUARIO", ID_USUARIO);
						localStorage.setItem("NOMBRE_USUARIO", NOMBRE_USUARIO);
						localStorage.setItem("APELLIDO_PATERNO_USUARIO", APELLIDO_PATERNO_USUARIO);
						localStorage.setItem("ID_RUTA", ID_RUTA);
						localStorage.setItem("USUARIO_INTRANET", USUARIO_INTRANET);
						localStorage.setItem("PASSWORD_USUARIO", PASSWORD_USUARIO);
						localStorage.setItem("REGID", sessionStorage.getItem('REGID'));
					}else{
						var value=0;
						sessionStorage.setItem("ID_USUARIO",ID_USUARIO);
						sessionStorage.setItem("NOMBRE_USUARIO",NOMBRE_USUARIO);
						sessionStorage.setItem("APELLIDO_PATERNO_USUARIO",APELLIDO_PATERNO_USUARIO);
					}
					top.location="ruta.html"
				}else{
					alert("Datos no validos.")
				}
			})	
		},
		error: function() {
			$('#notification-bar').text('An error occurred');
		}
	});
};