function Effect(X, Y, key, lifespan){
    Phaser.Sprite.call(this, game, X, Y, key);
    this.lifespan = lifespan;
}

Effect.prototype = Object.create(Phaser.Sprite.prototype);
Effect.prototype.constructor = Effect;

Effect.prototype.onContactEffect = function(){
    
}