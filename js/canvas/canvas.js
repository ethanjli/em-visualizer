// Get a reference to the canvas object
paper.install(window);
var canvas = document.getElementById('myCanvas');
// Create an empty project and a view for the canvas:
paper.setup(canvas);
debug.info("Set up canvas view of", view.viewSize);

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
		canvasZoom: Math.log(500)
	},
	text: {
		decimalPrecision: 10
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
testUniverse.addEntity(new UniverseLocation(entity0Preset, testUniverse));
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
testUniverse.addEntity(new UniverseLocation(entity1Preset, testUniverse));
testUniverse.getEntity(1).updateLocation(new Point(50, 50), testUniverse);
testUniverse.getEntity(2).updateLocation(new Point(50, 50), testUniverse);
testUniverse.getEntity(2).updateLocationByOffset(new Point(50, 50), testUniverse);
debug.debug("Test universe now looks like", testUniverse);

// Set up view
view.onFrame = function(event) {
	//testUniverse.getEntity(2).updateLocationByOffset(new Point(5, 5), testUniverse);
};
// TODO: Add proper onResize handler
