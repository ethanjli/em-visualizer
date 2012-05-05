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
	var hitResult = project.hitTest(event.point, hitOptions);
	
	if (hitResult && hitResult.item.parent) { // Hit a group!
		selectionToolsData.hoveredGroup = hitResult.item.parent.parent;
		if (!selectedGroups.contains(selectionToolsData.hoveredGroup)) { // Hovering over a group which is not already in the selection
			selectionToolsData.hoveredGroup.associatedEntity.setHovered();
		}
	} else if (selectionToolsData.hoveredGroup !== null && !selectedGroups.contains(selectionToolsData.hoveredGroup)) { // Just left a group which wasn't clicked and wasn't already in the selection
		// Hide the selection box after the mouse moves off the group
		selectionToolsData.hoveredGroup.associatedEntity.setUntouched();
		selectionToolsData.hoveredGroup = null;
	}
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
			selectedGroup.associatedEntity.setUntouched();
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
			// Remove the group from the selection and hide its selection box
			selectedGroups = selectedGroups.erase(selectionToolsData.unclickedGroup);
			selectionToolsData.unclickedGroup.associatedEntity.setUntouched();
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
		selectedGroups.forEach(function(selectedGroup) {
			currentUniverse.removeEntity(selectedGroup.associatedEntity);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		});
		selectedGroups.empty();
	// Tool-specific actions
	} else if (event.key == "up") {
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(new Point(0, -1), currentUniverse);
			}
		});
	} else if (event.key == "down") {
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(new Point(0, 1), currentUniverse);
			}
		});
	} else if (event.key == "left") {
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(new Point(-1, 0), currentUniverse);
			}
		});
	} else if (event.key == "right") {
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(new Point(1, 0), currentUniverse);
			}
		});
	}
};

// Tool to select and move entities individually
var dragIndividuallyTool = new Tool();
dragIndividuallyTool.onMouseMove = function(event) {
	var hitResult = project.hitTest(event.point, hitOptions);
	
	if (hitResult && hitResult.item.parent) { // Hit a group!
		selectionToolsData.hoveredGroup = hitResult.item.parent.parent;
		if (!selectedGroups.contains(selectionToolsData.hoveredGroup)) { // Hovering over a group which is not already in the selection
			selectionToolsData.hoveredGroup.associatedEntity.setHovered();
		}
	} else if (selectionToolsData.hoveredGroup !== null && !selectedGroups.contains(selectionToolsData.hoveredGroup)) { // Just left a group which wasn't clicked and wasn't already in the selection
		// Hide the selection box after the mouse moves off the group
		selectionToolsData.hoveredGroup.associatedEntity.setUntouched();
		selectionToolsData.hoveredGroup = null;
	}
};
dragIndividuallyTool.onMouseDown = function(event) {
	var hitResult = project.hitTest(event.point, hitOptions);
	if (hitResult && hitResult.item.parent) { // Hit a group!
		selectionToolsData.clickedGroup = hitResult.item.parent.parent;
		if (selectedGroups.length > 0) {
			selectedGroups.forEach(function(selectedGroup) {
				selectedGroup.associatedEntity.setUntouched();
			});
		}
		selectedGroups = [selectionToolsData.clickedGroup];
		selectionToolsData.clickedGroup.associatedEntity.setSelected();
	} else {
		// Clear the selection
		selectedGroups.forEach(function(selectedGroup) {
			selectedGroup.associatedEntity.setUntouched();
		});
		selectedGroups.empty();
		selectionToolsData.clickedGroup = null;
	}
};
dragIndividuallyTool.onMouseDrag = function(event) {
	if (selectedGroups.length != 0 && !selectedGroups[0].associatedEntity.isAnchored()) {
		selectedGroups[0].associatedEntity.updateLocationByOffset(event.delta, currentUniverse);
	}
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
		selectedGroups.forEach(function(selectedGroup) {
			currentUniverse.removeEntity(selectedGroup.associatedEntity);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		});
		selectedGroups.empty();
	// Tool-specific actions
	} else if (event.key == "up") {
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(new Point(0, -1), currentUniverse);
			}
		});
	} else if (event.key == "down") {
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(new Point(0, 1), currentUniverse);
			}
		});
	} else if (event.key == "left") {
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(new Point(-1, 0), currentUniverse);
			}
		});
	} else if (event.key == "right") {
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(new Point(1, 0), currentUniverse);
			}
		});
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
		selectAndDragTool.activate();
	} else if (event.key == "z") {
		zoomTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		selectedGroups.forEach(function(selectedGroup) {
			currentUniverse.removeEntity(selectedGroup.associatedEntity);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		});
		selectedGroups.empty();
	// Tool-specific actions
	} else if (event.key == "up") {
		currentUniverse.translateCenterOfCanvas(currentUniverse.findUniverseCoordinatesOffset(new Point(0, -1)).multiply(-1));
	} else if (event.key == "down") {
		currentUniverse.translateCenterOfCanvas(currentUniverse.findUniverseCoordinatesOffset(new Point(0, 1)).multiply(-1));
	} else if (event.key == "left") {
		currentUniverse.translateCenterOfCanvas(currentUniverse.findUniverseCoordinatesOffset(new Point(-1, 0)).multiply(-1));
	} else if (event.key == "right") {
		currentUniverse.translateCenterOfCanvas(currentUniverse.findUniverseCoordinatesOffset(new Point(1, 0)).multiply(-1));
	}
	currentUniverse.refreshCanvasPositions(currentUniverse);
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
		selectAndDragTool.activate();
	} else if (event.key == "h") {
		handTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		selectedGroups.forEach(function(selectedGroup) {
			currentUniverse.removeEntity(selectedGroup.associatedEntity);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		});
		selectedGroups.empty();
	// Tool-specific actions
	} else if (event.key == "up") {
		currentUniverse.setCanvasZoomExponent(currentUniverse.getCanvasZoomExponent() + 10 / 100);
	} else if (event.key == "down") {
		currentUniverse.setCanvasZoomExponent(currentUniverse.getCanvasZoomExponent() - 10 / 100);
	}
	currentUniverse.refreshCanvasPositions(currentUniverse);
};

dragIndividuallyTool.activate();
