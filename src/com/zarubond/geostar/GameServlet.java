package com.zarubond.geostar;

import java.io.IOException;

import javax.jdo.PersistenceManager;
import javax.servlet.http.*;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
/**
 * Control for game.
 * @author Ondrej Zaruba
 *
 */
@SuppressWarnings("serial")
public class GameServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException, ServletException {

		UserService userService = UserServiceFactory.getUserService();
		User currentUser = userService.getCurrentUser();
		String userId = currentUser.getUserId();

		String gameKey = req.getParameter("key");
		Game game=null;
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
		if(gameKey==null)
			return;
		game = pm.getObjectById(Game.class, KeyFactory.stringToKey(gameKey));
		if(game==null)
			return;
		
	    String token ="geostar";

	    Player player=game.connectPlayer(pm, userId);
		if(player==null)
			resp.sendRedirect("/");
		else
		{
			GameBean bean=new GameBean();
			bean.gameKey=gameKey;
			bean.token=token;
			bean.id=userId.hashCode();
			bean.pos_x=player.data[0];
			bean.pos_y=player.data[1];
			
			req.setAttribute("bean", bean);
	    	RequestDispatcher rd = req.getRequestDispatcher("/game.jsp");
	    	rd.forward(req, resp);
		}
	}
}