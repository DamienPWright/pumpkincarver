function Spikeball(X, Y, _movedir, _movedist){
    
    var tempkey = 'spikeball01';
    Enemy.call(this, X, Y, 'spikeball01');
    game.physics.arcade.enable(this);
    this.body.checkCollision = { none: true, any: false, up: false, down: false, left: false, right: false };
    
    this.cur_movedir = DIR_NORTH;
    if(_movedir){
        switch(_movedir){
            case "DIR_NORTH":
                this.cur_movedir = DIR_NORTH;
                break;
            case "DIR_SOUTH":
                this.cur_movedir = DIR_SOUTH;
                break;
            case "DIR_EAST":
                this.cur_movedir = DIR_EAST;
                break;
            case "DIR_wEST":
                this.cur_movedir = DIR_WEST;
                break;
            default:
                console.log("Uknown direction: " + _movedir);
        }
    }

    this.movedist = 150;
    if(_movedist){
        this.movedist = _movedist;
    }

    this.cur_tween = undefined;
    //tween setup
    switch(this.cur_movedir){
        case DIR_NORTH:
            this.cur_tween = game.add.tween(this).to( { y: "-" + this.movedist}, 2000, Phaser.Easing.Sinusoidal.InOut, true);
            break;
        case DIR_SOUTH:
            this.cur_tween = game.add.tween(this).to( { y: "+" + this.movedist}, 2000, Phaser.Easing.Sinusoidal.InOut, true);
            break;
        case DIR_EAST:
            this.cur_tween = game.add.tween(this).to( { x: "+" + this.movedist}, 2000, Phaser.Easing.Sinusoidal.InOut, true);
            break;
        case DIR_WEST:
            this.cur_tween = game.add.tween(this).to( { x: "-" + this.movedist}, 2000, Phaser.Easing.Sinusoidal.InOut, true);
            break;
    }
    this.cur_tween.repeat(-1);
    this.cur_tween.yoyo(true);
    console.log(this.cur_tween);
    //this.moveS = game.add.tween(this).to( { y: this.y + 150 }, 2000, Phaser.Easing.Sinusoidal.InOut, true);
    //this.moveN = game.add.tween(this).to( { y: this.y - 150 }, 2000, Phaser.Easing.Sinusoidal.InOut, true);
    //this.moveS.repeat(-1);
    //this.moveN.repeat(-1);
    //this.moveS.yoyo(true);
    //this.moveN.yoyo(true);
    
    //=====
    //States
    //=====
    //Idle state
    this.state_Move = new ActorState(this);
    this.state_Move.onEnter = function(){
       //
    };
    
    this.state_Move.onExit = function(){
        //
    };
    this.state_Move.update = function(){
        //
    };
    this.fsm.changeState(this.state_Move);
}

Spikeball.prototype = Object.create(Enemy.prototype);
Spikeball.prototype.constructor = Spikeball;

Spikeball.prototype.update = function(){
    
}