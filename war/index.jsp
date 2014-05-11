<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="/style/style.css" />
        <title>GeoStar</title>
    </head>
    <body>
    
    	<header id="titleText">GeoStar</header>
		<article>
			<div id="welcome">Welcome ${ bean.nickname }</div>
			<div id="games">
				<p id="running">Running games<p>
				<table class="table_list">
				<tr><th>Name</th><th>Player count</th><th></th></tr>
				<c:forEach items="${bean.games}" var="element">
    				<tr><td>${element.name}</td><td>${element.playerCount}</td><td><a href="/game/?key=${element.key}" class="jojo">Play!</a></td></tr>
				</c:forEach>
    			</table>
    			<form method="post" action="/creategame" id="newGame">
    				New game <input type="text" name="game_name"/><input type="submit"  value="Create"/>
    			</form>
    		</div>
    	<article>
    	<footer>
    		<a href="http://zarubond.com">Ondřej Záruba</a> &copy; 2014
    	</footer>
    </body>
</html>