function TmxLevel(){
    this._tilemap = 1;
    this._tileimage = 1;
    this.level = current_level;
    this.pumpkins_remaining = 0;
}

TmxLevel.prototype.preload = function() {
   game.load.tilemap('tilemap', levels[current_level].levelpath, null, Phaser.Tilemap.TILED_JSON);
   game.load.image('tileset', tilesets[levels[current_level].tileset]);
};

TmxLevel.prototype.create = function() {
    //game rules
    this.pumpkins_remaining = 0;
    
    //Physics
   game.physics.startSystem(Phaser.Physics.ARCADE);
   //game.physics.arcade.gravity.y = 250; //Enable if gravity is required.
    
    
   game.stage.backgroundColor = "#000000";
   if(this._tilemap != null && this._tileimage != null){
       this.map = game.add.tilemap('tilemap'); 
       this.map.addTilesetImage( this.map.tilesets[0].name, 'tileset');
       this.bkg_layer = this.map.createLayer('bkg');
       this.wall_layer = this.map.createLayer('wall');
       this.map.setCollisionByExclusion([0], true, this.wall_layer);
       this.wall_layer.resizeWorld();
       //init pathfinding
       /* global pathfindhelper */
       pathfindhelper.setMap();
       console.log("Map Loaded");
   }else{
       console.log("Tilemap or tileset image not set");
   }
   
    //init sprite groups
    this.enemies = game.add.group();
    this.enemies_contactdamage = game.add.group();
    this.pumpkins = game.add.group();
    this.hitboxes_unfriendly = game.add.group();
    this.hitboxes_friendly = game.add.group();
    this.hitboxes_seek = game.add.group();
    
   //make player
   
   playerchar = new Player(0,0);
   player = game.add.existing(playerchar)
   this.p = player;
   game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
   
   
   //load objects from the map
   this.createObjectsFromMap();
   
    //game.add.existing(this.goal);
   
    //controls
    this.cursors = game.input.keyboard.createCursorKeys();
    this.spaceBar =  game.input.keyboard.addKey(32);
    
    //this.hud = new HUD();
};

TmxLevel.prototype.update = function() {
    //game.physics.arcade.collide(this.p, this.enemies);
    
    game.physics.arcade.overlap(this.hitboxes_friendly, this.enemies, this.onFriendlyOverlapWithEnemy);
    game.physics.arcade.overlap(this.hitboxes_unfriendly, this.p, this.onUnfriendlyOverlapWithPlayer);
    game.physics.arcade.overlap(this.pumpkins, player, this.pumpkinCollide);
    game.physics.arcade.overlap(this.enemies_contactdamage, player, function(en, pl){console.log("overlapped with " + en)});
    
    game.physics.arcade.collide(this.enemies, this.wall_layer);
    game.physics.arcade.collide(this.p, this.wall_layer);
};


TmxLevel.prototype.createObjectsFromMap = function(){
    console.log("Load Objects")
    var objs = this.map.objects.objects;
    maptest = this.map;
    for(var i in objs){
        console.log(objs[i].name)
        //console.log(objs[i].x);
        switch(objs[i].name){
            case 'player':
                //player already exists so just set its position
                player.x = objs[i].x;
                player.y = objs[i].y - player.height;
                break;
            case 'enemy':
                console.log('en ' + objs[i].properties.type);
                this.createEnemiesFromMap(objs[i]);
                break;
            case 'spikeball':
                console.log('spikeball ' + objs[i].gid);
                var movedir = objs[i].properties._movedir;
                var movedist = objs[i].properties._movedist;
                console.log("movedir " + movedir + " movedist " + movedist)
                var newspikeball = new Spikeball(objs[i].x, objs[i].y - 64, movedir, movedist);
                this.enemies.add(newspikeball);
                this.enemies_contactdamage.add(newspikeball);
                break;
            case 'pumpkin':
                console.log('pumpkin ' + objs[i].gid);
                var newpumpkin = new Pumpkin(objs[i].x, objs[i].y - 64);
                this.pumpkins_remaining++;
                this.pumpkins.add(newpumpkin);
                break;
        }
    }
}

