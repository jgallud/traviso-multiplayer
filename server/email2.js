var sendgrid = require("sendgrid")("your-key");

var url="your-url";

module.exports.enviarEmail=function(direccion,key,msg){
	var email = new sendgrid.Email();
	email.addTo(direccion);
	//email.addBcc('conquistaniveles@gmail.com');
	email.setFrom('your-email');
	email.setSubject('confirmar cuenta');
	email.setHtml('<h3>Bienvenido a TecnoCRA</h3><p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">'+msg+'</a></p>');

	sendgrid.send(email);	
}

module.exports.enviarEmailAddor=function(direccion,msg){
	var email = new sendgrid.Email();
	email.addTo(direccion);
	//email.addBcc('conquistaniveles@gmail.com');
	email.setFrom('your email');
	email.setSubject('Nuevo usuario en TecnoCRA');
	email.setHtml('<p>'+msg+'</p>');

	sendgrid.send(email);	
}

module.exports.enviarEmailResetPassword=function(direccion,key,msg){
	var email = new sendgrid.Email();
	email.addTo(direccion);
	email.setFrom('your email');
	email.setSubject('Reiniciar clave');
	email.setHtml('<h3>TecnoCRA: recuperar clave</h3><p>'+msg+'<a href="'+url+'cambiarClave/'+direccion+'/'+key+'">enlace</a></p>');

	sendgrid.send(email);	
}