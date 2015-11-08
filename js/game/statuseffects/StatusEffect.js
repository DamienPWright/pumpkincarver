/**
 * @param {Actor} actor - The target actor the effect is applied to
 * @param {Number} duration - Set the time in milliseconds that the status effect will last for.
 * @property {Actor} actor - The target actor the effect is applied to
 * @property {Number=0} duration - Time the status effect lasts in milliseconds.
 * @property {boolean=false} dead - Set to true to mark the status effect for purging.
 */
 
StatusEffect = function(actor, duration){
    this.actor = actor;
    this.duration = 0; 
    this.dead = false 
    if(duration){this.duration = duration}
}

StatusEffect.prototype.update = function(){
    
}

StatusEffect.prototype.processDuration = function(){
    this.duration -= game.time.physicsElapsedMS;
    if(this.duration <= 0){
        this.onEnd();
    }
}

StatusEffect.prototype.onEnd = function(){
    
}