
function Texture()
{
	
} 

Texture.prototype.load=function(file_path)
{
	this.texture = gl.createTexture();
  	this.image = new Image();
  	var ptr;
  	this.image.onload = function() { ptr.imageLoaded(); };
  	this.image.src = file_path;
};

Texture.prototype.imageLoaded=function() 
{
	this.texture = gl.createTexture();
  	gl.bindTexture(gl.TEXTURE_2D, this.texture);
  	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  	gl.generateMipmap(gl.TEXTURE_2D);
  	gl.bindTexture(gl.TEXTURE_2D, null);
};