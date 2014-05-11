'use strict';
/**
 * Ship data model
 */
function Ship() {
    this.position = vec2.create();
    this.target = vec2.create();
    this.direction = vec3.create();
    this.shots = new Array();
    this.lastShot=Date.now();
}

Ship.prototype.load = function () {
};
/**
 * Make a new shot
 */
Ship.prototype.shoot = function() {
	
	if(Date.now()-this.lastShot<500) return null;
	this.lastShot=Date.now();
	var tmp=new Shot();
	vec3.copy(tmp.direction,this.direction);
	vec3.copy(tmp.position,this.position);
	vec3.normalize(this.direction,this.direction);
	this.shots.push(tmp);
	return tmp;
};
/**
 * Update ship and shot with delta time
 */
Ship.prototype.update = function (diff) {
	if(Math.floor(this.position[0])!=Math.floor(this.target[0]) || Math.floor(this.position[1])!=Math.floor(this.target[1]))
	{
	    var sub = vec2.create();
	    vec2.subtract(sub, this.target, this.position);
	    var len = Math.abs(vec2.length(sub));
	    vec2.normalize(sub, sub);
	    vec3.set(this.direction, sub[0], sub[1], 0.0);
	    
	    var tmp=vec2.create();
	    vec2.scale(tmp, sub, diff*0.5);
	    var len2 = Math.abs(vec2.length(tmp));
	    
	    if( len2 > len ) {
	    	this.position[0]=this.target[0];
	    	this.position[1]=this.target[1];
	    }
		else
		{
	    	vec2.scale(sub, sub, diff*0.5);
	    	vec2.add(this.position, this.position, sub);
		}
	}
    
	//shots
	var tmp,v=vec2.create();
	for(var i=0; i<this.shots.length; i++)
    {
		if(this.shots[i].update(diff))
			this.shots.splice(i, 1);
    }
};
