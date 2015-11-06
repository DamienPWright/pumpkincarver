function EffSpiderWeb(X, Y){
   Effect.call(this, X, Y, 'eff_spiderweb', 3000);
}

EffSpiderWeb.prototype = Object.create(Effect.prototype);
EffSpiderWeb.prototype.constructor = EffSpiderWeb;