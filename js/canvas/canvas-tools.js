var canvasTools = {
	selectAndDragTool: new Tool(),
	dragIndividuallyTool: new Tool(),
	handTool: new Tool(),
	zoomTool: new Tool()
};

// Tool to select and move entities
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

canvasTools.dragIndividuallyTool.activate();
