/**
 * @param {Number} X
 * @param {Number} Y
 * @param {Boolean} friendly - if true it won't harm the player and will harm enemies. False flips this behavior
 * @param {Number} dir - The direction the bullet will travel. Use the DIR_NORTH etc constants.
 */
function BulletSpider(X, Y, friendly, dir){
    Bullet.call(this, X, Y, 'bullet_spider', friendly, 8000, true, 600, dir);
    
    this.friendly = false;
    if(friendly){this.friendly = friendly};
}

BulletSpider.prototype = Object.create(Bullet.prototype);
BulletSpider.prototype.constructor = BulletSpider;

Bullet.prototype.bulletImpact = function(){
    var effX = this.x;
    var effY = this.y;
    
    switch(this.movedir){
        case DIR_EAST: 
            effX = effX - 48;
            effY = effY - 32;
            break;
        case DIR_NORTH:
            effX = effX - 32;
            effY = effY;
            break;
        case DIR_SOUTH:
            effX = effX - 32;
            effY = effY - 48;
            break;
        case DIR_EAST:
            effX = effX;
            effY = effY - 32;
            break;
    }
    game.state.getCurrentState().createEffect(effX, effY, "spiderweb")
}