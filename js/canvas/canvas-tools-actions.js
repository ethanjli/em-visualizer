var canvasToolsActions = {
	mouseActions: {
		hover: function(event) {
			var hitResult = project.hitTest(event.point, hitOptions);
			
			if (hitResult && hitResult.item.parent) { // Hit a group!
				if (selectionToolsData.hoveredGroup != null && selectionToolsData.hoveredGroup != hitResult.item.parent.parent) { // Moved from a group onto a different one
					selectionToolsData.hoveredGroup.associatedEntity.setUnhovered();
					selectionToolsData.hoveredGroup = hitResult.item.parent.parent;
					selectionToolsData.hoveredGroup.associatedEntity.setHovered();
				} else if (selectionToolsData.hoveredGroup == null) { // Move from blank canvas onto a group
					selectionToolsData.hoveredGroup = hitResult.item.parent.parent;
					selectionToolsData.hoveredGroup.associatedEntity.setHovered();
				}
			} else if (selectionToolsData.hoveredGroup != null) { // Moved from a group and onto blank canvas
				selectionToolsData.hoveredGroup.associatedEntity.setUnhovered();
				selectionToolsData.hoveredGroup = null;
			}
		},
		moveSelection: function(event) {
			selectionToolsData.selectedGroups.forEach(function(selectedGroup) {
				if (!selectedGroup.associatedEntity.isAnchored()) {
					selectedGroup.associatedEntity.updateLocationByOffset(event.delta, currentUniverse);
				}
			});
			currentUniverse.refreshProbeGraphics(currentUniverse);
		},
		pan: function(event) {
			currentUniverse.translateCenterOfCanvas(currentUniverse.findUniverseCoordinatesOffset(event.delta).multiply(-1));
			currentUniverse.refreshCanvasPositions(currentUniverse);
		},
		zoom: function(event) {
			currentUniverse.setCanvasZoomExponent(currentUniverse.getCanvasZoomExponent() + event.delta.y / 100);
			currentUniverse.refreshCanvasPositions(currentUniverse);
		}
	},
	keyActions: {
		selectNextOrPrevious: function(event) {
			if (selectionToolsData.selectedGroups.length == 0) { // there is no selection yet
				var indexOfLastSelectedGroup = 0;
				var remainingEntities = currentUniverse.getEntities().filter(function(entity) {
					return typeof(entity) !== "undefined" && entity !== null;
				});
			} else {
				var indexOfLastSelectedGroup = selectionToolsData.selectedGroups[selectionToolsData.selectedGroups.length - 1].associatedEntity.getId();
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
				selectionToolsData.selectedGroups.forEach(function(selectedGroup) {
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
			selectionToolsData.selectedGroups = [selectionToolsData.clickedGroup];
			selectionToolsData.clickedGroup.associatedEntity.setSelected();
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
			selectionToolsData.selectedGroups.forEach(function(selectedGroup) {
				if (!selectedGroup.associatedEntity.isAnchored()) {
					selectedGroup.associatedEntity.updateLocationByOffset(offset, currentUniverse);
				}
			});
		},
		pan: function(event) {
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
			currentUniverse.refreshCanvasPositions(currentUniverse);
		},
		zoom: function(event) {
			if (event.key == "up" || event.key == "right" || event.key == "=") {
				var delta = 0.2;
			} else if (event.key == "down" || event.key == "left" || event.key == "-") {
				var delta = -0.2;
			}
			currentUniverse.setCanvasZoomExponent(currentUniverse.getCanvasZoomExponent() + delta);
			currentUniverse.refreshCanvasPositions(currentUniverse);
		},
		scaleVectors: function(event) {
			debug.debug("yay");
			if (event.key == "up" || event.key == "right" || event.key == "=" || event.key == "+") {
				var delta = 0.1;
			} else if (event.key == "down" || event.key == "left" || event.key == "-" || event.key == "_") {
				var delta = -0.1;
			}
			currentUniverse.setVectorScalingExponent(currentUniverse.getVectorScalingExponent() + delta);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		}
	},
	tools: {
		addToSelection: function(group) {
			selectionToolsData.selectedGroups.include(group);
			group.associatedEntity.setSelected();
		},
		removeFromSelection: function(group) {
			selectionToolsData.selectedGroups = selectionToolsData.selectedGroups.erase(group);
			group.associatedEntity.setUnselected();
		},
		clearSelection: function() {
			selectionToolsData.selectedGroups.forEach(function(selectedGroup) {
				selectedGroup.associatedEntity.setUnselected();
			});
			selectionToolsData.selectedGroups.empty();
		},
		deleteSelection: function() {
			selectionToolsData.selectedGroups.forEach(function(selectedGroup) {
				currentUniverse.removeEntity(selectedGroup.associatedEntity);
			});
			selectionToolsData.selectedGroups.empty();
			currentUniverse.refreshProbeGraphics(currentUniverse);
			currentUniverse.refreshCanvasPositions(currentUniverse);
		}
	},
}