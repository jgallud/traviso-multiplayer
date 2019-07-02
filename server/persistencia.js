var mongo=require("mongodb").MongoClient;
var ObjectID=require("mongodb").ObjectID;
//var url="https://proyectobase.herokuapp.com/";
//var mail=require("./email.js");


function Persistencia(){
    this.usuariosCol=undefined;
    this.resultadosCol=undefined;

    this.encontrarUsuario=function(email,callback){
        encontrar(this.usuariosCol,{email:email},callback);
    };

    this.encontrarUsuarioCriterio=function(criterio,callback){
        encontrar(this.usuariosCol,criterio,callback);
    };

    this.encontrarResultadosCriterio=function(criterio,callback){
        encontrar(this.resultadosCol,criterio,callback);
    };

    this.encontrarTodosResultados=function(callback){
        encontrarTodos(this.resultadosCol,callback);
    };
    this.confirmarCuenta=function(email,key,callback){
        encontrar(this.usuariosCol,{email:email,key:key,confirmada:false},callback);
    };

    function encontrar(coleccion,criterio,callback){
        coleccion.find(criterio).toArray(function(error,usr){
            if (usr.length==0){
                callback(undefined);
                //response.send({'email':''});
            }
            else{
                callback(usr[0]);
                //juego.agregarUsuario(usr[0]);
                //response.send(usr[0]);
            }
        });
    };

    function encontrarTodos(coleccion,callback){
        coleccion.find().toArray(function(error,usr){
            callback(usr);
        });
    };


    this.modificarColeccionUsuarios=function(usr,callback){
        modificarColeccion(this.usuariosCol,usr,callback);
    }

    this.modificarColeccionResultados=function(resu,callback){
        modificarColeccion(this.resultadosCol,resu,callback);
    }


    function modificarColeccion(coleccion,usr,callback){
        coleccion.findAndModify({_id:ObjectID(usr._id)},{},usr,{},function(err,result){
            if (err){
                console.log("No se pudo actualizar (método genérico)");
            }
            else{     
                console.log("Usuario actualizado"); 
            }
            callback(result);
        });
    }

    //module.exports.modificarColeccion=modificarColeccion;


    this.insertarUsuario=function(usu,callback){
        insertar(this.usuariosCol,usu,callback);
    }

    this.insertarResultado=function(resu,callback){
        insertar(this.resultadosCol,resu,callback);
    }

    function insertar(coleccion,usu,callback){
        coleccion.insert(usu,function(err,result){
            if(err){
                console.log("error");
            }
            else{
                console.log("Nuevo elemento creado: "+usu.email);
                callback(usu);
                /*
                juego.agregarUsuario(usu);
                //response.send("<h1>Conquista Niveles: Cuenta confirmada</h1>");                
                response.redirect("/");
                */
            }
        });
    }

    //module.exports.insertarUsuario=insertarUsuario;

    this.eliminarUsuario=function(uid,callback){
        eliminar(this.usuariosCol,{_id:ObjectID(uid)},callback);
    }


    function eliminar(coleccion,criterio,callback){
        coleccion.remove(criterio,function(err,result){
                //console.log(result);
            if(!err){
                callback(result);
            }
        });
    }

//module.exports.eliminar=eliminar;

    this.conectar=function(callback){
        var pers=this;
        mongo.connect("mongodb://xxxxxxxxxx", function(err, db) {
            if (err){
                console.log("No pudo conectar a la base de datos")
            }
            else{
                console.log("conectado a Mongo: usuarioscn");
                db.collection("usuarios",function(err,col){
                    if (err){
                        console.log("No pude obtener la coleccion")
                    }
                    else{       
                        console.log("tenemos la colección usuarios");
                        //juego.iniUsuarios(col);
                        pers.usuariosCol=col;   
                    }
                    //db.close();
                });
                db.collection("resultados",function(err,col){
                    if (err){
                        console.log("No pude obtener la coleccion resultados")
                    }
                    else{       
                        console.log("tenemos la colección resultados");
                        //juego.iniUsuarios(col);
                        pers.resultadosCol=col;   
                    }
                });
                callback(db);
            }
        });
    }

}

module.exports.Persistencia=Persistencia;