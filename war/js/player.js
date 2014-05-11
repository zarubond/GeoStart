"use strict";
/**
 * Other player model
 */
function Player() {
    this.position = vec2.create();
    this.target = vec2.create();
    this.direction = vec3.create();
    this.id=0;
    this.touch=true;
}

/**
 * Update player position according to delta time
 */
Player.prototype.update = function (diff) {
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
};