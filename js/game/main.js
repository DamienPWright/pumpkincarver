HOR_RES = 800;
VER_RES = 600;

//game consts
DIR_EAST = 0;
DIR_SOUTH = 1;
DIR_WEST = 2;
DIR_NORTH = 3;

current_level = 0;
levels = [
    {levelpath: "assets/maps/graveyard_test.json", tileset: 1}, 
    {levelpath: "assets/maps/spoopyleveltest.json", tileset: 0}, 
    {levelpath: "assets/maps/spoopyleveltest2.json", tileset: 0},
    {levelpath: "assets/maps/spoopyleveltest3.json", tileset: 0},
    {levelpath: "assets/maps/spoopypftest.json", tileset: 0}   
]
tilesets = [
    "assets/img/tilesets/spookymap.png",
    "assets/img/tilesets/graveyard_tiles.png"
]

easystar = new EasyStar.js();

//source: http://stackoverflow.com/questions/1726630/javascript-formatting-number-with-exactly-two-decimals
function round(value, exp){
    if (typeof exp === undefined || +exp === 0)
        return Math.round(value);
        
    value = +value;
    exp = +exp;
    
    if(isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return NaN;
        
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
    
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

function isInRadius(spr_source, spr_target){
    var a = spr_source;
    var b = spr_target;
    
    getDistanceBetween(a, b);
}

function getDistanceBetween(a, b){
   return Phaser.Math.distanceSq(a.x, a.y, b.x, b.y);
}

function boundingBoxWithinRadius(spriteToTest, circle){
    if(!spriteToTest.body){
        //no body to test collision with.
        return false;
    }
    var x1 = spriteToTest.body.x;
    var x2 = spriteToTest.body.x + spriteToTest.body.width;
    var y1 = spriteToTest.body.y;
    var y2 = spriteToTest.body.y + spriteToTest.body.height;
    if(Phaser.Math.distance(x1, y1, circle.x, circle.y) < circle.radius){
        return true;
    }
    if(Phaser.Math.distance(x1, y2, circle.x, circle.y) < circle.radius){
        return true;
    }
    if(Phaser.Math.distance(x2, y1, circle.x, circle.y) < circle.radius){
        return true;
    }
    if(Phaser.Math.distance(x2, y2, circle.x, circle.y) < circle.radius){
        return true;
    }
    
    return false;
}

function boundingBoxWithinAngleRange(spriteToTest, circle, angleA, angleB){
    if(!spriteToTest.body){
        //no body to test collision with.
        return false;
    }
    var x1 = spriteToTest.body.x;
    var x2 = spriteToTest.body.x + spriteToTest.body.width;
    var y1 = spriteToTest.body.y;
    var y2 = spriteToTest.body.y + spriteToTest.body.height;
    
    var a1 = Phaser.Math.angleBetween(x1, y1, circle.x, circle.y) * 180 / Math.PI;
    var a2 = Phaser.Math.angleBetween(x1, y2, circle.x, circle.y) * 180 / Math.PI;
    var a3 = Phaser.Math.angleBetween(x2, y1, circle.x, circle.y) * 180 / Math.PI;
    var a4 = Phaser.Math.angleBetween(x2, y2, circle.x, circle.y) * 180 / Math.PI;
    
    if(angleIsBetween(a1, angleA, angleB)){
        return true;
    }
    if(angleIsBetween(a2, angleA, angleB)){
        return true;
    }
    if(angleIsBetween(a3, angleA, angleB)){
        return true;
    }
    if(angleIsBetween(a4, angleA, angleB)){
        return true;
    }
    
    return false;
}

function angleIsBetween(angleC, angleA, angleB){
	//test which comparator to use
	//angles must be in degrees
	//angles greater than 180 or less than -180 will return false positives.
	//angleA is always the lower bound, B the upper bound, going clockwise.
	if((angleA >= 0 && angleB >= 0) || (angleA < 0 && angleB < 0)){
		if(angleC >= angleA && angleC <= angleB){
			return true;
		}
	}
	if(angleA < 0 && angleB >= 0){
		if((angleC > angleA && angleC <= 0) || (angleC >= 0 && angleC < angleB)){
			return true;
		}
	}
	if(angleA >= 0 && angleB < 0){
		if((angleC > angleA && angleC <= 180) || (angleC <= 0 && angleC < angleB)){
			return true;
		}
	}
	return false;
}
