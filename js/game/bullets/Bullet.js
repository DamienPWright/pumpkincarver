function Bullet(X, Y, key, friendly, lifespan, collidesWithWall, speed, dir){
    Actor.call(this, X, Y, key);
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 0.5);
    this.friendly = false;
    this.lifespan = 60; //frames
    this.collidesWithWall = false;
    this.abs_velocity = 300;
    this.movedir = DIR_EAST;
    
    if(friendly){this.friendly = friendly};
    if(collidesWithWall){this.collidesWithWall = collidesWithWall};
    if(lifespan){this.lifespan = lifespan};
    if(speed){this.abs_velocity = speed};
    if(dir)(this.movedir = dir);
    this.dir_angle = (this.movedir / 2) * Math.PI;
    this.body.velocity.x = this.abs_velocity * Math.cos(this.dir_angle);
    this.body.velocity.y = this.abs_velocity * Math.sin(this.dir_angle);
    switch(this.movedir){
        case DIR_EAST:
            this.angle = 0;
            break;
        case DIR_SOUTH:
            this.angle = 90;
            break;
        case DIR_WEST:
            this.angle = 180;
            break;
        case DIR_NORTH:
            this.angle = 270;
            break;
    }
}

Bullet.prototype = Object.create(Actor.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    if(this.collidesWithWall && this.alive){
       this.checkCollideWithWall();
    }
}

Bullet.prototype.checkCollideWithWall = function(){
    if(game.physics.arcade.collide(this, game.state.getCurrentState().wall_layer, this.onCollide, null, this)){
        return;
    }
    
    var tiles = game.state.getCurrentState().wall_layer.getTiles(this.x, this.y, 1, 1, true);
    if(tiles.length > 0){
        this.onCollide();
    }
}

Bullet.prototype.onCollide = function(){
    //console.log(this);
    this.bulletImpact();
    this.kill();
}

Bullet.prototype.bulletImpact = function(){
    //spawn impact effect at impact site
}