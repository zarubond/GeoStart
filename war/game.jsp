<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <title>The Game</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <link rel="stylesheet" type="text/css" href="/style/game-style.css" />
    <script type="text/javascript" src="/contrib/gl-matrix.js"></script>
    <script type="text/javascript" src="/js/scene.js"></script>
    <script type="text/javascript" src="/js/texture.js"></script>
    <script type="text/javascript" src="/js/shot.js"></script>
    <script type="text/javascript" src="/js/player.js"></script>
    <script type="text/javascript" src="/js/game.js"></script>
    <script type="text/javascript" src="/js/ship.js"></script>
    <script type="text/javascript" src="/js/client.js"></script>

    <script type="text/javascript" src="/js/main.js"></script>

	<script id="shader-fs" type="x-shader/x-fragment">
    precision mediump float;
	uniform vec4 color;
    varying vec4 vColor;

    void main(void) {
        gl_FragColor = color;
    }
	</script>

	<script id="shader-vs" type="x-shader/x-vertex">
    attribute vec3 aVertexPosition;

    uniform mat4 uMVMatrix;
    uniform mat4 uOMatrix;
	

    void main(void) 
    {
        gl_Position = uOMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
	</script>

</head>
<body onload="startApp('${bean.token}', '${bean.gameKey}', '${bean.id}',${bean.pos_x},${bean.pos_y})">

<div id="top"> Deaths:&nbsp;<span id="deaths">${bean.deaths}</span> Kills:&nbsp;<span id="kills">${bean.kills}</span><a id="leave" href="/">Leave&nbsp;&gt;&gt;</a></div>
<canvas id="canvas"></canvas>

</body>
</html>
