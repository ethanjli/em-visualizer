// Get a reference to the canvas object
paper.install(window);
var canvas = document.getElementById('myCanvas');
// Create an empty project and a view for the canvas:
paper.setup(canvas);
debug.info("Set up canvas view of", view.viewSize);
/*
var pathRectangle = new Path.Rectangle([75, 75], [100, 100]);
pathRectangle.strokeColor = 'black';

var origin = new Point(0, 0);
var pathPoint = new Path.Circle(new Point(0, 0), 2);
pathPoint.style = {
	fillColor: 'black',
};
var pathText = new PointText(origin.add(new Point(2, -2)));
pathText.fillColor = 'black';
pathText.content = '(0,0)';

view.onFrame = function(event) {
    pathRectangle.rotate(1);
    pathPoint.translate(new Point(1, 1));
    pathText.translate(new Point(1, 1));
}*/

var testUniverse = new Universe({
	id: 0,
	name: "Test Universe",
	canvasDimensions: view.viewSize,
	locationOfCenterOfCanvas: Vector.create([0, 0]),
	canvasZoom: 1
});
