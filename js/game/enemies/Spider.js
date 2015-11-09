function Spider(X, Y){
    Enemy.call(this, X, Y, 'spider');
    this.body.setSize(32, 30, 17, 31);
    
    this.movedir = DIR_SOUTH;
    
    this.DEF_MAXVELOCITY = 100;
    this.abs_maxvelocity = this.DEF_MAXVELOCITY;
    
    this.persue_count = 0;
    this.PERSUE_TIME = 30;
    this.persue_speed = 200;
    
    this.wait_count = 0;
    this.WAIT_TIME = 240;
    
    this.walk_count = 0;
    this.WALK_TIME = 240;
    
    this.pathfind_pollrate = 15;
    
    this.seekBoxWidth = 128;
    this.seekBoxLength = 256;
    this.seekBoxSize = {w: this.seekBoxWidth , h: this.seekBoxLength};
    this.attackBoxWidth = 16;
    this.attackBoxLength = 256;
    this.attackBoxSize = {w: this.attackBoxWidth , h: this.attackBoxLength};
    this.seekBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.seekBoxSize.w, this.seekBoxSize.h, false, 0, true);
    this.attackBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.attackBoxSize.w, this.attackBoxSize.h, false, 0, true);
    
    //wander around - if player is inside seekbox check if line-of-sight exists. If true, persue
    
    //Persue player - if player is out of range, count down. If count is 0 go back to wandering. 
    //if player is in line of sight and closer than x tiles, fire web projectile
    
    //=====
    //States
    //=====
    //Wait
    this.state_Wait = new ActorState(this);
    this.state_Wait.onEnter = function(){
        this.actor.updateAnimation = this.actor.wanderAnimation;
        //set waiting time
        this.actor.wait_count = this.actor.WAIT_TIME;
        console.log("Spider is waiting");
        this.actor.body.velocity.x = 0;
        this.actor.body.velocity.y = 0;
    };
    
    this.state_Wait.onExit = function(){
        this.actor.wait_count = 0;
    };
    
    this.state_Wait.update = function(){
        //Count down the waiting time and move to state_Walk
        this.actor.wait_count--;
        if(this.actor.wait_count <= 0){
            this.actor.fsm.changeState(this.actor.state_Walk);
        }
        if(this.actor.checkSeekBox(this.actor.movedir, player, this.actor.seekBox, this.actor.seekBoxWidth, this.actor.seekBoxLength)){
            this.actor.fsm.changeState(this.actor.state_Persue);
        };
    };
    
    
    //Walk
    this.state_Walk = new ActorState(this);
    this.state_Walk.onEnter = function(){
        this.actor.updateAnimation = this.actor.wanderAnimation;
        //Pick a random direction from valid movement paths. If none go back to waiting
        //pathfindhelper.getValidDirs4D(this.actor);
        console.log("Spider is walking");
        this.actor.walk_count = this.actor.WALK_TIME;
        this.actor.pickRandomDir4D();
    };
    
    this.state_Walk.onExit = function(){
        this.actor.walk_count = 0;
    };
    
    this.state_Walk.update = function(){
        //poll the pathfindhelper to determine which way to move
        this.actor.moveStrategy(this.actor);
        if(this.actor.body.blocked.up || this.actor.body.blocked.down || this.actor.body.blocked.left || this.actor.body.blocked.right){
            this.actor.pickRandomDir4D();
        }
        this.actor.walk_count--;
        if(this.actor.walk_count <= 0){
            this.actor.fsm.changeState(this.actor.state_Wait);
        }
        if(this.actor.checkSeekBox(this.actor.movedir, player, this.actor.seekBox, this.actor.seekBoxWidth, this.actor.seekBoxLength)){
            this.actor.fsm.changeState(this.actor.state_Persue);
        };
    };
    
    //Persue
    this.state_Persue = new ActorState(this);
    this.state_Persue.onEnter = function(){
       this.actor.updateAnimation = this.actor.persueAnimation;
       this.actor.pathfind_poll_counter = 0;
       
       //set persue speed
       this.actor.abs_maxvelocity = this.actor.persue_speed;
    };
    
    this.state_Persue.onExit = function(){
        //reset move speed
        this.actor.abs_maxvelocity = this.actor.DEF_MAXVELOCITY;
    };
    this.state_Persue.update = function(){
        //poll the pathfindhelper to determine which way to move
        if(this.actor.pathfind_poll_counter != 0){
            this.actor.pathfind_poll_counter--;
        }
        if(this.actor.pathfind_poll_counter <= 0){
            //poll pathfinding to get direction
            pathfindhelper.pathfind_setMoveDir4D(this.actor, player);
            this.actor.pathfind_poll_counter = this.actor.pathfind_pollrate;
        }
        this.actor.moveStrategy(this.actor);
        //check distance to player
        //if it's higher than a given amount, count down
    };
    this.fsm.changeState(this.state_Wait);
    
    /* Animations */
    this.animations.add('idle_left', [8], 10, true);
    this.animations.add('idle_right', [12], 10, true);
    this.animations.add('idle_up', [4], 10, true);
    this.animations.add('idle_down', [0], 10, true);
    this.animations.add('run_left',[9, 8, 10, 8] , 8, true);
    this.animations.add('run_right', [13, 12, 14, 12], 8, true);
    this.animations.add('run_up',[5, 4, 6, 4] , 8, true);
    this.animations.add('run_down', [1, 0, 2, 0], 8, true);
    this.animations.add('chase_left',[9, 8, 10, 8] , 16, true);
    this.animations.add('chase_right', [13, 12, 14, 12], 16, true);
    this.animations.add('chase_up',[5, 4, 6, 4] , 16, true);
    this.animations.add('chase_down', [1, 0, 2, 0], 16, true);
}

