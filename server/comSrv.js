function ComSrv(){
	this.enviarRemitente=function(socket,mens,datos){
        socket.emit(mens,datos);
    }
    this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }
    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };
	this.lanzarSocketSrv=function(io,juego){
		var cli=this;
		io.on('connection',function(socket){
		    socket.on('room', function(id,room,email) {
		        console.log('nuevo cliente: ',id,room,email);
		        socket.join(room);
		        juego.agregarAPartida(id,room,email,function(nombre,col){
		        	//socket.join(nombre);
		        	cli.enviarATodos(io,nombre,'nuevoJugador',col);
		        	//cli.enviarRemitente(socket,"nuevoJugador",col);
		        	//cli.enviarATodosMenosRemitente(socket,nombre,'nuevoJugador',col);
		        	//io.sockets.in(nombre).emit('nuevoJugador',col);
		        	//socket.emit('nuevoJugador',col);
		        	//socket.broadcast.to(nombre).emit('nuevoJugador',col);
		        });
		    });
		    socket.on('unirme',function(room){
		        //console.log(juego.partidas);
		        juego.unirme(room,function(nombre){
		        	socket.join(nombre);
		        });
		    });
		    socket.on('configuracion',function(room,x,y){
		        //console.log(juego.partidas);
		        if (juego.partidas[room]){
		            juego.partidas[room].iniciar(x,y,function(mens,col){
		            	socket.emit(mens,col);
		            });
		        }
		    })
		    socket.on('nuevoJugador',function(data){        
		         if (juego.partidas[data.room]){
		            juego.partidas[data.room].agregarJugador(data.id,function(nombre,mens,col){
		            	io.sockets.in(nombre).emit(mens,col);
		            });
		        }
		    });
		    socket.on('matarBicho',function(room,ind,id){
		         if (juego.partidas[room]){
		            juego.partidas[room].enviarQuitarBicho(ind,id,function(nombre,mens,val){
		            	io.sockets.in(nombre).emit(mens,val);
		            });
		        }
		    });
		    socket.on('posicion',function(room,data){
		        if (juego.partidas[room]){
		            juego.partidas[room].movimiento(data,function(nombre,mens,valor){
		            //socket.broadcast.to(room).emit('movimiento',data);
		            //io.sockets.in(room).emit('movimiento',data);
		            	cli.enviarATodosMenosRemitente(socket,nombre,'movimiento',data);
		            });
		        }
		    });
		    socket.on('envPuntos',function(room,data){
		        if (juego.partidas[room]){
		            juego.partidas[room].setPuntos(data,function(nombre,mens,val){
		            	socket.broadcast.to(nombre).emit(mens,val);
		            });
		        }
		    });
		    socket.on('envVidas',function(room,data){
		        if (juego.partidas[room]){
		            juego.partidas[room].setVidas(data,function(nombre,mens,val){
		            	//socket.broadcast.to(nombre).emit(mens,val);
		            	io.sockets.in(nombre).emit(mens,val);
		            });
		        }
		    });
		    socket.on('volverAJugar',function(room){
		        //juego=new modelo.Juego();
		         if (juego.partidas[room]){
		            juego.partidas[room].volverAJugar(function(nombre,mens,val){
		            	io.sockets.in(nombre).emit(mens,val);
		            });
		        }
		    });
		});
	}

}

module.exports.ComSrv=ComSrv;