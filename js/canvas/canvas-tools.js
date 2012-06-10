var canvasTools = {
	selectAndDragTool: new Tool(),
	dragIndividuallyTool: new Tool(),
	handTool: new Tool(),
	zoomTool: new Tool(),
	newElectronTool: new Tool(),
	newProtonTool: new Tool(),
	newLocationProbeTool: new Tool(),
	newEFieldVectorProbeTool: new Tool(),
	newEFieldMagnitudeProbeTool: new Tool(),
	newEFieldDirectionProbeTool: new Tool(),
	newEFieldLineProbeTool: new Tool(),
	newEPotentialProbeTool: new Tool()
};

// Tool to select and move entities
canvasTools.selectAndDragTool.toolName = "Select and Drag Items in Groups";
canvasTools.selectAndDragTool.onMouseMove = function(event) {
	canvasToolsActions.mouseActions.hover(event);
};
canvasTools.selectAndDragTool.onMouseDown = function(event) {
	if (Key.isDown("space")) {
		canvasToolsSupport.data.selectionTools.prepareToPan = true;
	} else {
		var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
		 if (hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item)) { // Hit a group!
			canvasToolsSupport.data.selectionTools.clickedGroup = canvasToolsSupport.findOverallGroupParent(hitResult.item);
			if (!canvasToolsSupport.data.selectionTools.selectedGroups.contains(canvasToolsSupport.data.selectionTools.clickedGroup)) { // the clicked group is not already in the selection 
				canvasToolsSupport.addToSelection(canvasToolsSupport.data.selectionTools.clickedGroup);
				canvasToolsSupport.data.selectionTools.prepareToRemoveGroup = false;
			} else {
				canvasToolsSupport.data.selectionTools.prepareToRemoveGroup = true;
			}
		} else {
			canvasToolsSupport.clearSelection();
			canvasToolsSupport.data.selectionTools.clickedGroup = null;
			canvasToolsSupport.data.selectionTools.prepareToPan = true;
			canvasToolsSupport.data.selectionTools.prepareToRemoveGroup = false;
		}
	}
};
canvasTools.selectAndDragTool.onMouseUp = function(event) {
	if (canvasToolsSupport.data.selectionTools.prepareToRemoveGroup) { // If the mouse is released from a click (as opposed to a drag)
		var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
		if (hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item)) { // Hit a group!
			canvasToolsSupport.data.selectionTools.unclickedGroup = canvasToolsSupport.findOverallGroupParent(hitResult.item);
			canvasToolsSupport.removeFromSelection(canvasToolsSupport.data.selectionTools.unclickedGroup);
		}
	}
	canvasToolsSupport.data.selectionTools.prepareToRemoveGroup = false;
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.selectAndDragTool.onMouseDrag = function(event) {
	if (canvasToolsSupport.data.selectionTools.prepareToPan) {
		canvasToolsActions.mouseActions.pan(event);
	} else {
		canvasToolsSupport.data.selectionTools.prepareToRemoveGroup = false;
		canvasToolsActions.mouseActions.moveSelection(event);
	}
};
canvasTools.selectAndDragTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		canvasTools.dragIndividuallyTool.activate();
	} else if (event.key == "h") {
		canvasTools.handTool.activate();
	} else if (event.key == "z") {
		canvasTools.zoomTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsSupport.deleteSelection();
	} else if (!Key.isDown("shift") && (event.key == "=" || event.key == "-")) {
		canvasToolsActions.keyActions.zoom(event);
	} else if (event.key == "+" || event.key == "_") {
		canvasToolsActions.keyActions.scaleVectors(event);
	// Tool-specific actions
	} else if (!Key.isDown("shift") && canvasToolsSupport.data.selectionTools.selectedGroups.length != 0 && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.moveSelection(event);
	} else if ((Key.isDown("shift") || canvasToolsSupport.data.selectionTools.selectedGroups.length == 0) && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.pan(event);
	}
};

