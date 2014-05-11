package com.zarubond.geostar;


import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.jdo.PersistenceManager;
import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
/**
 * Master object which controls the game
 * @author Ondrej Zaruba
 *
 */
@PersistenceCapable
public class Game {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;
	
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	private String name;
	
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	private int lastUpdate;
	
	//should be Map,but persistence is not supported
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	private List<Player> players=new ArrayList<Player>();
	
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	private long timestamp;
	
	
	private static int maxPlayer=10;
	private Player sender=null;
	
	/**
	 * 
	 * @param name Name of game instance
	 */
	public Game(String name)
	{
		this.name=name;
		this.timestamp=System.currentTimeMillis();
	}
	/**
	 * Timestamp from last update of any player
	 * @return
	 */
	public long getTimestamp()
	{
		return timestamp;
	}
	/**
	 * Number of currently connected playrs
	 * @return
	 */
	public int playerCount()
	{
		return players.size();
	}
	/**
	 * Collect and delete all players witch timestamp older than 3s
	 * @param pm
	 */
	public void checkActivePlayers(PersistenceManager pm)
	{
		long now=System.currentTimeMillis();
		//kick out all player who are 3s + idling
		Iterator<Player> i = players.iterator();
		while (i.hasNext()) {
			
			Player temp=i.next();
			if(((now-temp.timestamp)/ 1000L ) > 3L) {
				removePlayer(pm,temp);
				
			}
		}
	}
	/**
	 * Remove player from game
	 * @param pm
	 * @param player Player to be removed.
	 */
	private void removePlayer(PersistenceManager pm, Player player)
	{
		players.remove(player);
		pm.deletePersistent(player);
	}
	/**
	 * Receive message from client
	 * @param pm
	 * @param userId Unique user id
	 * @param packet Message from client in JSON format.
	 * @return if message was accepted
	 * @throws IOException
	 */
	public boolean recvMessage(PersistenceManager pm,String userId, String packet) throws IOException {
				
	    JSONObject json;
	    try {
	      json = new JSONObject(packet);
	    } catch (JSONException e) {
	      // crash and burn
	    	System.out.println(packet);
	    	return false;
	    }	
		
		String channelKey = getChannelKey(userId);
		
		//can not use hashmap :(
		Iterator<Player> i = players.iterator();
		while (i.hasNext()) {
			Player temp=i.next();
			if(temp.channelKey.equals(channelKey))
			{
				sender=temp;
				break;
			}
		}

	    if(sender==null)
	    	return false;
	    
	    try{
		    JSONObject info = json.getJSONObject("player");
		    if(!sender.death)
		    {
			    sender.data[0]=(float)info.getDouble("pos_x");
			    sender.data[1]=(float)info.getDouble("pos_y");
			    sender.data[2]=(float)info.getDouble("target_x");
			    sender.data[3]=(float)info.getDouble("target_y");
		    }
	    } catch(JSONException exp) {
	    	//System.out.println("Wrong format!: "+packet);
	    }
	    
	    try{
	    	JSONObject service = json.getJSONObject("service");
	    	boolean con=service.getBoolean("connected");
	    	if(con==false)
	    	{
	    		removePlayer(pm, sender);
				return true;
	    	}
	    	
	    	try{
	    		int id=service.getInt("kill");
	    		if(id!=-1)		
	    		{	
	    			Iterator<Player> iii = players.iterator();
	    			while (iii.hasNext()) {
	    				Player temp=iii.next();
		    			if(temp.id==id)
		    			{
		    				sender.killed++;
		    				
		    				temp.died++;
		    				temp.death=true;
		    				temp.data[0] = (float) Math.random()*1024;
		    				temp.data[1] = (float) Math.random()*600;
		    				temp.data[2] = temp.data[0];
		    				temp.data[3] = temp.data[1];
		    				break;
		    			}
		    		}
	    		}
		    } catch(JSONException exp) {
		    	
		    }
	    	
	    } catch(JSONException exp) {
	    	
	    }
	    
	    try{
		    JSONArray shots = json.getJSONArray("shots");
		    JSONObject shot;
		    for(int i1 = 0 ; i1 < shots.length(); i1++){
		    	shot=shots.getJSONObject(i1);
		    	Shot s=new Shot();
		    	s.data[0]=(float)shot.getDouble("pos_x");
		    	s.data[1]=(float)shot.getDouble("pos_y");
		    	s.data[2]=(float)shot.getDouble("dir_x");
		    	s.data[3]=(float)shot.getDouble("dir_y");
				Iterator<Player> ii = players.iterator();
				while (ii.hasNext()) {
					Player temp=ii.next();
		    		if(temp!=sender)
		    		{
		    			Shot tmp=new Shot();
		    			tmp.data[0]=s.data[0];
		    			tmp.data[1]=s.data[1];
		    			tmp.data[2]=s.data[2];
		    			tmp.data[3]=s.data[3];
		    			temp.shotList.add(tmp);
		    			pm.makePersistent(tmp);
		    		}
		    	}
		    }
	    } catch(JSONException exp) {
	    	
	    }
	    
	    
	    sender.timestamp = System.currentTimeMillis();
	    	    
		return true;
	}
	/**
	 * 
	 * @return Name of the game.
	 */
	public String getName() {
		return name;
	}
	/**
	 * 
	 * @param userId
	 * @return Client chanel key
	 */
	public String getChannelKey(String userId) {
		return userId + KeyFactory.keyToString(key);
	}
	/**
	 * Unique game key
	 * @return
	 */
	public Key getKey() {
		  return key;
	}
	/**
	 * Game key as a string
	 * @return
	 */
	public String getKeyString()
	{
		return KeyFactory.keyToString(key);
	}
	/**
	 * Accept connect from new client.
	 * @param pm
	 * @param userId Unique user id
	 * @return New game client.
	 */
	public Player connectPlayer(PersistenceManager pm, String userId)
	{
	    Player player=null;
	    int id=userId.hashCode();
		for (Player temp : players) {
			if(temp.id==id)
			{
				player=temp;
				break;
			}
		}
		
		if(player==null && players.size()<maxPlayer)
		{
			String channelKey = getChannelKey(userId);
			player=new Player();
	    	player.channelKey=channelKey;
	    	player.id=id;
			player.data[0] = (float) Math.random()*1024;
			player.data[1] = (float) Math.random()*600;
			player.data[2] = player.data[0];
			player.data[3] = player.data[1];
	    	player.timestamp=System.currentTimeMillis();
	    	players.add(player);
	    	pm.makePersistent(player);
		}
		
		return player;
	}
	/**
	 * Generates new response for a player
	 * @param pm
	 * @return JSON response
	 * @throws JSONException
	 */
	public String getResponce(PersistenceManager pm) throws JSONException {
		if(sender==null) return "";
		
		JSONObject json=new JSONObject();
		JSONArray arr=new JSONArray();
		JSONArray shots=new JSONArray();
		JSONObject service=new JSONObject();
				
		Iterator<Player> i = players.iterator();
		while (i.hasNext()) {
			Player temp=i.next();
			JSONObject play=new JSONObject();
			play.put("id", temp.id);
			play.put("pos_x", temp.data[0]);
			play.put("pos_y", temp.data[1]);
			play.put("target_x", temp.data[2]);
			play.put("target_y", temp.data[3]);
			arr.put(play);
		}
		json.put("players", arr);
		
		
		for(Shot s: sender.shotList){
			JSONObject shot=new JSONObject();
			shot.put("pos_x", s.data[0]);
			shot.put("pos_y", s.data[1]);
			shot.put("dir_x", s.data[2]);
			shot.put("dir_y", s.data[3]);
			shots.put(shot);
			pm.deletePersistent(s);
		}
		json.put("shots", shots);
		sender.shotList.clear();
		
		service.put("timestamp",System.currentTimeMillis());
		service.put("killed",sender.killed);
		service.put("died",sender.died);
		service.put("die", sender.death);
		sender.death=false;
			
		json.put("service", service);
		
		return json.toString();
	}
	
}