Spider.prototype = Object.create(Enemy.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.moveStrategy = function(ctx){
    switch(ctx.movedir){
        case DIR_NORTH:
            ctx.body.velocity.y = -ctx.abs_maxvelocity;
            ctx.body.velocity.x = 0;
            break;
        case DIR_SOUTH:
            ctx.body.velocity.y = ctx.abs_maxvelocity;
            ctx.body.velocity.x = 0;
            break;
        case DIR_EAST:
            ctx.body.velocity.x = ctx.abs_maxvelocity;
            ctx.body.velocity.y = 0;
            break;
        case DIR_WEST:
            ctx.body.velocity.x = -ctx.abs_maxvelocity;
            ctx.body.velocity.y = 0;
            break;
    }
}

Spider.prototype.wanderAnimation = function(){
    var anim = "";
    if(this.body.velocity.x != 0 || this.body.velocity.y != 0){
        switch(this.movedir){
            case DIR_NORTH:
                anim = 'run_up';
                break;
            case DIR_SOUTH:
                anim = 'run_down';
                break;
            case DIR_EAST:
                anim = 'run_right';
                break;
            case DIR_WEST:
                anim = 'run_left';
                break;
        }
    }else{
        switch(this.movedir){
            case DIR_NORTH:
                anim = 'idle_up';
                break;
            case DIR_SOUTH:
                anim = 'idle_down';
                break;
            case DIR_EAST:
                anim = 'idle_right';
                break;
            case DIR_WEST:
                anim = 'idle_left';
                break;
        }
    }
    this.animations.play(anim);
}

Spider.prototype.persueAnimation = function(){
    var anim = "";
    if(this.body.velocity.x != 0 || this.body.velocity.y != 0){
        switch(this.movedir){
            case DIR_NORTH:
                anim = 'chase_up';
                break;
            case DIR_SOUTH:
                anim = 'chase_down';
                break;
            case DIR_EAST:
                anim = 'chase_right';
                break;
            case DIR_WEST:
                anim = 'chase_left';
                break;
        }
    }
    this.animations.play(anim);
}

Spider.prototype.render = function(){
    game.debug.geom(this.los_detector);
}