function HitBox(game, X, Y, W, H, key, friendly, lifespan, circle){
    Phaser.Sprite.call(this, game, X, Y, key);
    //this.x = X;
    //this.y = Y;
     game.physics.arcade.enable(this);
    this.scale.x = W;
    this.scale.y = H;
    this.friendly = friendly;
    this.lifespan = lifespan;
    //some hitboxes may have circles for more precise collision checking
    this.circle = circle;
    
    //debug
    this.draw = true;
    
    if(this.draw){
        var g = game.add.graphics(this.x, this.y);
        // draw a rectangle
        g.beginFill(0x0000FF, 0.4);
        g.drawRect(this.x, this.y, 1, 1);
        g.endFill();
        if(this.circle){
            g.beginFill(0xff0000, 0.3);
            g.drawCircle(this.circle.x, this.circle.y, this.circle.radius);
            g.endFill();
        }
        this.addChild(g)
    }
}

//  Here is a custom game object
HitBox.prototype = Object.create(Phaser.Sprite.prototype);
HitBox.prototype.constructor = HitBox;


HitBox.prototype.update = function(){
    //use this for any hitbox unique functionality
};

function ExtendHitBox(game, X, Y){
    HitBox.call(this, game, X, Y, 'blanksprite', true, 1000);
}

function getCircle(){
    if(this.hasCircle){
        return this.radius;
    }
    return false;
}
//ExtendHitBox.prototype = Object.create(HitBox.prototype);
//ExtendHitBox.prototype.constructor = ExtendHitBox;
//console.log("test");    
//test = new HitBox(50, 50, 50, 50, true, 600);
//console.log(test);
