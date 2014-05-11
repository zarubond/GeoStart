/**
 * Local game client
 */
function Client()
{
	this.pathToServer="/gameserver";
	this.socket=null;
	this.channel=null;
	this.gamekey=null;
	this.recvCallback=null;
}
/**
 * Message listener
 */
Client.prototype.setMessageListener = function(func)
{
	this.recvCallback=func;
};
/**
 * Send new message to server
 */
Client.prototype.sendMessage = function(content) 
{
	if(!this.connected) return;
	var path =this.pathToServer+'?key=' + this.gamekey;
	var xhr = new XMLHttpRequest();
	var ptr=this;
	
	xhr.onreadystatechange=function()
	{
		if (xhr.readyState==4 && xhr.status==200)
	    {
	    	ptr.onMessage(xhr.responseText);
	    }
	}
	xhr.open('POST', path, true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send("data="+content);
};

/**
 * Callback to catch incoming messages
 */
Client.prototype.onMessage = function(message)
{
	if(this.recvCallback!=null)
	{
		this.recvCallback(message);
	}
};
/**
 * Open line to server
 */
Client.prototype.openChannel = function(token, gamekey) 
{
	this.gamekey=gamekey;
	this.connected=true;
}
/**
 * Close connection to server
 */
Client.prototype.close = function() {
	this.connected=false;
	this.sendMessage('{"service":{"connected":false,"kill":-1}}');
};
