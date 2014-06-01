"use strict";
/**
 * Master game controller
 */
function Game() {
    this.ship = new Ship();
    this.last_time = Date.now();
    this.players=new Array();
    this.shots=new Array();
    //for garbage collector
    this.touch=false;
    this.newShots=new Array();
    this.kill=-1;
}

Game.prototype.load = function () {
    this.sound=document.getElementById("shot_audio");
};
/**
 * Update all entities
 */
Game.prototype.update = function (elapsed) {
	//ship
    var diff = 0.2 * (elapsed - this.last_time);
    this.last_time = elapsed;
    
    this.ship.update(diff);

    for(var player in this.players)
    {
    	//remove player if there was a network update without him
    	if(this.players[player].touch==false)
    	{
    		delete this.players[player];
    	}
    	else
    	{
    		this.players[player].update(diff);
    	}
    }
    
    for(var i=0; i<this.shots.length; i++)
    {
    	if(this.shots[i].update(diff))
			this.shots.splice(i, 1);
    }

    for(var i=0; i<this.ship.shots.length; i++)
    {
    	var shot=this.ship.shots[i];
	    for(var p in this.players )
	    {
	    	var player=this.players[p];
	    	var v=vec2.create();
	    	vec2.subtract(v, shot.position, player.position);
	    	var dist=Math.abs(vec2.length(v));
	    	if(dist<20){
	    		this.kill=player.id;
	    		this.ship.shots.splice(i, 1);
	    		return;
	    	}
	    }
    }
};
/**
 * Catch mouse move envent.
 */
Game.prototype.mouseMove = function (x, y) {
	
	vec2.set(this.ship.target, x, y);

};
/**
 * Mouse press event
 */
Game.prototype.mousePress = function (event) {
	
};
/**
 * Mouse release event
 */
Game.prototype.mouseRelease = function (event) {
	var shot=this.ship.shoot();
	if(shot!=null)
    {
		this.newShots.push(shot);
        if(this.sound!=null)
        {
            this.sound.currentTime = 0;
            this.sound.play();
        }
    }
   
};

Game.prototype.keyPress = function (event) {
	
};

Game.prototype.keyRelease = function (event) {
	
};

Game.prototype.resizeEvent = function (event) {
	
};
/**
 * Update player from network.
 */
Game.prototype.updatePlayer = function(id, pos_x, pos_y, target_x, target_y) {
	
	var player=this.players[id.toString()];
	if(player==undefined)
	{
		var player=new Player();
		this.players[id.toString()]=player;
		player.id=id;
	}
	
	if(Math.floor(target_x)!=Math.floor(player.target[0]) || Math.floor(target_y)!=Math.floor(player.target[1]))
	{
		player.position[0]=pos_x;
		player.position[1]=pos_y;
		player.target[0]=target_x;
		player.target[1]=target_y;
	}
	//console.log(player.touch);
	player.touch=true;	
};
/**
 * Insert new shot from server
 */
Game.prototype.addShot= function(pos_x,pos_y,dir_x,dir_y) {
	var shot=new Shot();
	shot.position[0]=pos_x;
	shot.position[1]=pos_y;
	shot.direction[0]=dir_x;
	shot.direction[1]=dir_y;
	
	this.shots.push(shot);
};
/**
 * Receive and parse new message from server
 */
Game.prototype.updateMessage = function() {
	var s="\"shots\":[";
	var c=0;
    for(var i=0; i<this.newShots.length; i++)
    {
    	var shot=this.newShots[i];
    	if(c>0)
    		s+=',';
    	s+='{"pos_x":'+shot.position[0]+',"pos_y":'+shot.position[1]+',"dir_x":'+shot.direction[0]+',"dir_y":'+shot.direction[1]+'}';
    	c++;
    }
    s=s+"]";
    this.newShots=[];
    this.newShots.length=0;
	var k=this.kill;
	this.kill=-1;
	return '{"service":{"connected":true,"kill":'+k+'},"player":{"pos_x":'+this.ship.position[0]+',"pos_y":'+this.ship.position[1]+',"target_x":'+this.ship.target[0]+',"target_y":'+this.ship.target[1]+'},'+s+'}';
};
/**
 * Parse other players 
 */
Game.prototype.updateState = function(players, id, die) {
    for(var player in this.players)
    {
    	this.players[player].touch=false;
    }
    
	for(var i=0;i<players.length;i++)
	{
		if(players[i].id!=id)
		{
			this.updatePlayer(players[i].id, players[i].pos_x, players[i].pos_y, 
					players[i].target_x, players[i].target_y);
		}
		else if(players[i].id==id && die)
		{
			this.ship.position[0] = players[i].pos_x;
			this.ship.position[1] = players[i].pos_y;
			this.ship.target[0] = players[i].target_x;
			this.ship.target[1] = players[i].target_y;
		}
	}
}
/**
 * Parse shots
 */
Game.prototype.updateShots = function(shots) {

	for(var j=0;j<shots.length;j++)
	{
		this.addShot(shots[j].pos_x, shots[j].pos_y,
				shots[j].dir_x,shots[j].dir_y);
	}
}

