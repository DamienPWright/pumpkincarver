function Vampire(X, Y){
    
    Enemy.call(this, X, Y, 'vampire');
    
    this.body.collideWorldBounds = true;
    this.body.setSize(24, 24, 20, 40);
    this.dir = DIR_NORTH;
    this.dealsContactDamage = true;
    this.DEF_MAXVELOCITY = 60;
    this.abs_maxvelocity = this.DEF_MAXVELOCITY;
    //=====
    //States
    //=====
    //Idle state
    this.state_Move = new ActorState(this);
    this.state_Move.onEnter = function(){
       this.actor.pathfind_poll_counter = 0;
    };
    
    this.state_Move.onExit = function(){
        //
    };
    this.state_Move.update = function(){
        //poll the pathfindhelper to determine which way to move
        if(this.actor.pathfind_poll_counter != 0){
            this.actor.pathfind_poll_counter--;
        }
        if(this.actor.pathfind_poll_counter <= 0){
            //poll pathfinding to get direction
            pathfindhelper.pathfind_setMoveDir4D(this.actor, player);
            this.actor.pathfind_poll_counter = this.actor.pathfind_pollrate;
        }
        switch(this.actor.movedir){
            case DIR_NORTH:
                this.actor.body.velocity.y = -this.actor.abs_maxvelocity;
                this.actor.body.velocity.x = 0;
                break;
            case DIR_SOUTH:
                this.actor.body.velocity.y = this.actor.abs_maxvelocity;
                this.actor.body.velocity.x = 0;
                break;
            case DIR_EAST:
                this.actor.body.velocity.x = this.actor.abs_maxvelocity;
                this.actor.body.velocity.y = 0;
                break;
            case DIR_WEST:
                this.actor.body.velocity.x = -this.actor.abs_maxvelocity;
                this.actor.body.velocity.y = 0;
                break;
        }
    };
    this.fsm.changeState(this.state_Move);
    
    this.animations.add('idle_left', [11], 10, true);
    this.animations.add('idle_right', [15], 10, true);
    this.animations.add('idle_up', [7], 10, true);
    this.animations.add('idle_down', [3], 10, true);
    this.animations.add('flash_left', [8], 10, true);
    this.animations.add('flash_right', [12], 10, true);
    this.animations.add('flash_up', [4], 10, true);
    this.animations.add('flash_down', [0], 10, true);
    this.animations.add('run_left',[9, 11, 10, 11] , 8, true);
    this.animations.add('run_right', [13, 15, 14, 15], 8, true);
    this.animations.add('run_up',[5, 7, 6, 7] , 8, true);
    this.animations.add('run_down', [1, 3, 2, 3], 8, true);
}

Vampire.prototype = Object.create(Enemy.prototype);
Vampire.prototype.constructor = Vampire;

Vampire.prototype.updateAnimation = function(){
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