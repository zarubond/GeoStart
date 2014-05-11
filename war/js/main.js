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

/**
 * Main class
 */
function Main()
{
	  this.canvas=null;
	  this.canvas_w=0;
	  this.canvas_h=0;
	  
	  this.game=new Game();
	  this.scene=new Scene(this.game);
	  this.client=new Client();
	  var ptr=this;
	  this.client.setMessageListener(function(msg){ptr.recvMessage(msg);});
	  window.onbeforeunload=function(){ptr.onClose();}
	  this.token=null;
	  this.gamekey=null;
	  this.id=0;
	  this.timestamp=Date.now();
	  this.lastMsg=0;
}

Main.prototype.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
/**
 * Initialize the game
 */
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    
    this.client.openChannel(this.token, this.gamekey);
    
    return true;
};

/**
 * Star with fist update
 */
Main.prototype.start=function()
{
	this.update();
};
/**
 * Load program
 */
Main.prototype.load=function()
{
    this.scene.load(this.canvas);
};
/**
 * Check if canvas resized
 */
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
/**
 * Render scene
 */
Main.prototype.render=function()
{
    this.scene.render();
};
/**
 * Update state
 */
Main.prototype.update=function()
{
    var x=this;
    requestAnimFrame(function(){x.update();});
  
	var elapsed=Date.now();
    this.resize();
    this.game.update(elapsed);
    this.scene.update(elapsed);
    this.render();
    
    if(this.timestamp+1000<Date.now())
    {
    	this.timestamp=Date.now();
    	this.client.sendMessage(this.game.updateMessage());
    }
};
/**
 * Mouse has moved
 */
Main.prototype.mouseMove=function(event)
{
	var rect = this.canvas.getBoundingClientRect();
	var x= event.clientX - rect.left;
	var y= event.clientY - rect.top;
	
	this.game.mouseMove(x, y);
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
/**
 * Receive new message from server
 */
Main.prototype.recvMessage=function(message)
{
	var obj=eval ("(" + message + ")");
	
	var die=false;
	
	if(obj!=undefined)
	{
		//console.log(message);
		if(obj.service.die==true) die=true;
	
		document.getElementById("kills").innerHTML=obj.service.killed;
		document.getElementById("deaths").innerHTML=obj.service.died;
	
		if(obj.service.timestamp<this.lastMsg)
			return;
		else
			this.lastMsg=obj.service.timestamp;
		
		if(obj.players!=undefined)
			this.game.updateState(obj.players, this.id, die);
		
		if(obj.shots!=undefined)
			this.game.updateShots(obj.shots);
	}
}

Main.prototype.onClose=function(){
	this.client.close();
}
/**
 * Set defautl position on game start
 */
Main.prototype.setDefault = function(pos_x,pos_y){
	this.game.ship.position[0]=pos_x;
	this.game.ship.position[1]=pos_y;
	this.game.ship.target[0]=pos_x;
	this.game.ship.target[1]=pos_y;
	this.game.ship.direction[0]=0;
	this.game.ship.direction[1]=1;
}
	
var main=new Main();
/**
 * Main function to start game
 * @param token 
 * @param gamekey Unique game key
 * @param id Unique user key
 * @param pos_x Default player x position
 * @param pos_y Default player y position
 */
function startApp(token, gamekey, id, pos_x, pos_y) 
{ 
	var canvas = document.getElementById("canvas");
	main.token=token;
	main.gamekey=gamekey;
	main.id=id;
	
	if(main.init(canvas))
	{
        main.load();
        main.setDefault(pos_x, pos_y)
        main.start();
	}
}