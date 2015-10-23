function Werewolf(X, Y){
    Enemy.call(this, X, Y, "werewolf");
}

Werewolf.prototype = Object.create(Enemy.prototype);
Werewolf.prototype.constructor = Werewolf;