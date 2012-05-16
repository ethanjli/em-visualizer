var canvasToolsActions = {
	mouseActions: {
		hover: function(event) {
			var hitResult = project.hitTest(event.point, canvasToolsSupport.data.hitOptions);
			
			if (hitResult && hitResult.item.parent && canvasToolsSupport.isInClickableGroup(hitResult.item)) { // Hit a group!
				if (canvasToolsSupport.data.selectionTools.hoveredGroup != null && canvasToolsSupport.data.selectionTools.hoveredGroup != hitResult.item.parent.parent) { // Moved from a group onto a different one
					canvasToolsSupport.data.selectionTools.hoveredGroup.associatedEntity.setUnhovered();
					canvasToolsSupport.hoverFromItem(hitResult.item);
				} else if (canvasToolsSupport.data.selectionTools.hoveredGroup == null) { // Move from blank canvas onto a group
					canvasToolsSupport.hoverFromItem(hitResult.item);
				}
			} else if (canvasToolsSupport.data.selectionTools.hoveredGroup != null) { // Moved from a group and onto blank canvas
				canvasToolsSupport.data.selectionTools.hoveredGroup.associatedEntity.setUnhovered();
				canvasToolsSupport.data.selectionTools.hoveredGroup = null;
			}
		},
		moveSelection: function(event) {
			canvasToolsSupport.data.selectionTools.selectedGroups.forEach(function(selectedGroup) {
				if (!selectedGroup.associatedEntity.isAnchored()) {
					selectedGroup.associatedEntity.updateLocationByOffset(event.delta, currentUniverse);
				}
			});
			currentUniverse.refreshProbeGraphics(currentUniverse);
		},
		pan: function(event) {
			currentUniverse.translateCenterOfCanvas(currentUniverse.findUniverseCoordinatesOffset(event.delta).multiply(-1));
			currentUniverse.refreshCanvasPositions(currentUniverse);
			currentUniverse.refreshObservedUniverseData(currentUniverse);
		},
		zoom: function(event) {
			currentUniverse.setCanvasZoomExponent(currentUniverse.getCanvasZoomExponent() + event.delta.y / 100);
			currentUniverse.refreshCanvasPositions(currentUniverse);
			currentUniverse.resetObservedUniverseData(currentUniverse);
		}
	},
	keyActions: {
		selectNextOrPrevious: function(event) {
			if (canvasToolsSupport.data.selectionTools.selectedGroups.length == 0) { // there is no selection yet
				var indexOfLastSelectedGroup = 0;
				var remainingEntities = currentUniverse.getEntities().filter(function(entity) {
					return typeof(entity) !== "undefined" && entity !== null;
				});
			} else {
				var indexOfLastSelectedGroup = canvasToolsSupport.data.selectionTools.selectedGroups[canvasToolsSupport.data.selectionTools.selectedGroups.length - 1].associatedEntity.getId();
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
				canvasToolsSupport.data.selectionTools.selectedGroups.forEach(function(selectedGroup) {
					selectedGroup.associatedEntity.setUnselected();
				});
			}
			if (remainingEntities.length == 0) {
				debug.error("There is nothing in the universe to select!");
				return false;
			}
			// Choose the new selection
			if (event.key == "j") {
				canvasToolsSupport.data.selectionTools.clickedGroup = remainingEntities[0].getGroup().group;
			} else if (event.key == "k") {
				canvasToolsSupport.data.selectionTools.clickedGroup = remainingEntities[remainingEntities.length - 1].getGroup().group;
			}
			// Make the new selection
			canvasToolsSupport.data.selectionTools.selectedGroups = [canvasToolsSupport.data.selectionTools.clickedGroup];
			canvasToolsSupport.data.selectionTools.clickedGroup.associatedEntity.setSelected();
		},
		moveSelection: function(event) {
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
			canvasToolsSupport.data.selectionTools.selectedGroups.forEach(function(selectedGroup) {
				if (!selectedGroup.associatedEntity.isAnchored()) {
					selectedGroup.associatedEntity.updateLocationByOffset(offset, currentUniverse);
				}
			});
		},
		pan: function(event) {
			var increment = 40;
			// Choose an offset
			if (event.key == "up") {
				var offset = new Point(0, -1 * increment);
			} else if (event.key == "down") {
				var offset = new Point(0, increment);
			} else if (event.key == "left") {
				var offset = new Point(-1 * increment, 0);
			} else if (event.key == "right") {
				var offset = new Point(increment, 0);
			}
			canvasAnimationsSupport.pan(offset, 8, 0.1);
			currentUniverse.refreshCanvasPositions(currentUniverse);
			currentUniverse.refreshObservedUniverseData(currentUniverse);
		},
		zoom: function(event) {
			var increment = 0.2;
			if (event.key == "up" || event.key == "right" || event.key == "=") {
				var delta = increment;
			} else if (event.key == "down" || event.key == "left" || event.key == "-") {
				var delta = -1 * increment;
			}
			var targetZoom = Math.round(currentUniverse.getCanvasZoomExponent() / increment) * increment + delta;
			canvasAnimationsSupport.zoom(targetZoom, 8, 0.1);
			currentUniverse.refreshCanvasPositions(currentUniverse);
			currentUniverse.resetObservedUniverseData(currentUniverse);
		},
		scaleVectors: function(event) {
			var increment = 0.1
			if (event.key == "up" || event.key == "right" || event.key == "=" || event.key == "+") {
				var delta = increment;
			} else if (event.key == "down" || event.key == "left" || event.key == "-" || event.key == "_") {
				var delta = -1 * increment;
			}
			var targetScale = Math.round(currentUniverse.getVectorScalingExponent() / increment) * increment + delta;
			canvasAnimationsSupport.scaleVectors(targetScale, 8, 0.1);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		}
	}
}

