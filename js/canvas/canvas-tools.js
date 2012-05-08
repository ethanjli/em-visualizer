// Set up tools
var hitOptions = {
	fill: true,
	stroke: true,
	segment: true,
	tolerance: 0
};

// Tool to select and move entities
var selectAndDragTool = new Tool();
var selectionToolsData = {
	selectedGroups: new Array(),
	hoveredGroup: null,
	clickedGroup: null,
	unclickedGroup: null,
	prepareToRemoveGroup: false,
	prepareToPan: false
};
selectAndDragTool.onMouseMove = function(event) {
	canvasToolsActions.mouseActions.hover(event);
};
selectAndDragTool.onMouseDown = function(event) {
	if (Key.isDown("space")) {
		selectionToolsData.prepareToPan = true;
	} else {
		var hitResult = project.hitTest(event.point, hitOptions);
		 if (hitResult && canvasToolsSupport.tools.isInClickableGroup(hitResult.item)) { // Hit a group!
			selectionToolsData.clickedGroup = canvasToolsSupport.tools.findOverallGroupParent(hitResult.item);
			if (!selectionToolsData.selectedGroups.contains(selectionToolsData.clickedGroup)) { // the clicked group is not already in the selection 
				canvasToolsSupport.tools.addToSelection(selectionToolsData.clickedGroup);
				selectionToolsData.prepareToRemoveGroup = false;
			} else {
				selectionToolsData.prepareToRemoveGroup = true;
			}
		} else {
			canvasToolsSupport.tools.clearSelection();
			selectionToolsData.clickedGroup = null;
			selectionToolsData.prepareToRemoveGroup = false;
		}
	}
};
selectAndDragTool.onMouseUp = function(event) {
	if (selectionToolsData.prepareToRemoveGroup) { // If the mouse is released from a click (as opposed to a drag)
		var hitResult = project.hitTest(event.point, hitOptions);
		if (hitResult && canvasToolsSupport.tools.isInClickableGroup(hitResult.item)) { // Hit a group!
			selectionToolsData.unclickedGroup = canvasToolsSupport.tools.findOverallGroupParent(hitResult.item);
			canvasToolsSupport.tools.removeFromSelection(selectionToolsData.unclickedGroup);
		}
	}
	selectionToolsData.prepareToRemoveGroup = false;
	selectionToolsData.prepareToPan = false;
};
selectAndDragTool.onMouseDrag = function(event) {
	if (selectionToolsData.prepareToPan) {
		canvasToolsActions.mouseActions.pan(event);
	} else {
		selectionToolsData.prepareToRemoveGroup = false;
		canvasToolsActions.mouseActions.moveSelection(event);
	}
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
		canvasToolsSupport.tools.deleteSelection();
	} else if (!Key.isDown("shift") && (event.key == "=" || event.key == "-")) {
		canvasToolsActions.keyActions.zoom(event);
	} else if (event.key == "+" || event.key == "_") {
		canvasToolsActions.keyActions.scaleVectors(event);
	// Tool-specific actions
	} else if (!Key.isDown("shift") && selectionToolsData.selectedGroups.length != 0 && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.moveSelection(event);
	} else if ((Key.isDown("shift") || selectionToolsData.selectedGroups.length == 0) && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.pan(event);
	}
};

// Tool to select and move entities individually
var dragIndividuallyTool = new Tool();
dragIndividuallyTool.onMouseMove = function(event) {
	canvasToolsActions.mouseActions.hover(event);
};
dragIndividuallyTool.onMouseDown = function(event) {
	if (Key.isDown("space")) {
		selectionToolsData.prepareToPan = true;
	} else {
		var hitResult = project.hitTest(event.point, hitOptions);
		if (hitResult && canvasToolsSupport.tools.isInClickableGroup(hitResult.item)) { // Hit a group!
			selectionToolsData.clickedGroup = canvasToolsSupport.tools.findOverallGroupParent(hitResult.item);
			if (selectionToolsData.selectedGroups.length > 0) {
				canvasToolsSupport.tools.clearSelection();
			}
			canvasToolsSupport.tools.addToSelection(selectionToolsData.clickedGroup);
		} else {
			canvasToolsSupport.tools.clearSelection();
			selectionToolsData.clickedGroup = null;
		}
	}
};
dragIndividuallyTool.onMouseUp = function(event) {
	selectionToolsData.prepareToPan = false;
};
dragIndividuallyTool.onMouseDrag = function(event) {
	if (selectionToolsData.prepareToPan) {
		canvasToolsActions.mouseActions.pan(event);
	} else {
		canvasToolsActions.mouseActions.moveSelection(event);
	}
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
		canvasToolsSupport.tools.deleteSelection();
	} else if (!Key.isDown("shift") && (event.key == "=" || event.key == "-")) {
		canvasToolsActions.keyActions.zoom(event);
	} else if (event.key == "+" || event.key == "_") {
		canvasToolsActions.keyActions.scaleVectors(event);
	// Tool-specific actions
	} else if (!Key.isDown("shift") && selectionToolsData.selectedGroups.length != 0 && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.moveSelection(event);
	} else if ((Key.isDown("shift") || selectionToolsData.selectedGroups.length == 0) && (event.key == "up" || event.key == "down" || event.key == "left" || event.key == "right")) {
		canvasToolsActions.keyActions.pan(event);
	} else if (event.key == "j" || event.key == "k") {
		canvasToolsActions.keyActions.selectNextOrPrevious(event);
	}
};

// Tool to pan the canvas
var handTool = new Tool();
handTool.onMouseDrag = function(event) {
	canvasToolsActions.mouseActions.pan(event);
};
handTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		dragIndividuallyTool.activate();
	} else if (event.key == "z") {
		zoomTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsSupport.tools.deleteSelection();
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
var zoomTool = new Tool();
zoomTool.onMouseDown = function(event) {
	if (Key.isDown("space")) {
		selectionToolsData.prepareToPan = true;
	}
};
zoomTool.onMouseUp = function(event) {
	selectionToolsData.prepareToPan = false;
};
zoomTool.onMouseDrag = function(event) {
	if (selectionToolsData.prepareToPan) {
		canvasToolsActions.mouseActions.pan(event);
	} else {
		canvasToolsActions.mouseActions.zoom(event);
	}
};
zoomTool.onKeyDown = function(event) {
	// Tool selectors
	if (event.key == "v") {
		dragIndividuallyTool.activate();
	} else if (event.key == "h") {
		handTool.activate();
	// Global actions
	} else if (event.key == "delete") {
		canvasToolsSupport.tools.deleteSelection();
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

dragIndividuallyTool.activate();
