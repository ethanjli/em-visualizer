// Set up tools
var selectedGroups = new Array();
var hitOptions = {
	fill: true,
	stroke: true,
	segment: true,
	tolerance: 10
};

// Tool to select and move entities
var selectAndDragTool = new Tool();
var selectionToolsData = {
	hoveredGroup: null,
	clickedGroup: null,
	unclickedGroup: null,
	prepareToRemoveGroup: false
};
selectAndDragTool.onMouseMove = function(event) {
	canvasToolsActions.mouseActions.hover(event);
};
selectAndDragTool.onMouseDown = function(event) {
	var hitResult = project.hitTest(event.point, hitOptions);
	if (hitResult && hitResult.item.parent) { // Hit a group!
		selectionToolsData.clickedGroup = hitResult.item.parent.parent;
		if (!selectedGroups.contains(selectionToolsData.clickedGroup)) { // the clicked group is not already in the selection 
			selectedGroups.include(selectionToolsData.clickedGroup);
			selectionToolsData.clickedGroup.associatedEntity.setSelected();
			selectionToolsData.prepareToRemoveGroup = false;
		} else {
			selectionToolsData.prepareToRemoveGroup = true;
		}
	} else {
		// Clear the selection
		selectedGroups.forEach(function(selectedGroup) {
			selectedGroup.associatedEntity.setUnselected();
		});
		selectedGroups.empty();
		selectionToolsData.clickedGroup = null;
		selectionToolsData.prepareToRemoveGroup = false;
	}
};
selectAndDragTool.onMouseUp = function(event) {
	if (selectionToolsData.prepareToRemoveGroup) { // If the mouse is released from a click (as opposed to a drag)
		var hitResult = project.hitTest(event.point, hitOptions);
		if (hitResult && hitResult.item.parent) { // Hit a group!
			selectionToolsData.unclickedGroup = hitResult.item.parent.parent;
			// Remove the group from the selection
			selectedGroups = selectedGroups.erase(selectionToolsData.unclickedGroup);
			selectionToolsData.unclickedGroup.associatedEntity.setUnselected();
		}
	}
	selectionToolsData.prepareToRemoveGroup = false;
};
selectAndDragTool.onMouseDrag = function(event) {
	selectionToolsData.prepareToRemoveGroup = false;
	selectedGroups.forEach(function(selectedGroup) {
		if (!selectedGroup.associatedEntity.isAnchored()) {
			selectedGroup.associatedEntity.updateLocationByOffset(event.delta, currentUniverse);
		}
	});
	currentUniverse.refreshProbeGraphics(currentUniverse);
};
selectAndDragTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		dragIndividuallyTool.activate();
	} else if (event.key == "h") {
		handTool.activate();
	} else if (event.key == "z") {
		zoomTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsActions.tools.deleteSelection();
	} else if (event.key == "=" || event.key == "-") {
		canvasToolsActions.keyActions.zoom(event);
	// Tool-specific actions
	} else if (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right") {
		canvasToolsActions.keyActions.moveSelection(event);
	}
};

// Tool to select and move entities individually
var dragIndividuallyTool = new Tool();
dragIndividuallyTool.onMouseMove = function(event) {
	canvasToolsActions.mouseActions.hover(event);
};
dragIndividuallyTool.onMouseDown = function(event) {
	var hitResult = project.hitTest(event.point, hitOptions);
	if (hitResult && hitResult.item.parent) { // Hit a group!
		selectionToolsData.clickedGroup = hitResult.item.parent.parent;
		if (selectedGroups.length > 0) {
			selectedGroups.forEach(function(selectedGroup) {
				selectedGroup.associatedEntity.setUnselected();
			});
		}
		selectedGroups = [selectionToolsData.clickedGroup];
		selectionToolsData.clickedGroup.associatedEntity.setSelected();
	} else {
		// Clear the selection
		selectedGroups.forEach(function(selectedGroup) {
			selectedGroup.associatedEntity.setUnselected();
		});
		selectedGroups.empty();
		selectionToolsData.clickedGroup = null;
	}
};
dragIndividuallyTool.onMouseDrag = function(event) {
	selectedGroups.forEach(function(selectedGroup) {
		if (!selectedGroup.associatedEntity.isAnchored()) {
			selectedGroup.associatedEntity.updateLocationByOffset(event.delta, currentUniverse);
		}
	});
	currentUniverse.refreshProbeGraphics(currentUniverse);
};
dragIndividuallyTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		selectAndDragTool.activate();
	} else if (event.key == "h") {
		handTool.activate();
	} else if (event.key == "z") {
		zoomTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsActions.tools.deleteSelection();
	} else if (event.key == "=" || event.key == "-") {
		canvasToolsActions.keyActions.zoom(event);
	// Tool-specific actions
	} else if (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right") {
		canvasToolsActions.keyActions.moveSelection(event);
	} else if (event.key == "j" || event.key == "k") {
		canvasToolsActions.keyActions.selectNextOrPrevious(event);
	}
};

// Tool to pan the canvas
var handTool = new Tool();
handTool.onMouseDrag = function(event) {
	currentUniverse.translateCenterOfCanvas(currentUniverse.findUniverseCoordinatesOffset(event.delta).multiply(-1));
	currentUniverse.refreshCanvasPositions(currentUniverse);
};

handTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		dragIndividuallyTool.activate();
	} else if (event.key == "z") {
		zoomTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsActions.tools.deleteSelection();
	} else if (event.key == "=" || event.key == "-") {
		canvasToolsActions.keyActions.zoom(event);
	// Tool-specific actions
	} else if (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right") {
		canvasToolsActions.keyActions.pan(event);
	}
};

// Tool to zoom the canvas
var zoomTool = new Tool();
zoomTool.onMouseDrag = function(event) {
	currentUniverse.setCanvasZoomExponent(currentUniverse.getCanvasZoomExponent() + event.delta.y / 100);
	currentUniverse.refreshCanvasPositions(currentUniverse);
};

zoomTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		dragIndividuallyTool.activate();
	} else if (event.key == "h") {
		handTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsActions.tools.deleteSelection();
	// Tool-specific actions
	} else if (event.key == "up" || event.key == "down" || event.key == "=" || event.key == "-") {
		canvasToolsActions.keyActions.zoom(event);
	}
};

dragIndividuallyTool.activate();
