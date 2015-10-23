function Pumpkinman(X, Y){
    Enemy.call(this, X, Y, 'pumpkinman');
    
    //Idle, wait until player touches pumpkinman
    
    //rise up, be MAD
    
    //persue the player when hitting the player do an angry cheer
}


Pumpkinman.prototype = Object.create(Enemy.prototype);
Pumpkinman.prototype.constructor = Pumpkinman;
