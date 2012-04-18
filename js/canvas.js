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
*/

var testUniverse = new Universe({
	id: 0,
	name: "Test Universe",
	physicalConstants: {
		vacuumPermittivity: 1.0 / (4 * Math.Pi * Math.pow(10, -7) * Math.pow(299792458, 2)),
		vacuumPermeability: 4 * Math.Pi * Math.pow(10, -7)
	},
	entities: {
		
	},
	graphics: {
		locationOfCenterOfCanvas: Vector.create([0, 0]),
		canvasZoom: 100
	}
});
entity0Preset = {
	id: testUniverse.getNextEntityId(),
	name: "Second Location",
	point: {
		location: Vector.create([1, 0])
	},
	graphics: {
		canvasCoordinates: testUniverse.findCanvasCoordinates(Vector.create([1, 0]))
	}
};
testUniverse.addEntity(new UniverseLocation(entity0Preset)).initializeGraphics(entity0Preset);
entity1Preset = {
	id: testUniverse.getNextEntityId(),
	name: "Third Location",
	point: {
		location: Vector.create([-1, 0])
	},
	graphics: {
		canvasCoordinates: testUniverse.findCanvasCoordinates(Vector.create([-1, 0]))
	}
};
testUniverse.addEntity(new UniverseLocation(entity1Preset)).initializeGraphics(entity1Preset);
testUniverse.getEntity(2).updateLocation(testUniverse.findUniverseCoordinates(new Point(50, 50)), new Point(50, 50));
testUniverse.getEntity(1).getClickable().selected = true;
debug.debug("Test universe now looks like", testUniverse);

// Set up view
view.onFrame = function(event) {
	//testUniverse.getEntity(2).updateLocationByOffset(testUniverse.findUniverseCoordinates(new Point(5, 5)), new Point(5, 5));
};
// TODO: Add proper onResize handler

// Set up tools
var hitOptions = {
	type: Group,
	fill: true,
	stroke: true,
	segment: true,
	tolerance: 5
};
//// Tool to select and move entities
var selectAndMove = new Tool();
selectAndMove.onMouseDown = function(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
	if (hitResult && hitResult.item) {
		debug.debug("selected item", hitResult.item);
		hitResult.item.selected = true;
	}
};
selectAndMove.onMouseMove = function(event) {
};
