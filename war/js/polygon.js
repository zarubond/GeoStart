'use strict';

//http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
/**
 * Polygon star animation system
 */
function Main() {
    this.points = [];
    this.poly=null;
}
/**
 * Start and load polygon star
 */
Main.prototype.start = function() {

	//find element
    this.poly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    document.getElementById("star").appendChild(this.poly);
    this.poly.style.fill="yellow";
    this.poly.style.fillRule="nonzero";
//setup star
    var time=0;
    this.setPoint(0,Math.sin((Math.PI*2/5)*0+time)*50+50,Math.cos((Math.PI*2/5)*0+time)*50+50);
    this.setPoint(1,Math.sin((Math.PI*2/5)*0.5+time)*25+50,Math.cos((Math.PI*2/5)*0.5+time)*25+50);
    this.setPoint(2,Math.sin((Math.PI*2/5)*1+time)*50+50,Math.cos((Math.PI*2/5)*1+time)*50+50);
    this.setPoint(3,Math.sin((Math.PI*2/5)*1.5+time)*25+50,Math.cos((Math.PI*2/5)*1.5+time)*25+50);
    this.setPoint(4,Math.sin((Math.PI*2/5)*2+time)*50+50,Math.cos((Math.PI*2/5)*2+time)*50+50);
    this.setPoint(5,Math.sin((Math.PI*2/5)*2.5+time)*25+50,Math.cos((Math.PI*2/5)*2.5+time)*25+50);
    this.setPoint(6,Math.sin((Math.PI*2/5)*3+time)*50+50,Math.cos((Math.PI*2/5)*3+time)*50+50);
    this.setPoint(7,Math.sin((Math.PI*2/5)*3.5+time)*25+50,Math.cos((Math.PI*2/5)*3.5+time)*25+50);
    this.setPoint(8,Math.sin((Math.PI*2/5)*4+time)*50+50,Math.cos((Math.PI*2/5)*4+time)*50+50);
    this.setPoint(9,Math.sin((Math.PI*2/5)*4.5+time)*25+50,Math.cos((Math.PI*2/5)*4.5+time)*25+50);
    this.poly.setAttribute('points',this.build(this.points));
    
    this.update();
}
/**
 * Update star rotation
 */
Main.prototype.update = function() {
    
    var d = new Date();
    var time = d.getTime()*0.1;
    
    this.poly.setAttribute("transform","rotate("+(time%360)+" 50 50)");
    
    

    var ptr=this;
    window.requestAnimFrame(function(){ptr.update();});
}
/**
 * Set point of the star
 */
Main.prototype.setPoint = function(id, x, y) {
        this.points[id] = [x,y];
}
/**
 * Build star from point array
 */
Main.prototype.build = function() {
    var res = [];
    for (var i=0,l=this.points.length;i<l;i++) {
        res.push(this.points[i].join(','));
    }
    return res.join(' ');
}
/**
 * Main start
 */
var m=new Main();
window.onload=function() {
	m.start();
}