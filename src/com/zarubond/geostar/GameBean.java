package com.zarubond.geostar;

import java.io.Serializable;
/**
 * Model for game.jsp
 * @author Ondrej Zaruba
 *
 */
public class GameBean implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	String token;
	String gameKey;
	int kills=0;
	int deaths=0;
	int id=0;
	float pos_x=0;
	float pos_y=0;
	
	/**
	 * 
	 * @return Default x position of player
	 */
	public float getPos_x() {
		return pos_x;
	}
	public void setPos_x(float pos_x) {
		this.pos_x = pos_x;
	}
	/**
	 * 
	 * @return Default y position of player
	 */
	public float getPos_y() {
		return pos_y;
	}
	public void setPos_y(float pos_y) {
		this.pos_y = pos_y;
	}
	/**
	 * 
	 * @return Unique user key
	 */
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	/**
	 * 
	 * @return Number of killed enemies.
	 */
	public int getKills() {
		return kills;
	}
	public void setKills(int kills) {
		this.kills = kills;
	}
	/**
	 * 
	 * @return Number of deaths
	 */
	public int getDeaths() {
		return deaths;
	}
	public void setDeaths(int deaths) {
		this.deaths = deaths;
	}
	/**
	 * 
	 * @return Not used
	 */
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	/**
	 * 
	 * @return Unique game key
	 */
	public String getGameKey() {
		return gameKey;
	}
	public void setGameKey(String gameKey) {
		this.gameKey = gameKey;
	}
}
