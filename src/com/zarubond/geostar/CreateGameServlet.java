package com.zarubond.geostar;

import java.io.IOException;

import javax.jdo.PersistenceManager;
import javax.servlet.http.*;
import javax.servlet.ServletException;
/**
 * Controller for which creates new game instance
 * @author Ondrej Zaruba
 *
 */
@SuppressWarnings("serial")
public class CreateGameServlet extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException, ServletException {

	    PersistenceManager pm = PMF.get().getPersistenceManager();
	    
	    String gameKey;	
	    String gameName=(String) req.getParameter("game_name");
	    if(gameName!=null && gameName.length()>0)
	    {
		    Game game = new Game(gameName);
		    pm.makePersistent(game);
		    gameKey = game.getKeyString();
		    
		    pm.close();
		    resp.sendRedirect("/game/?key="+gameKey);
	    }
	    else
	    {
	    	resp.sendRedirect("/");
	    }
	}
}