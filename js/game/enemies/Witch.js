function Witch(X, Y){
    Enemy.call(this, X, Y, "witch");
}

Witch.prototype = Object.create(Enemy.prototype);
Witch.prototype.constructor = Witch;