<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <title>The Game</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="web_author" content="Ondřej Záruba">
    <link rel="stylesheet" type="text/css" href="/style/game-style.css" />
    <script type="text/javascript" src="/contrib/gl-matrix.js"></script>
    <script type="text/javascript" src="/js/scene.js"></script>
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
<body>
    <input type="hidden" value="${bean.token}"   id="token" />
    <input type="hidden" value="${bean.gameKey}" id="gameKey" />
    <input type="hidden" value="${bean.id}"      id="id" />
    <input type="hidden" value="${bean.pos_x}"   id="pos_x" />
    <input type="hidden" value="${bean.pos_y}"   id="pos_y" />
    <audio id="shot_audio">
        <source src="/audio/Gun_Shot.ogg" type="audio/ogg"/>
        <source src="/audio/Gun_Shot.mp3" type="audio/mpeg"/>
        <source src="/audio/Gun_Shot.wav" type="audio/wav"/>
    </audio>
    <div id="top">Deaths:&nbsp;<span id="deaths">${bean.deaths}</span> Kills:&nbsp;<span id="kills">${bean.kills}</span><a id="leave" href="/">Leave&nbsp;&gt;&gt;</a></div>
    <div>
        <canvas id="canvas"></canvas>
        <div id="fullscreen">Enter fullscreen</div>
    </div>
</body>
</html>
