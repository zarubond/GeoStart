"use strict";

function Game() {
    this.ship = new Ship();
    this.last_time = Date.now();
}

Game.prototype.load = function () {
};

Game.prototype.update = function (elapsed) {
	//ship
    var diff = 0.2 * (elapsed - this.last_time);
    this.last_time = elapsed;
    var sub = vec2.create();
    vec2.subtract(sub, this.ship.target, this.ship.position);
    vec2.normalize(sub, sub);
    vec3.set(this.ship.direction, sub[0], sub[1], 0.0);
    
    var len = vec2.length(sub);
    if( diff > len ) {
        vec2.scale(sub, sub, len);
    }
	else 
    	vec2.scale(sub, sub, diff);
    vec2.add(this.ship.position, this.ship.position, sub);
	//shots
	var tmp,v=vec2.create();
	for(var i=0;i<this.ship.shots.length;i++)
    {
        tmp = this.ship.shots[i];
		v[0] = tmp.direction[0]*diff;
		v[1] = tmp.direction[1]*diff;
		vec2.add(tmp.position,tmp.position,v);
		if(tmp.position[0] < 0 || tmp.position[0] > gl.viewportWidth || tmp.position[1] < 0 || tmp.position[1] > gl.viewportHeight)
		{
			this.ship.shots.splice(i, 1);
		}
		
    }
};

Game.prototype.mouseMove = function (event) {
    vec2.set(this.ship.target, event.clientX, event.clientY);
};

Game.prototype.mousePress = function (event) {
	
};

Game.prototype.mouseRelease = function (event) {
	this.ship.shoot();
};

Game.prototype.keyPress = function (event) {
	
};

Game.prototype.keyRelease = function (event) {
	
};

Game.prototype.resizeEvent = function (event) {
	
};
