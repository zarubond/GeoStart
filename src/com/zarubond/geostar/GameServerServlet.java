package com.zarubond.geostar;

import java.io.IOException;

import javax.jdo.PersistenceManager;
import javax.servlet.http.*;
import javax.servlet.ServletException;

import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.labs.repackaged.org.json.JSONException;
/**
 * Control point for JSON communication.
 * @author Ondreaj Zaruba
 *
 */
@SuppressWarnings("serial")
public class GameServerServlet extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException, ServletException {
		
		String gameId=req.getParameter("key");
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Game game = pm.getObjectById(Game.class, KeyFactory.stringToKey(gameId));
		
		if(game==null) return;
		
		UserService userService = UserServiceFactory.getUserService();
	    String userId = userService.getCurrentUser().getUserId();

	    String packet = req.getParameter("data");
	    if(packet!=null)
	    {
		    try{
		    	game.recvMessage(pm,userId,packet);
		    }
		    catch(IOException exp)
		    {
		    	resp.setStatus(401);
		    }
	    }
	    game.checkActivePlayers(pm);
        resp.setContentType("text/x-json;charset=UTF-8");           
        resp.setHeader("Cache-Control", "no-cache");
	    try {
			resp.getWriter().write(game.getResponce(pm));
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    //pm.close();
	}
}