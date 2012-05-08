// Tool to select and move entities
var selectAndDragTool = new Tool();
selectAndDragTool.onMouseMove = function(event) {
	canvasToolsActions.mouseActions.hover(event);
};
selectAndDragTool.onMouseDown = function(event) {
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
selectAndDragTool.onMouseUp = function(event) {
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
selectAndDragTool.onMouseDrag = function(event) {
	if (canvasToolsSupport.data.selectionTools.prepareToPan) {
		canvasToolsActions.mouseActions.pan(event);
	} else {
		canvasToolsSupport.data.selectionTools.prepareToRemoveGroup = false;
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
var dragIndividuallyTool = new Tool();
dragIndividuallyTool.onMouseMove = function(event) {
	canvasToolsActions.mouseActions.hover(event);
};
dragIndividuallyTool.onMouseDown = function(event) {
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
dragIndividuallyTool.onMouseUp = function(event) {
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
dragIndividuallyTool.onMouseDrag = function(event) {
	if (canvasToolsSupport.data.selectionTools.prepareToPan) {
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
var zoomTool = new Tool();
zoomTool.onMouseDown = function(event) {
	if (Key.isDown("space")) {
		canvasToolsSupport.data.selectionTools.prepareToPan = true;
	}
};
zoomTool.onMouseUp = function(event) {
	canvasToolsSupport.data.selectionTools.prepareToPan = false;
};
zoomTool.onMouseDrag = function(event) {
	if (canvasToolsSupport.data.selectionTools.prepareToPan) {
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

dragIndividuallyTool.activate();
