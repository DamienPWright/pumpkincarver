function EffSpiderWeb(X, Y){
   Effect.call(this, X, Y, 'eff_spiderweb', 3000);
   game.physics.arcade.enable(this);
}

EffSpiderWeb.prototype = Object.create(Effect.prototype);
EffSpiderWeb.prototype.constructor = EffSpiderWeb;

EffSpiderWeb.prototype.update = function(){
    if(this.alive){
        if(this.overlap(player)){
            this.onContactEffect(this, player);
        }
        game.physics.arcade.overlap(this, game.state.getCurrentState().enemies, this.onContactEffect, null, this)
    }
    
    
}

EffSpiderWeb.prototype.onContactEffect = function(obja, objb){
    console.log(objb);
}