// Tool to select and move entities individually
canvasTools.dragIndividuallyTool.toolName = "Select and Drag Items Individually";
canvasTools.dragIndividuallyTool.onMouseMove = function(event) {
	canvasToolsActions.mouseActions.hover(event);
};
canvasTools.dragIndividuallyTool.onMouseDown = function(event) {
	if (Key.isDown("space")) {
		canvasToolsSupport.data.selectionTools.prepareToPan = true;
	} else {
		var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
		if (hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item)) { // Hit a group!
			canvasToolsSupport.data.selectionTools.clickedGroup = canvasToolsSupport.findOverallGroupParent(hitResult.item);
			if (canvasToolsSupport.data.selectionTools.selectedGroups.length > 0) {
				canvasToolsSupport.clearSelection();
			}
			canvasToolsSupport.addToSelection(canvasToolsSupport.data.selectionTools.clickedGroup);
		} else {
			canvasToolsSupport.clearSelection();
			canvasToolsSupport.data.selectionTools.prepareToPan = true;
			canvasToolsSupport.data.selectionTools.clickedGroup = null;
		}
	}
};
canvasTools.dragIndividuallyTool.onMouseUp = function(event) {
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.dragIndividuallyTool.onMouseDrag = function(event) {
	if (canvasToolsSupport.data.selectionTools.prepareToPan) {
		canvasToolsActions.mouseActions.pan(event);
	} else {
		canvasToolsActions.mouseActions.moveSelection(event);
	}
};
canvasTools.dragIndividuallyTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		canvasTools.selectAndDragTool.activate();
	} else if (event.key == "h") {
		canvasTools.handTool.activate();
	} else if (event.key == "z") {
		canvasTools.zoomTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsSupport.deleteSelection();
	} else if (!Key.isDown("shift") && (event.key == "=" || event.key == "-")) {
		canvasToolsActions.keyActions.zoom(event);
	} else if (event.key == "+" || event.key == "_") {
		canvasToolsActions.keyActions.scaleVectors(event);
	// Tool-specific actions
	} else if (!Key.isDown("shift") && canvasToolsSupport.data.selectionTools.selectedGroups.length != 0 && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.moveSelection(event);
	} else if ((Key.isDown("shift") || canvasToolsSupport.data.selectionTools.selectedGroups.length == 0) && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.pan(event);
	} else if (event.key == "j" || event.key == "k") {
		canvasToolsActions.keyActions.selectNextOrPrevious(event);
	}
};

// Tool to pan the canvas
canvasTools.handTool.toolName = "Drag the View";
canvasTools.handTool.onMouseDrag = function(event) {
	canvasToolsActions.mouseActions.pan(event);
};
canvasTools.handTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		canvasTools.dragIndividuallyTool.activate();
	} else if (event.key == "z") {
		canvasTools.zoomTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsSupport.deleteSelection();
	} else if (!Key.isDown("shift") && (event.key == "=" || event.key == "-")) {
		canvasToolsActions.keyActions.zoom(event);
	} else if (event.key == "+" || event.key == "_") {
		canvasToolsActions.keyActions.scaleVectors(event);
	// Tool-specific actions
	} else if (!Key.isDown("shift") && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.pan(event);
	} else if (Key.isDown("shift") && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.moveSelection(event);
	}
};

// Tool to zoom the canvas
canvasTools.zoomTool.toolName = "Zoom the View";
canvasTools.zoomTool.onMouseDown = function(event) {
	if (Key.isDown("space")) {
		canvasToolsSupport.data.selectionTools.prepareToPan = true;
	}
};
canvasTools.zoomTool.onMouseUp = function(event) {
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.zoomTool.onMouseDrag = function(event) {
	if (canvasToolsSupport.data.selectionTools.prepareToPan) {
		canvasToolsActions.mouseActions.pan(event);
	} else {
		canvasToolsActions.mouseActions.zoom(event);
	}
};
canvasTools.zoomTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		canvasTools.dragIndividuallyTool.activate();
	} else if (event.key == "h") {
		canvasTools.handTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsSupport.deleteSelection();
	} else if (!Key.isDown("shift") && (event.key == "=" || event.key == "-")) {
		canvasToolsActions.keyActions.zoom(event);
	} else if (event.key == "+" || event.key == "_") {
		canvasToolsActions.keyActions.scaleVectors(event);
	// Tool-specific actions
	} else if (!Key.isDown("shift") && (event.key == "up" || event.key == "down")) {
		canvasToolsActions.keyActions.zoom(event);
	} else if (!Key.isDown("shift") && (event.key == "right" || event.key == "left")) {
		canvasToolsActions.keyActions.scaleVectors(event);
	} else if (Key.isDown("shift") && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.pan(event);
	}
};

