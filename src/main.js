"use strict";

//http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var gl;

function Main()
{
  this.canvas=null;
  this.canvas_w=0;
  this.canvas_h=0;
  
  this.game=new Game();
  this.scene=new Scene(this.game);
}

Main.prototype.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

Main.prototype.init=function(canvas)
{
	this.canvas=canvas;
	try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        this.resize();
    } catch (e) {
    }
    
    var ptr=this;
    this.canvas.addEventListener('mousemove',function(event){
        ptr.mouseMove(event);
    });
    
    this.canvas.addEventListener('mousedown',function(event){
        ptr.mousePress(event);
    });
    
    this.canvas.addEventListener('mouseup',function(event){
        ptr.mouseRelease(event);
    });
    
    this.canvas.addEventListener('keypress',function(event){
        ptr.keyPress(event);
    });
    
    this.canvas.addEventListener('keyup',function(event){
        ptr.keyRelease(event);
    });
    
    this.canvas.addEventListener('resize',function(event){
        //ptr.resizeEvent(event);
    });
    
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
        return false;
    }
    else
	{
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        return true;
	}
};

Main.prototype.start=function()
{
	this.update();
};

Main.prototype.load=function()
{
    this.scene.load(this.canvas);
};

Main.prototype.resize=function()
{
    if(this.canvas_w!=this.canvas.clientWidth || this.canvas_h!=this.canvas.clientHeight)
    {
		this.canvas_h=this.canvas.clientHeight;
		this.canvas_w=this.canvas.clientWidth;
		gl.viewportWidth=this.canvas_w;
		gl.viewportHeight=this.canvas_h;
		this.canvas.width=this.canvas_w;
		this.canvas.height=this.canvas_h;
    }
};

Main.prototype.render=function()
{
    this.scene.render();
};

Main.prototype.update=function()
{
    var x=this;
    requestAnimFrame(function(){x.update();});
  
	var elapsed=Date.now();
    this.resize();
    this.game.update(elapsed);
    this.scene.update(elapsed);
    this.render();
};

Main.prototype.mouseMove=function(event)
{
	var rect = this.canvas.getBoundingClientRect();
	var x= event.clientX - rect.left;
	var y= event.clientY - rect.top;
	
	this.game.mouseMove(event);
};

Main.prototype.mousePress=function(event)
{
	this.game.mousePress(event);
};

Main.prototype.mouseRelease=function(event)
{
	this.game.mouseRelease(event);
};

Main.prototype.keyPress=function(event)
{
	this.game.keyPress(event);
};

Main.prototype.keyRelease=function(event)
{
	this.game.keyRelease(event);
};

Main.prototype.resizeEvent=function(event)
{
	this.game.resizeEvent(event);
};


var main=new Main();
function webGLStart() 
{ 
	var canvas = document.getElementById("lesson02-canvas");
	if(main.init(canvas)){
	
        main.load();
        main.start();
	}
}