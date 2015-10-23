function Zombie(X, Y){
    Enemy.call(this, X, Y, "zombie");
}

Zombie.prototype = Object.create(Enemy.prototype);
Zombie.prototype.constructor = Zombie;