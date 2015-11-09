SEWebbed = function(actor){
    StatusEffect.call(this, actor, 4000, false, true);
    this.statuseffect_id = 1;
}

SEWebbed.prototype = new StatusEffect();
SEWebbed.prototype.constructor = SEWebbed;

SEWebbed.prototype.update = function(actor){
    this.actor.movespeed_mod *= 0.4;
    this.processDuration();
}

SEWebbed.prototype.onEnd = function(actor){
    this.actor.movespeed_mod = 1.0;
    this.dead = true;
}