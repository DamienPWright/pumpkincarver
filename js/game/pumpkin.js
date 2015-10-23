function Pumpkin(X, Y){
    Actor.call(this, X, Y, 'pumpkin');
    game.physics.arcade.enable(this);
    this.carved = false;
}

Pumpkin.prototype = Object.create(Actor.prototype);
Pumpkin.prototype.constructor = Pumpkin;

Pumpkin.prototype.create = function(){
    
}

Pumpkin.prototype.update = function(){
    
}

Pumpkin.prototype.onPlayerContact = function(){
    //pick a random frame to go to
    var newframe = 1 + Math.round(Math.random() * (3 - 1))
    console.log(newframe);
    this.frame = newframe;
    //mark as dead
    this.carved = true;
}