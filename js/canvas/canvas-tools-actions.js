var canvasToolsActions = {
	hover: function(event) {
		var hitResult = project.hitTest(event.point, hitOptions);
		
		if (hitResult && hitResult.item.parent) { // Hit a group!
			if (selectionToolsData.hoveredGroup != null && selectionToolsData.hoveredGroup != hitResult.item.parent.parent) { // Moved from a group onto a different one
				debug.info("moved from one group onto another");
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
	},
	deleteSelection: function(event) {
		selectedGroups.forEach(function(selectedGroup) {
			currentUniverse.removeEntity(selectedGroup.associatedEntity);
			currentUniverse.refreshProbeGraphics(currentUniverse);
		});
		selectedGroups.empty();
	}
}
