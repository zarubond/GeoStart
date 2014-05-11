package com.zarubond.geostar;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
/**
 * Model for index.jsp
 * @author suvl
 *
 */
public class GeoStarBean implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	List<GameInstanceModel> games=new ArrayList<GameInstanceModel>();
	int gameCount;
	int page;
	String nickname;
	
	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}	
	
	public int getGameCount() {
		return gameCount;
	}

	public void setGameCount(int gameCount) {
		this.gameCount = gameCount;
	}

	/**
	 * 
	 * @return Game instances
	 */
	public List<GameInstanceModel> getGames() {
		return games;
	}
	
	public void addGame(GameInstanceModel games) {
		this.games.add(games);
	}
	
	/**
	 * 
	 * @return Current user nickname
	 */
	public String getNickname() {
		return nickname;
	}
	
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	
}
