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
		canvasZoom: 100
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

// Set up tools
var selectedGroups = new Array();
var hitOptions = {
	fill: true,
	stroke: true,
	segment: true,
	tolerance: 5
};
//// Tool to select entities
var selectionTool = new Tool();
var hoveredGroup = null;
var clickedGroup = null;
selectionTool.onMouseMove = function(event) {
	var hitResult = project.hitTest(event.point, hitOptions);
	
	if (hitResult && hitResult.item.parent) { // Hit a group!
		hoveredGroup = hitResult.item.parent.parent;
		hoveredGroup.selected = true;
	} else if (hoveredGroup !== null && selectedGroups.indexOf(hoveredGroup) === -1) { // Just left a group which wasn't clicked
		// Hide the selection box after the mouse moves off the group
		hoveredGroup.selected = false;
		hoveredGroup = null;
	}
};
selectionTool.onMouseDown = function(event) {
	var hitResult = project.hitTest(event.point, hitOptions);
	if (hitResult && hitResult.item.parent) { // Hit a group!
		var clickedGroup = hitResult.item.parent.parent;
		if (event.modifiers.shift || event.modifiers.control) { // We want to add/remove the group to the current selection
			var clickedGroupIndex = selectedGroups.indexOf(clickedGroup);
			if (clickedGroupIndex === -1) { // If the group is not yet in the selection
				// Add the group to the selection and show its selection box
				selectedGroups.push(clickedGroup);
				clickedGroup.selected = true;
			} else {
				// Remove the group from the selection and hide its selection box
				selectedGroups.splice(clickedGroupIndex, 1);
				clickedGroup.selected = false;
			}
		} else {
			var clickedGroupIndex = selectedGroups.indexOf(clickedGroup);
			if (clickedGroupIndex === -1) { // If the group is not yet in the selection
				// Make the new group be the entire selection
				project.activeLayer.selected = false;
				selectedGroups = new Array(clickedGroup);
				clickedGroup.selected = true;
			} else {
				movingTool.activate();
			}
		}
	} else {
		// Clear the selection
		project.activeLayer.selected = false;
		selectedGroups = new Array();
		clickedGroup = null;
	}
	debug.debug("selection is now", selectedGroups);
};
selectionTool.onMouseDrag = function(event) {
	movingTool.activate();
};
//// Tool to move entities
var movingTool = new Tool();
movingTool.onMouseDrag = function(event) {
	selectedGroups.forEach(function(selectedGroup) {
		selectedGroup.associatedEntity.updateLocationByOffset(event.delta, testUniverse);
	});
};
movingTool.onMouseUp = function(event) {
	selectionTool.activate();
};
