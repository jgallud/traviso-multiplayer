function Cliente(id){
	this.socket;
	this.id=id;
	this.num;
	this.room;
	this.cargarConfiguracion=function(x,y){
		this.socket.emit('configuracion',this.room,x,y);
	}
	this.unirmeAPartida = function(){		
    	this.socket.emit('unirme',this.room);
	};
	this.askNewPlayer = function(){		
    	this.socket.emit('nuevoJugador',{room:this.room,id:this.id});
	};
	this.ini=function(){
		this.socket=io.connect();
		//this.id=randomInt(1,10000);		
		this.room="global";
		this.num=1;
		this.lanzarSocketSrv();
	}
	this.reset=function(){
		this.id=randomInt(1,10000);
	};
	this.enviarPosicion=function(x,y,dir){
		this.socket.emit('posicion',this.room,{"id":this.id,"x":x,"y":y,"dir":dir})
	}
	this.enviarPuntos=function(puntos){
		this.socket.emit('envPuntos',this.room,{"id":this.id,"puntos":puntos});
	}
	this.enviarVidas=function(vidas){
		this.socket.emit('envVidas',this.room,{"id":this.id,"vidas":vidas});
	}
	this.enviarMatarBicho = function(ind){		
    	this.socket.emit('matarBicho',this.room,ind,this.id);
	};
	this.sendClick = function(x,y){
  		this.socket.emit('click',{x:x,y:y});
	};
	this.volverAJugar=function(){
		this.socket.emit('volverAJugar',this.room);	
	}
	this.lanzarSocketSrv=function(){
		var cli=this;
		this.socket.on('connect', function() {   			
   			cli.socket.emit('room', cli.id,cli.room,cli.email);
   			console.log("envio room");
   			//mostrarCanvas();
   			//cli.cargarConfiguracion();
		});
		this.socket.on('nuevoJugador',function(data){	
			// var juego=game.state.states.Boot;
			for(var jug in data){
				if (data[jug].id!=cli.id){
			     	console.log('nuevoJugador: ',data[jug]);
			        agregarNave(data[jug]);
			    }
			    else{
			    	agregarNaveLocal(data[jug]);
			    }
		     };
		});
		this.socket.on('faltaUno',function(data){
			console.log('falta uno');
			juego.faltaUno();
		})
		this.socket.on('aJugar',function(data){		    
		    //for(var i = 0; i < Object.keys(data).length; i++){
		    	//client.id=data[i].id;
		    for(var jug in data){
		    	console.log('aJugar: ',data[jug]);
		        juego.agregarJugador(data[jug]);
		    };
		    juego.moverAliens(juego.bajada);
		    juego.eliminarTexto();
		});
		this.socket.on('final',function(data){		    
			juego.finJuego(data);
		});
		this.socket.on('finalVidas',function(data){		    
			juego.finJuego(data);
		});

		this.socket.on('reset',function(data){		    
			juego.volverAJugar(data);
		});
		this.socket.on('todos',function(data){
		    console.log('todos: ',data);
		    for(var i = 0; i < data.length; i++){
		    	//client.id=data[i].id;
		        juego.agregarJugador(data[jug]);
		    }
		});
		this.socket.on('quitarBicho',function(data){	
			console.log('quitar bicho '+data);
		    juego.quitarBicho(data);        
		});		
		this.socket.on('movimiento',function(data){	
		    //juego.moverNave(data);  
		    //var juego=game.state.states.Boot;
		    //juego.jugadores[data.id].moverHacia(data.x,data.y,data.dir);
		    if (naves[data.id]){
			    moverNave(naves[data.id],data.x,data.y);
			    console.log(data);      
			}
		});
		this.socket.on('puntos',function(data){	
		    juego.puntos(data);        
		});
		this.socket.on('vidas',function(data){	
		    juego.vidas(data);        
		});
		this.socket.on('ganador',function(data){	
			juego.finJuego(data.id);
		    //juego.moverNave(data.id,data.x,data.y,data.ang);        
		});
	}
	//this.ini();
}




function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
