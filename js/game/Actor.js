function Actor(X, Y, key, HP){
    Phaser.Sprite.call(this, game, X, Y, key);
    this.maxHP = 3;
    if(HP){
        this.maxHP = HP;
    }
    this.curHP = this.maxHP;
    this.status_effects = [];
    this.blinkTimer = 30;
    this.blinkCount = 0;
    this.blinking = false;
    this.interruptTime = 10;
    this.interruptCounter = 0;
    this.interrupted = false;
    
    this.DEF_MAXVELOCITY = 0;
    this.abs_maxvelocity = this.DEF_MAXVELOCITY;
    this.movespeed_mod = 1.0;
    
    this.movedir = DIR_NORTH;
    
    this.pathfind_pollrate = 30;
    this.pathfind_poll_counter = 0;
    
    this.fsm = new FiniteStateMachine();
    
    this.seekBoxSize = {w: 1, h: 1};
    this.seekBoxWidth = 0;
    this.seekBoxLength = 0;
    //this.seekBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.seekBoxSize.w, this.seekBoxSize.h, false, 0, true);
    this.attackBoxSize = {w: 32, h: 20}; // A seek box used to trigger the attack state
    //this.attackBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.attackBoxSize.w, this.attackBoxSize.h, false, 0, true);
    this.los_detector = new Phaser.Line();
}

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.constructor = Actor;

Actor.prototype.updateActor = function(){
    if(this.blinking){
        this.blink();
    }
    this.normaliseStats();
    this.updateStatusEffects();
}

Actor.prototype.blink = function(){
    this.blinkCount++;
    if(this.blinkCount % 3 != 2){
        this.renderable = false;
    }else{
        this.renderable = true;
    }
    if(this.blinkCount >= this.blinkTimer){
        this.blinkCount = 0;
        this.renderable = true;
        this.blinking = false;
    }
}

Actor.prototype.takeDamage = function(){
    if(!this.blinking){
        this.curHP--;
        if(this.curHP <= 0){
            this.onDeath();
        }
    }
}

Actor.prototype.onDeath = function(){
    this.destroy();
}

Actor.prototype.updateAnimation = function(){
    //override this for animations
}

Actor.prototype.checkSeekBox = function(posKey, target, seekbox, width, height){
    var detected = false;
    //console.log(width + " " + height);
    switch(posKey){
        case DIR_NORTH:
            seekbox.width = width;
            seekbox.height = height;
            seekbox.x = this.body.x - (seekbox.width / 2) + (this.body.width / 2);
            seekbox.y = this.body.y - seekbox.body.height
            break;
        case DIR_SOUTH:
            seekbox.width = width;
            seekbox.height = height;
            seekbox.x = this.body.x - (seekbox.body.width / 2) + (this.body.width / 2);
            seekbox.y = this.body.y + this.body.height;
            break;
        case DIR_EAST:
            seekbox.width = height;
            seekbox.height = width;
            seekbox.x = this.body.x + this.body.width
            seekbox.y = this.body.y - (seekbox.body.height / 2) + (this.body.height / 2)
            break;
        case DIR_WEST:
            seekbox.width = height;
            seekbox.height = width;
            seekbox.x = this.body.x - seekbox.body.width
            seekbox.y = this.body.y - (seekbox.body.height / 2) + (this.body.height / 2)
            break;
        case 'centered':
            seekbox.x = this.x + (this.width / 2) + (seekbox.body.width / 2);
            seekbox.y = this.y;
            break;
    }
    if(seekbox.overlap(target)){
        detected = true;
    }
    //Now check line of sight
    if(detected){
        this.los_detector.start.set(this.body.x + (this.body.width / 2), this.body.y + (this.body.height / 2));
        this.los_detector.end.set(target.body.x + (target.body.width / 2), target.body.y + (target.body.height / 2));
        var tileHits = game.state.getCurrentState().wall_layer.getRayCastTiles(this.los_detector, 4, true, false);
        if(tileHits.length > 0){
            detected = false;
        }
    }
    return detected;
};

Actor.prototype.pickRandomDir4D = function(){
    var r = Math.round(Math.random() * 3);
    switch(r){
        case 0:
            this.movedir = DIR_NORTH;
            break;
        case 1:
            this.movedir = DIR_SOUTH;
            break;
        case 2:
            this.movedir = DIR_EAST;
            break;
        case 3:
            this.movedir = DIR_WEST;
            break;
    }
}

Actor.prototype.updateStatusEffects = function(){
    for(var i in this.status_effects){
        this.status_effects[i].update();
        if(this.status_effects[i].dead){
            this.status_effects.splice(i, 1);
        }
    }
}
/**
 * @desc - Called before running through status effects. This sets the values back to their standard
 */
Actor.prototype.normaliseStats = function(){
   this.movespeed_mod = 1.0; 
}

/**
 * @param {StatusEffect} se
 */
Actor.prototype.inflictStatusEffect = function(se){
    if(se){
        //may want to include a check that refreshes an se if it already exists
        if(this.status_effects.length == 0){
            this.status_effects.push(se);
            return;
        }
        for(var i in this.status_effects){
            //console.log(this.status_effects[i].statuseffect_id  + " " + se.statuseffect_id)
            if(this.status_effects[i].statuseffect_id == se.statuseffect_id){
                //check stacking behaviour
                if(se.stacks){
                    this.status_effects.push(se);
                    return;
                }
                if(se.re_applicable){
                    this.status_effects[i].duration = se.duration;
                    //console.log("reapplied")
                    return;
                }else{
                    return;
                }
            }
        }
    }
}