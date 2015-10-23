PathfindHelper = function(){
    this.easystar = new EasyStar.js();   
    this.mapTileSize = 1;
}

/**
 * This must be called before
 */
PathfindHelper.prototype.setMap = function(acceptable_tiles){
    var mapdata = game.state.getCurrentState().map.layers[0].data
    var es_mapgrid = [];
    var sd_grid = [];

    for(var i in mapdata){
        es_mapgrid[i] = [];
        for(var j in mapdata[i]){
            es_mapgrid[i].push(mapdata[i][j].index)
        }
    }
    test2 = es_mapgrid;
    //subdivide it - rough I know but it works. A more elegant solution would be better.
    for(var i = 0; i < mapdata.length; i++){
        var arr = [];
        for(var j in mapdata[i]){
            arr.push(mapdata[i][j].index);
            arr.push(mapdata[i][j].index);
        }
        sd_grid.push(arr);
        sd_grid.push(arr);
    }
    test = sd_grid;
    
    //this.easystar.setGrid(es_mapgrid);
    this.easystar.setGrid(sd_grid);
    this.easystar.setAcceptableTiles([1]);
    
    //this.mapTileSize = game.state.getCurrentState().map.tileWidth;
    this.mapTileSize = 32//game.state.getCurrentState().map.tileWidth;
}

/**
 * Pathfinding helper. Do NOT use this more than 3 times per second per actor. 
 * The frequency it should be called should be tailored to the enemy, the longer between calls 
 * the better. 
 */
PathfindHelper.prototype.pathfind_setMoveDir4D = function(actor_source, actor_target){
    //get tile x/y
    var halftile = this.mapTileSize / 2;
    var x1 = Math.floor((actor_source.body.x) / this.mapTileSize);
    var y1 = Math.floor((actor_source.body.y) / this.mapTileSize);
    var x2 = Math.floor((actor_target.body.x) / this.mapTileSize);
    var y2 = Math.floor((actor_target.body.y) / this.mapTileSize);
    
    //limiter
    if(x1 < 0){x1 = 0}
    if(y1 < 0){y1 = 0}
    if(x2 < 0){x2 = 0}
    if(y2 < 0){y2 = 0}
    
    //console.log(this.mapTileSize);
    //console.log(x1 + " " + y1 + " " + x2 + " " + y2);
    
    this.easystar.findPath(x1, y1, x2, y2, function( path ) {
    	if (!path){
    		console.log("The path to the destination point was not found.");
    		return;
    	}else if(path.length < 1){
    	    return;
    	}else {
    		//work out which direction the enemy should be moving then set the enemy's current move direction to it.
    		//The actual movement should be handled by the enemy's own code
    		if(path[1].x > x1){
    		    if(actor_source.body.blocked.right){
    		        if(actor_target.y < (path[1].y * this.mapTileSize)){
    		            actor_source.movedir = DIR_SOUTH;
    		        }else{
    		            actor_source.movedir = DIR_NORTH;
    		        }
    		    }else{
    			    actor_source.movedir = DIR_EAST;
    		    }
    		}else if(path[1].x < x1){
    		    if(actor_source.body.blocked.left){
    		        if(actor_target.y < (path[1].y * this.mapTileSize)){
    		            actor_source.movedir = DIR_SOUTH;
    		        }else{
    		            actor_source.movedir = DIR_NORTH;
    		        }
    		    }else{
    			    actor_source.movedir = DIR_WEST;
    		    }
    		}else if(path[1].y > y1){
    		    if(actor_source.body.blocked.down){
    		        if(actor_target.x < (path[1].x * this.mapTileSize)){
    		            actor_source.movedir = DIR_EAST;
    		        }else{
    		            actor_source.movedir = DIR_WEST;
    		        }
    		    }else{
    			    actor_source.movedir = DIR_SOUTH;
    		    }
    			
    		}else if(path[1].y < y1){
    		    if(actor_source.body.blocked.up){
    		        if(actor_target.x < (path[1].x * this.mapTileSize)){
    		            actor_source.movedir = DIR_EAST;
    		        }else{
    		            actor_source.movedir = DIR_WEST;
    		        }
    		    }else{
    			    actor_source.movedir = DIR_NORTH;
    		    }
    		}
    	}
    });
    this.easystar.calculate();
}

PathfindHelper.prototype.getValidDirs4D = function(actor){
    
}

pathfindhelper = new PathfindHelper();