package com.zarubond.geostar;
/**
 * Game instance for gamebean
 * @author Ondreaj Zaruba
 *
 */
public class GameInstanceModel {
	String name;
	String key;
	int playerCount=0;
	/**
	 * 
	 * @return Number of connected player to game
	 */
	public int getPlayerCount() {
		return playerCount;
	}

	public void setPlayerCount(int playerCount) {
		this.playerCount = playerCount;
	}
	/**
	 * 
	 * @param name Name of the game
	 */
	public void setName(String name) {
		this.name = name;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getName()
	{
		return name;
	}
	/**
	 * 
	 * @return Unique game key.
	 */
	public String getKey()
	{
		return key;
	}
}