// Tool to add new Location probes
canvasTools.newLocationProbeTool.toolName = "Location (x,y)";
canvasTools.newLocationProbeTool.onMouseMove = canvasTools.dragIndividuallyTool.onMouseMove;
canvasTools.newLocationProbeTool.onMouseDown = canvasTools.dragIndividuallyTool.onMouseDown;
canvasTools.newLocationProbeTool.onMouseUp = function(event) {
	var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
	if (!(hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item))) { // Did not hit a group!
		currentUniverse.addEntity(new UniverseLocation({
			id: currentUniverse.getNextEntityId(),
			point: {
				location: currentUniverse.findUniverseCoordinates(event.point)
			}
		}, currentUniverse));
	}
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.newLocationProbeTool.onMouseDrag = canvasTools.dragIndividuallyTool.onMouseDrag;
canvasTools.newLocationProbeTool.onKeyDown = canvasTools.dragIndividuallyTool.onKeyDown;

// Tool to add new Electrons
canvasTools.newElectronTool.toolName = "Electron";
canvasTools.newElectronTool.onMouseMove = canvasTools.dragIndividuallyTool.onMouseMove;
canvasTools.newElectronTool.onMouseDown = canvasTools.dragIndividuallyTool.onMouseDown;
canvasTools.newElectronTool.onMouseUp = function(event) {
	var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
	if (!(hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item))) { // Did not hit a group!
		currentUniverse.addEntity(new Electron({
			id: currentUniverse.getNextEntityId(),
			point: {
				location: currentUniverse.findUniverseCoordinates(event.point)
			}
		}, currentUniverse));
	}
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.newElectronTool.onMouseDrag = canvasTools.dragIndividuallyTool.onMouseDrag;
canvasTools.newElectronTool.onKeyDown = canvasTools.dragIndividuallyTool.onKeyDown;

// Tool to add new Protons
canvasTools.newProtonTool.toolName = "Proton";
canvasTools.newProtonTool.onMouseMove = canvasTools.dragIndividuallyTool.onMouseMove;
canvasTools.newProtonTool.onMouseDown = canvasTools.dragIndividuallyTool.onMouseDown;
canvasTools.newProtonTool.onMouseUp = function(event) {
	var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
	if (!(hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item))) { // Did not hit a group!
		currentUniverse.addEntity(new Proton({
			id: currentUniverse.getNextEntityId(),
			point: {
				location: currentUniverse.findUniverseCoordinates(event.point)
			}
		}, currentUniverse));
	}
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.newProtonTool.onMouseDrag = canvasTools.dragIndividuallyTool.onMouseDrag;
canvasTools.newProtonTool.onKeyDown = canvasTools.dragIndividuallyTool.onKeyDown;

// Tool to add new E Field Vector probes
canvasTools.newEFieldVectorProbeTool.toolName = "Electric Field Vector";
canvasTools.newEFieldVectorProbeTool.onMouseMove = canvasTools.dragIndividuallyTool.onMouseMove;
canvasTools.newEFieldVectorProbeTool.onMouseDown = canvasTools.dragIndividuallyTool.onMouseDown;
canvasTools.newEFieldVectorProbeTool.onMouseUp = function(event) {
	var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
	if (!(hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item))) { // Did not hit a group!
		currentUniverse.addEntity(new EFieldVector({
			id: currentUniverse.getNextEntityId(),
			point: {
				location: currentUniverse.findUniverseCoordinates(event.point)
			}
		}, currentUniverse));
	}
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.newEFieldVectorProbeTool.onMouseDrag = canvasTools.dragIndividuallyTool.onMouseDrag;
canvasTools.newEFieldVectorProbeTool.onKeyDown = canvasTools.dragIndividuallyTool.onKeyDown;

