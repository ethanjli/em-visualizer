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
		selectionToolsData.hoveredGroup.associatedEntity.setHovered();
	} else if (selectionToolsData.hoveredGroup !== null) { // Just left a group which wasn't clicked and wasn't already in the selection
		// Hide the selection box after the mouse moves off the group
		selectionToolsData.hoveredGroup.associatedEntity.setUnhovered();
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
			// Remove the group from the selection and hide its selection box
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
		selectedGroups.forEach(function(selectedGroup) {
			currentUniverse.removeEntity(selectedGroup.associatedEntity);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		});
		selectedGroups.empty();
	// Tool-specific actions
	} else if (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right") {
		// Choose an offset
		if (event.key == "up") {
			var offset = new Point(0, -1);
		} else if (event.key == "down") {
			var offset = new Point(0, 1);
		} else if (event.key == "left") {
			var offset = new Point(-1, 0);
		} else if (event.key == "right") {
			var offset = new Point(1, 0);
		}
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(offset, currentUniverse);
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
		selectionToolsData.hoveredGroup.associatedEntity.setHovered();
	} else if (selectionToolsData.hoveredGroup !== null) { // Just left a group which wasn't clicked and wasn't already in the selection
		// Hide the selection box after the mouse moves off the group
		selectionToolsData.hoveredGroup.associatedEntity.setUnhovered();
		selectionToolsData.hoveredGroup = null;
	}
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
		selectedGroups.forEach(function(selectedGroup) {
			currentUniverse.removeEntity(selectedGroup.associatedEntity);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		});
		selectedGroups.empty();
	// Tool-specific actions
	} else if (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right") {
		// Choose an offset
		if (event.key == "up") {
			var offset = new Point(0, -1);
		} else if (event.key == "down") {
			var offset = new Point(0, 1);
		} else if (event.key == "left") {
			var offset = new Point(-1, 0);
		} else if (event.key == "right") {
			var offset = new Point(1, 0);
		}
		selectedGroups.forEach(function(selectedGroup) {
			if (!selectedGroup.associatedEntity.isAnchored()) {
				selectedGroup.associatedEntity.updateLocationByOffset(offset, currentUniverse);
			}
		});
	} else if (event.key == "j" || event.key == "k") {
		if (selectedGroups.length == 0) { // there is no selection yet
			var indexOfLastSelectedGroup = 0;
			var remainingEntities = currentUniverse.getEntities().filter(function(entity) {
				return typeof(entity) !== "undefined" && entity !== null;
			});
		} else {
			var indexOfLastSelectedGroup = selectedGroups[selectedGroups.length - 1].associatedEntity.getId();
			var allEntities = currentUniverse.getEntities();
			// Rearrange the entities list
			if (event.key == "j") {
				var rearrangedEntities = allEntities.slice(indexOfLastSelectedGroup + 1).concat(allEntities.slice(0, indexOfLastSelectedGroup + 1));
			} else if (event.key == "k") {
				var rearrangedEntities = allEntities.slice(indexOfLastSelectedGroup).concat(allEntities.slice(0, indexOfLastSelectedGroup)); 
			}
			// Ignore non-existent entities
			var remainingEntities = rearrangedEntities.filter(function(entity) {
				return typeof(entity) !== "undefined" && entity !== null;
			});
			// Clear the selection
			selectedGroups.forEach(function(selectedGroup) {
				selectedGroup.associatedEntity.setUnselected();
			});
		}
		if (remainingEntities.length == 0) {
			debug.error("There is nothing in the universe to select!");
			return false;
		}
		// Choose the new selection
		if (event.key == "j") {
			selectionToolsData.clickedGroup = remainingEntities[0].getGroup();
		} else if (event.key == "k") {
			selectionToolsData.clickedGroup = remainingEntities[remainingEntities.length - 1].getGroup();
		}
		// Make the new selection
		selectedGroups = [selectionToolsData.clickedGroup];
		selectionToolsData.clickedGroup.associatedEntity.setSelected();
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
		selectedGroups.forEach(function(selectedGroup) {
			currentUniverse.removeEntity(selectedGroup.associatedEntity);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		});
		selectedGroups.empty();
	// Tool-specific actions
	} else if (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right") {
		// Choose an offset
		if (event.key == "up") {
			var offset = new Point(0, -1);
		} else if (event.key == "down") {
			var offset = new Point(0, 1);
		} else if (event.key == "left") {
			var offset = new Point(-1, 0);
		} else if (event.key == "right") {
			var offset = new Point(1, 0);
		}
		currentUniverse.translateCenterOfCanvas(currentUniverse.findUniverseCoordinatesOffset(offset));
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
		dragIndividuallyTool.activate();
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
	} else if (event.key == "up" || event.key == "down") {
		if (event.key == "up") {
			var delta = 10 / 100;
		} else if (event.key == "down") {
			var delta = -1 * 10 / 100;
		}
		currentUniverse.setCanvasZoomExponent(currentUniverse.getCanvasZoomExponent() + delta);
	}
	currentUniverse.refreshCanvasPositions(currentUniverse);
};

dragIndividuallyTool.activate();
