function Enemy(X, Y, key){
    Actor.call(this, X, Y, key);
    this.dealsContactDamage = false;
    game.physics.arcade.enable(this);
    //=====
    //States
    //=====
    //Idle state
    this.state_Idle = new ActorState(this);
    this.state_Idle.onEnter = function(){
       //
    };
    this.state_Idle.onExit = function(){
    };
    this.state_Idle.update = function(){
        //
    };
    this.fsm.changeState(this.state_Idle);
}

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){
    this.updateActor();
    this.fsm.update();
    this.updateAnimation();
};

Enemy.prototype.checkAttackBox = function (target){
    var detected = false;
    return detected;
};



