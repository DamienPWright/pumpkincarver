function LevelClear(game){
    this.game = game;
    this.cursors;
    this.enterKey;
    this.selector;
    this.selectorPos = 0;
    this.num_menu_objects = 2;
    this.selPosX = 50;
    this.selPosY = [100, 110];
    this.selectorHoldTime = 10;
    this.selectorHoldCounter = 0
}

LevelClear.prototype.preload = function(){
     game.load.image('title_select', 'assets/img/ui/titleselector.png');
}

LevelClear.prototype.create = function(){
    scoreText = game.add.text(16, 16, '', {fontSize: '32px', fill: '#FFF'});
    this.enterKey =  game.input.keyboard.addKey(13);
    
    game.add.text(16, 16, 'Level ' + current_level + ' Clear! ', {font: '16px Arial', fill: '#FFF'});
    game.add.text(this.selPosX, this.selPosY[0], 'Next Level', {font: '10px Arial', fill: '#FFF'});
}

LevelClear.prototype.update = function() {
    if(this.enterKey.isDown){
        if(current_level < levels.length){
            game.state.start('tmxlevel');
        }else{
            //game.state.start('gameclear');
        }
    }
}