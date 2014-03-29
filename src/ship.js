'use strict';

function Ship() {
    this.position = vec2.create();
    this.target = vec2.create();
    this.direction = vec3.create();
    this.shots = new Array();
}


Ship.prototype.load = function () {
};

Ship.prototype.shoot = function() {
	
	var tmp=new Shot();
	vec3.copy(tmp.direction,this.direction);
	vec3.copy(tmp.position,this.position);
	this.shots.push(tmp);
};