'use strict';
/**
 * Shot model
 */
function Shot(){
    this.position=vec2.create();
    this.direction=vec3.create();
}
// return if should be removed
Shot.prototype.update=function(diff)
{
	var v=vec2.create();
	v[0] = this.direction[0]*diff;
	v[1] = this.direction[1]*diff;
	vec2.add(this.position,this.position,v);
	if(this.position[0] < 0 || this.position[0] > gl.viewportWidth || this.position[1] < 0 || this.position[1] > gl.viewportHeight)
	{
		return true;
	}
	return false
};