// Tool to add new E Field Magnitude probes
canvasTools.newEFieldMagnitudeProbeTool.toolName = "Electric Field Magnitude";
canvasTools.newEFieldMagnitudeProbeTool.onMouseMove = canvasTools.dragIndividuallyTool.onMouseMove;
canvasTools.newEFieldMagnitudeProbeTool.onMouseDown = canvasTools.dragIndividuallyTool.onMouseDown;
canvasTools.newEFieldMagnitudeProbeTool.onMouseUp = function(event) {
	var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
	if (!(hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item))) { // Did not hit a group!
		currentUniverse.addEntity(new EFieldMagnitude({
			id: currentUniverse.getNextEntityId(),
			point: {
				location: currentUniverse.findUniverseCoordinates(event.point)
			}
		}, currentUniverse));
	}
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.newEFieldMagnitudeProbeTool.onMouseDrag = canvasTools.dragIndividuallyTool.onMouseDrag;
canvasTools.newEFieldMagnitudeProbeTool.onKeyDown = canvasTools.dragIndividuallyTool.onKeyDown;

// Tool to add new E Field Direction probes
canvasTools.newEFieldDirectionProbeTool.toolName = "Electric Field Direction";
canvasTools.newEFieldDirectionProbeTool.onMouseMove = canvasTools.dragIndividuallyTool.onMouseMove;
canvasTools.newEFieldDirectionProbeTool.onMouseDown = canvasTools.dragIndividuallyTool.onMouseDown;
canvasTools.newEFieldDirectionProbeTool.onMouseUp = function(event) {
	var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
	if (!(hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item))) { // Did not hit a group!
		currentUniverse.addEntity(new EFieldDirection({
			id: currentUniverse.getNextEntityId(),
			point: {
				location: currentUniverse.findUniverseCoordinates(event.point)
			}
		}, currentUniverse));
	}
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.newEFieldDirectionProbeTool.onMouseDrag = canvasTools.dragIndividuallyTool.onMouseDrag;
canvasTools.newEFieldDirectionProbeTool.onKeyDown = canvasTools.dragIndividuallyTool.onKeyDown;

// Tool to add new E Field Line probes
canvasTools.newEFieldLineProbeTool.toolName = "Electric Field Line";
canvasTools.newEFieldLineProbeTool.onMouseMove = canvasTools.dragIndividuallyTool.onMouseMove;
canvasTools.newEFieldLineProbeTool.onMouseDown = canvasTools.dragIndividuallyTool.onMouseDown;
canvasTools.newEFieldLineProbeTool.onMouseUp = function(event) {
	var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
	if (!(hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item))) { // Did not hit a group!
		currentUniverse.addEntity(new EFieldLine({
			id: currentUniverse.getNextEntityId(),
			point: {
				location: currentUniverse.findUniverseCoordinates(event.point)
			}
		}, currentUniverse));
	}
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.newEFieldLineProbeTool.onMouseDrag = canvasTools.dragIndividuallyTool.onMouseDrag;
canvasTools.newEFieldLineProbeTool.onKeyDown = canvasTools.dragIndividuallyTool.onKeyDown;

// Tool to add new E Potential probes
canvasTools.newEPotentialProbeTool.toolName = "Electric Potential";
canvasTools.newEPotentialProbeTool.onMouseMove = canvasTools.dragIndividuallyTool.onMouseMove;
canvasTools.newEPotentialProbeTool.onMouseDown = canvasTools.dragIndividuallyTool.onMouseDown;
canvasTools.newEPotentialProbeTool.onMouseUp = function(event) {
	var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
	if (!(hitResult && canvasToolsSupport.isInClickableGroup(hitResult.item))) { // Did not hit a group!
		currentUniverse.addEntity(new EPotential({
			id: currentUniverse.getNextEntityId(),
			point: {
				location: currentUniverse.findUniverseCoordinates(event.point)
			}
		}, currentUniverse));
	}
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
canvasTools.newEPotentialProbeTool.onMouseDrag = canvasTools.dragIndividuallyTool.onMouseDrag;
canvasTools.newEPotentialProbeTool.onKeyDown = canvasTools.dragIndividuallyTool.onKeyDown;

// Activate the individual selection tool as default
canvasTools.dragIndividuallyTool.activate();

