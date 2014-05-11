package com.zarubond.geostar;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.servlet.http.*;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
/**
 * Controller for intro.
 * @author Ondrej Zaruba
 *
 */
@SuppressWarnings("serial")
public class GeoStarServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException, ServletException {
		
	    UserService userService = UserServiceFactory.getUserService();
	    User currentUser = userService.getCurrentUser();

	    if(currentUser==null)
	    {
	    	resp.sendRedirect(userService.createLoginURL(req.getRequestURI()));
	    	return;
	    }
	    
	    GeoStarBean bean=new GeoStarBean();
	    bean.setNickname(currentUser.getNickname());
	    PersistenceManager pm = PMF.get().getPersistenceManager();
	   	
		List<Game> games=gameList(pm,0);
	   	for(Game game: games)
	   	{
	   		//pm.deletePersistent(game);/*
	   		game.checkActivePlayers(pm);
	   		GameInstanceModel inst=new GameInstanceModel();
		   	inst.name=game.getName();
		   	inst.key=game.getKeyString();
		   	inst.playerCount=game.playerCount();
		   	bean.addGame(inst);	   	
	   	}	    
	   	
	   	pm.close();
		req.setAttribute("bean", bean);
	    RequestDispatcher rd = req.getRequestDispatcher("/index.jsp");
	    rd.forward(req, resp);
	}
	/**
	 * Remove Unused games
	 * @param pm
	 */
	@SuppressWarnings("unchecked")
	public void checkGarbage(PersistenceManager pm){
		long val=System.currentTimeMillis()-3600*1000;
		String query = "select from " + Game.class.getName()+"where timestamp<"+String.valueOf(val);
		List<Game> games= (List<Game>) pm.newQuery(query).execute();
		for(Game game: games){
			pm.deletePersistent(game);
		}
	}
	/**
	 * Get 100 running games
	 * @param pm
	 * @param page page*100 offset
	 * @return Game list
	 */
	@SuppressWarnings("unchecked")
	public List<Game> gameList(PersistenceManager pm, int page) {
		String str=" limit ";
		str+=String.valueOf(page*100);
		str+=",";
		str+=String.valueOf((page+1)*100);
		String query = "select from " + Game.class.getName() +str;

		return (List<Game>) pm.newQuery(query).execute();
	}
}