TmxLevel.prototype.createEnemiesFromMap = function(en){
    var newenemy;
    
    switch(en.properties.type){
        case 197:
            newenemy = new EnemyMinion(en.x, en.y - 32);
            break;
        case 194:
            newenemy = new EnemySnail(en.x, en.y - 32);
            break;
        case "vampire":
            newenemy = new Vampire(en.x, en.y - 32);
            break;
        case "spider":
            newenemy = new Spider(en.x, en.y - 32);
            break;
    }
    
    if(newenemy){
        this.enemies.add(newenemy);
        if(newenemy.dealsContactDamage){
            console.log("contact damage enemy created");
            //this.enemies_contactdamage.add(newenemy);
        }
    }else{
        console.log("Invalid enemy: " + en.properties.type)
    }
}

TmxLevel.prototype.createItemsFromMap = function(itm){
    var newitem;
    
    switch(itm.gid){
        case 205:
            console.log("points item goes here");
            break;
    }
    
    if(newitem){
        this.items.add(newitem);
    }else{
        console.log("invalid item: " + itm.gid)
    }
}

TmxLevel.prototype.createHazardsFromMap = function(hzd){
    var newhazard;
    
    switch(hzd.gid){
        case 204:
            console.log("spikes go here");
            break;
    }
    
    if(newhazard){
        this.hazards.add(newhazard);
    }else{
        console.log("invalid spikes: " + hzd.gid)
    }
}

TmxLevel.prototype.createHitBox = function(X, Y, W, H, friendly, lifespan, seek){
    var spr = game.add.sprite(X, Y, 'blanksprite');
    game.physics.enable(spr, Phaser.Physics.ARCADE);
    spr.body.immovable = true;
    spr.body.allowGravity = false;
    spr.width = W;
    spr.height = H;
    spr.lifespan = lifespan;
    //spr.body.setSize(W, H, 0, 0);
    spr.renderable = false;
    //spr.visible = false;
    if(seek){
        this.hitboxes_seek.add(spr);
        return spr;
    }
    if(friendly){
        this.hitboxes_friendly.add(spr);
        console.log("added?")
    }else{
        this.hitboxes_unfriendly.add(spr);
    }
    return spr;
};

TmxLevel.prototype.onHitboxOverlapSprite = function(hb, spr){
    if(hb.friendly){
       console.log("enemy was hit!"); 
    }else if(!hb.friendly){
       console.log("player was hit!");
    }
    hb.destroy();
}

TmxLevel.prototype.onFriendlyOverlapWithEnemy = function(hb, ene){
    console.log("enemy was hit! " + ene);
    hb.destroy();
    ene.takeDamage();
    ene.blinking = true;
}

TmxLevel.prototype.onUnfriendlyOverlapWithPlayer = function(plyr, hb){
    
    hb.destroy();
    if(!player.blinking){
        player.takeDamage();
        player.blinking = true;
        game.state.getCurrentState().hud.updateLifeBar();
    }
    
}

TmxLevel.prototype.pumpkinCollide = function(hb, pumpkin){
    if(!pumpkin.carved){
        pumpkin.onPlayerContact();
        game.state.getCurrentState().pumpkins_remaining--;
        game.state.getCurrentState().checkPumpkins();
    }
}

TmxLevel.prototype.checkPumpkins = function(){
    if(this.pumpkins_remaining <= 0){
        console.log("Level complete!");
        game.state.start("levelclear");
        current_level +=1;
    }
}

TmxLevel.prototype.onPlayerReachGoal = function(){
    game.state.start("gameclear");
}

TmxLevel.prototype.incrementScore = function(pts){
    if(pts){
        this.hud.updateScore(pts);
    }
}

/**
 * Rendering stuff. Use this to draw hitboxes for tweaking etc
 * 
 * 
 */
 
TmxLevel.prototype.render = function(){
    //debug - due to the scaling it has to be done before pixel.context.drawImage or else it will be drawn underneath!
    this.enemies.forEachExists(this.renderGroup, this, 1);
    this.hitboxes_friendly.forEachExists(this.renderGroup, this, 0);
    this.hitboxes_unfriendly.forEachExists(this.renderGroup, this, 1);
    this.hitboxes_seek.forEachExists(this.renderGroup, this, 2);
    game.debug.body(player);
};

TmxLevel.prototype.debug = function(){
    
};

TmxLevel.prototype.renderGroup = function(member, n){
    switch(n){
        case 0:
            game.debug.body(member, 'rgba(0,255,0,0.4)');
            break;
        case 1:
            game.debug.body(member, 'rgba(255,0,0,0.4)');
            break;
        case 2:
            game.debug.body(member, 'rgba(0,200,200,0.4)');
            break;
    }
   
};