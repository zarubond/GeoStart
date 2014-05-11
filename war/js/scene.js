"use strict";
/**
 * Scene rendering system
 */
function Scene(game) {
    this.shaderProgram = null;
  
    this.mvMatrix = mat4.create();
    this.oMatrix = mat4.create();
    this.triangleVertexPositionBuffer = 0;
    this.triangleVertexColorBuffer = 0;
    this.shotVertexPositionBuffer = 0;
    this.shotVertexColorBuffer = 0;

    this.game = game;
    this.ortho = mat4.create();
}
/**
 * Load default variables
 */
Scene.prototype.load = function (canvas) {
    mat4.identity(this.ortho);
    this.orthoMatrix(this.ortho, 0.0, gl.viewportWidth, 0.0, gl.viewportHeight, 0.1, 10.0);

    this.initShaders();
    this.initBuffers();    
};

Scene.prototype.update = function (elapsed) {
    
};

Scene.prototype.resize = function () {
};
/**
 * Render scene(player and shots)
 */
Scene.prototype.render = function () {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.identity(this.mvMatrix);

	var ang=Math.atan(this.game.ship.direction[0]/this.game.ship.direction[1]);
	if(this.game.ship.direction[1]>0.0) ang+=Math.PI;
	
	gl.uniform4fv(this.shaderProgram.colorUniform, [1.0,1.0,1.0,1.0]);
	mat4.rotateZ(this.mvMatrix, this.mvMatrix, ang);
	
	mat4.scale(this.mvMatrix,this.mvMatrix,[15.0,15.0,15.0]);

    mat4.translate(this.mvMatrix, this.mvMatrix, [this.game.ship.position[0], gl.viewportHeight-this.game.ship.position[1],0.0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
	gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    this.setMatrixUniforms();
    
    gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
    
        
    for(var p in this.game.players )
    {
    	var player=this.game.players[p];
        mat4.identity(this.mvMatrix);
        gl.uniform4fv(this.shaderProgram.colorUniform, [1.0,0.0,0.0,1.0]);
        
    	var ang=Math.atan(player.direction[0]/player.direction[1]);
    	if(player.direction[1]>0.0) ang+=Math.PI;
        
        mat4.scale(this.mvMatrix,this.mvMatrix,[15.0,15.0,15.0]);
        mat4.translate(this.mvMatrix, this.mvMatrix, [player.position[0], gl.viewportHeight-player.position[1],0.0]);
		
		gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
    }
    
    
    for(var i=0;i<this.game.ship.shots.length;i++)
    {
        var tmp=this.game.ship.shots[i];
        
        mat4.identity(this.mvMatrix);
        gl.uniform4fv(this.shaderProgram.colorUniform, [1.0,1.0,1.0,1.0]);
        //mat4.rotate(this.mvMatrix, this.mvMatrix, 3.14, tmp.direction);
		mat4.scale(this.mvMatrix,this.mvMatrix,[5.0,5.0,5.0]);
        mat4.translate(this.mvMatrix,this.mvMatrix,[tmp.position[0], gl.viewportHeight-tmp.position[1],0.0]);
		
		gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
    }
    
    for(var i=0;i<this.game.shots.length;i++)
    {
        var tmp=this.game.shots[i];
        
        mat4.identity(this.mvMatrix);
        gl.uniform4fv(this.shaderProgram.colorUniform, [1.0,0.0,0.0,1.0]);
      //  mat4.rotate(this.mvMatrix, this.mvMatrix, 3.14, tmp.direction);
		mat4.scale(this.mvMatrix,this.mvMatrix,[5.0,5.0,5.0]);
        mat4.translate(this.mvMatrix,this.mvMatrix,[tmp.position[0], gl.viewportHeight-tmp.position[1],0.0]);
		
		gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
    }
};
/**
glMatrix has a lot of bugs, this is replacement
**/
/**
 * Create ortographic matrix
 */
Scene.prototype.orthoMatrix = function (mat,l,r,b,t,n,f) {
    mat[0] = 2 / (r - l); 
    mat[1] = 0; 
    mat[2] = 0; 
    mat[3] = 0; 
    mat[4] = 0; 
    mat[5] = 2 / (t - b); 
    mat[6] = 0; 
    mat[7] = 0; 
    mat[8] = 0; 
    mat[9] = 0; 
    mat[10] = -1 / (f - n); 
    mat[11] = 0; 
    mat[12] = -(r + l) / (r - l); 
    mat[13] = -(t + b) / (t - b); 
    mat[14] = -n / (f - n); 
    mat[15] = 1; 
};


Scene.prototype.rotate = function (matrix,angle,x, y, z)
{
    matrix[0] = 1+(1-Math.cos(angle))*(x*x-1);
    matrix[1] = -z*Math.sin(angle)+(1-Math.cos(angle))*x*y;
    matrix[2] = y*Math.sin(angle)+(1-Math.cos(angle))*x*z;
    matrix[3] = 0;

    matrix[4] = z*Math.sin(angle)+(1-Math.cos(angle))*x*y;
    matrix[5] = 1+(1-Math.cos(angle))*(y*y-1);
    matrix[6] = -x*Math.sin(angle)+(1-Math.cos(angle))*y*z;
    matrix[7] = 0;

    matrix[8] = -y*Math.sin(angle)+(1-Math.cos(angle))*x*z;
    matrix[9] = x*Math.sin(angle)+(1-Math.cos(angle))*y*z;
    matrix[10] = 1+(1-Math.cos(angle))*(z*z-1);
    matrix[11] = 0;

    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;
};
/**
 * Default uniform setup
 */
Scene.prototype.setMatrixUniforms = function () {
    gl.uniformMatrix4fv(this.shaderProgram.oMatrixUniform, false, this.ortho);
    gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
};
/**
 * Create shader program for rendering
 */
Scene.prototype.getShader = function (gl, id) {
    
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType === 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
};

/**
 * Initialize shader program
 */
Scene.prototype.initShaders = function () {
    var fragmentShader = this.getShader(gl, "shader-fs");
    var vertexShader = this.getShader(gl, "shader-vs");

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    //this.shaderProgram.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    //gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

    this.shaderProgram.oMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uOMatrix");
    this.shaderProgram.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.shaderProgram.colorUniform = gl.getUniformLocation(this.shaderProgram, "color");
};
/**
 * Initialize buffers
 */
Scene.prototype.initBuffers = function() {
    //ship
    this.triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
    var vertices = [
        0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.triangleVertexPositionBuffer.itemSize = 3;
    this.triangleVertexPositionBuffer.numItems = 3;

    this.triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.triangleVertexColorBuffer.itemSize = 4;
    this.triangleVertexColorBuffer.numItems = 3;
    
    //shot
    this.shotVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shotVertexPositionBuffer);
    vertices = [
        0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.shotVertexPositionBuffer.itemSize = 3;
    this.shotVertexPositionBuffer.numItems = 3;

    this.shotVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shotVertexColorBuffer);
    colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.shotVertexColorBuffer.itemSize = 4;
    this.shotVertexColorBuffer.numItems = 3;

};
