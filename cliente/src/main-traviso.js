var pixiRoot;
var engine;
var naves={};
var naveLocal;

function inicio(){
	pixiRoot = new PIXI.Application(800, 600, { backgroundColor : 0x6BACDE });

    // add the renderer view element to the DOM
    //document.body.appendChild(pixiRoot.view);
    //cadena=cadena+"<div id='espacio'>pixiRoot.view</div>";
    $('#espacio').append(pixiRoot.view);
    //$("#canvas").append(cadena);
    ////// Here, we create our traviso instance and add on top of pixi
    
    // engine-instance configuration object
    var instanceConfig = {
        mapDataPath: "cliente/views/mapData.json", // the path to the json file that defines map data, required
        assetsToLoad: ["cliente/assets/assets_map.json", "cliente/assets/assets_characters.json"], // array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null
		engineInstanceReadyCallback : onEngineInstanceReady,
		tileSelectCallback : onTileSelect,
		objectSelectCallback : onObjectSelect,
    	objectReachedDestinationCallback : onObjectReachedDestination,
    	otherObjectsOnTheNextTileCallback : onOtherObjectsOnTheNextTile,        
    };

    engine = TRAVISO.getEngineInstance(instanceConfig);
    //pixiRoot.stage.addChild(engine);
    //createAndStartBoxAnim()
}

	//var engine = TRAVISO.getEngineInstance(instanceConfig);

function onEngineInstanceReady()
{
	    pixiRoot.stage.addChild(engine);
        //naveLocal=engine.getCurrentControllable();
        cliente.ini();
        //mostrarNave(3,3);
	}

// this method will be called everytime a tile is selected in the engine
function onTileSelect(rowIndex, columnIndex)
{
            
}
    
// this method will be called when a tile with an interactive map-object on it is selected
function onObjectSelect(obj)
{
    engine.moveCurrentControllableToLocation(obj.mapPos);
    //mostrarNave();
}

function onObjectReachedDestination(obj)
{
    var objectsOnDestination = engine.getObjectsAtLocation(obj.mapPos);
    //console.log("hola");
    for (var i=0; i < objectsOnDestination.length; i++)
    {
        //cliente.enviarPosicion(obj.mapPos.c,obj.mapPos.r,"nada");
        // check if there is a flag on the destination tile
        if(objectsOnDestination[i].type === 10)
        {
            obj.changeVisual("flip", false, true, flipAnimFinished);
            break;
        }
    }
    if (obj==naveLocal){
        cliente.enviarPosicion(obj.mapPos.c,obj.mapPos.r,"nada");
    }
}

function flipAnimFinished (obj)
{
    // change the visual of the object so that it will face its last direction    
    obj.changeVisualToDirection(obj.currentDirection, false);
}

function agregarNaveLocal(datos){
    var nave;
    if (naves[datos.id]==null){
        //var sprite=new PIXI.Sprite(PIXI.Texture.from('hero_stand_se_0001.png'));
        // sprite.anchor.set(0.5);
        // //sprite.x=datos.x;
        // //sprite.y=datos.y;
        // //nave.addChild(sprite);

        //nave=engine.addCustomObjectToLocation(sprite, {c:6,r:10});
        
        // //nave.x=datos.x;
        // //nave.y=datos.y;
        console.log(datos);
        nave=engine.createAndAddObjectToLocation(datos.spriteId,{c:4,r:10});
        engine.setCurrentControllable(nave);
        naveLocal=nave;
        //nave=engine.getObjectsAtRowAndColumn(10,4);
        naves[datos.id]=nave;

    }
}

function agregarNave(datos)
{
    //var nave=new PIXI.Container();
    //pixiRoot.stage.addChild(nave);
    var nave;
    if (naves[datos.id]==null){
        //var sprite=new PIXI.Sprite(PIXI.Texture.from('hero_stand_se_0001.png'));
        // sprite.anchor.set(0.5);
        // //sprite.x=datos.x;
        // //sprite.y=datos.y;
        // //nave.addChild(sprite);

        //nave=engine.addCustomObjectToLocation(sprite, {c:6,r:10});
        
        // //nave.x=datos.x;
        // //nave.y=datos.y;
        console.log(datos);
        nave=engine.createAndAddObjectToLocation(datos.spriteId,{c:4,r:10});
        //nave=engine.getObjectsAtRowAndColumn(10,4);
        naves[datos.id]=nave;

    }
}

function moverNave(nave,x,y)
{
    // nave.x=x;
    // nave.y=y;
    // nave.anchor.set(0.5);
    //engine.moveObjectToLocation(nave,{c:x,r:y});
    //engine.moveCurrentControllableToLocation({r:x,c:y});//obj.mapPos);
    //engine.checkAndMoveObjectToLocation(nave,{r:x,c:y});
    engine.moveObjThrough(nave,engine.getPath(nave.mapPos,{c:x,r:y}))
}

function onOtherObjectsOnTheNextTile(movingObject, objectsOnNewTile)
{
    var boxAnim;
    for (var i=0; i < objectsOnNewTile.length; i++)
    {
        // check if there are boxes on the next tile
        if(objectsOnNewTile[i].type === 9)
        {
            boxAnim = createAndStartBoxAnim();
            engine.addCustomObjectToLocation(boxAnim, objectsOnNewTile[i].mapPos);
            engine.removeObjectFromLocation(objectsOnNewTile[i]);
        }
    }
}

function createAndStartBoxAnim()
{
    // create six seperate boxes to spread
    var boxAnim = new PIXI.Container();
    var t = PIXI.Texture.fromFrame("box.png");
    var box;
    var boxes = [];
    for (var i=0; i < 6; i++)
    {
        box = new PIXI.extras.AnimatedSprite([t]);
        box.anchor.x = box.anchor.y = 0.5;
        boxAnim.addChild(box);
        boxes[boxes.length] = box;
    }
    
    // play a simple spread anim for the boxes
    var boxTargets = [[-75, -125], [-50, -100], [-25, -75], [25, -75], [50, -100], [75, -125]];
    for (var i=0; i < boxes.length; i++)
    {
        TweenLite.to( boxes[i].position, 0.5, { x: boxTargets[i][0], y: boxTargets[i][1], ease:"Back.easeOut" } );
        TweenLite.to( boxes[i], 0.7, { alpha: 0 } );
    }
    
    return boxAnim;
}