var canvasToolsSupport = {
	data: {
		hitOptions: {
			fill: true,
			stroke: true,
			segment: true,
			tolerance: 0
		},
		selectionTools: {
			selectedGroups: new Array(),
			hoveredGroup: null,
			clickedGroup: null,
			unclickedGroup: null,
			prepareToRemoveGroup: false,
			prepareToPan: false
		}
	},
	isInClickableGroup: function(item) {
		var itemIterator = item;
		while (typeof(itemIterator) !== "undefined" && typeof(itemIterator.parent) !== "undefined" && typeof(itemIterator.isClickable) === "undefined" && !item.isClickable) {
			itemIterator = itemIterator.parent;
		}
		if (typeof(itemIterator) !== "undefined" && typeof(itemIterator.isClickable) !== "undefined") {
			return itemIterator.isClickable;
		} else {
			return false;
		}
	},
	findOverallGroupParent: function(item) {
		var itemIterator = item;
		while (typeof(itemIterator) !== "undefined" && typeof(itemIterator.parent) !== "undefined" && typeof(itemIterator.associatedEntity) === "undefined") {
			itemIterator = itemIterator.parent;
		}
		return itemIterator;
	},
	hoverFromItem: function(item) {
		this.data.selectionTools.hoveredGroup = canvasToolsSupport.findOverallGroupParent(item);
		this.data.selectionTools.hoveredGroup.associatedEntity.setHovered();
	},
	addToSelection: function(group) {
		this.data.selectionTools.selectedGroups.include(group);
		group.associatedEntity.setSelected();
	},
	removeFromSelection: function(group) {
		this.data.selectionTools.selectedGroups = this.data.selectionTools.selectedGroups.erase(group);
		group.associatedEntity.setUnselected();
	},
	clearSelection: function() {
		this.data.selectionTools.selectedGroups.forEach(function(selectedGroup) {
			selectedGroup.associatedEntity.setUnselected();
		});
		this.data.selectionTools.selectedGroups.empty();
	},
	deleteSelection: function() {
		this.data.selectionTools.selectedGroups.forEach(function(selectedGroup) {
			currentUniverse.removeEntity(selectedGroup.associatedEntity);
		});
		this.data.selectionTools.selectedGroups.empty();
		currentUniverse.refreshProbeGraphics(currentUniverse);
		currentUniverse.refreshCanvasPositions(currentUniverse);
	}
};
