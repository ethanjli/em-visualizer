// Models any point object in the universe
var PointEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties, universe) { // Object, Universe
		// Handle preset properties
		//var newProperties = Object.clone(properties);
		var newProperties = properties;
		if (typeof(newProperties.graphics) === "undefined") {
			newProperties.graphics = new Object();
		}
		newProperties.graphics.canvasCoordinates = universe.findCanvasCoordinates(properties.point.location.to3D());
		// Handle preset properties which don't clone properly with MooTools
		// Send up to parent
		this.parent(newProperties, universe);
		// Initialize point-specific properties container
		this.properties.point = new Object();
		// Handle point-specific constants
		this.getType().push("Point");
		// Handle point-specific properties
		this.setLocation(properties.point.location);
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		// Set up storage
		this.getGroup().labels = {
			group: new Group(),
			mainLabel: {
				group: new Group()
			}
		};
		this.getGroup().group.appendBottom(this.getLabels().group);
		this.getLabels().group.appendTop(this.getMainLabel().group);
		// Draw the point
		var point = new Path.Circle(this.getCanvasCoordinates(), 2);
		point.style = {
			fillColor: "black",
			strokeColor: "black",
			strokeWidth: 1.5
		};
		// Draw the label
		var label = new PointText(this.getCanvasCoordinates().add(new Point(5, -5)));
		label.fillColor = "black";
		label.characterStyle.font = universe.getTypeface();
		label.characterStyle.fontSize = universe.getFontSize();
		label.content = this.getName();
		// Commit graphics
		//// Add the point
		this.getMain().point = point;
		this.getMain().group.addChild(point);
		//// Add the label
		this.getMainLabel().text = label;
		this.getMainLabel().group.appendTop(label);
		this.setUntouched();
	},
	
	// Handles the entity's location
	setLocation: function(location) { // point as Vector
		if (typeof(this.getLocation()) !== "undefined" && this.isAnchored()) {
			debug.warn("Tried to set the location of anchored point entity " + this.getId());
			return false; // bool
		} else {
			// TODO: clone the location
			this.properties.point.location = location.to3D();
			if (typeof(this.getProperties().parentEntity) !== "undefined" && !this.getProperties().parentEntity.isAnchored()) {
				this.getProperties().parentEntity.setLocation(location);
			}
			return true; // bool
		}
	},
	getLocation: function() {
		return this.properties.point.location; // point as Vector
	},
	translateLocation: function(offset) { // vector as Vector
		return this.setLocation(this.getLocation().add(offset)); // bool
	},

	// Returns a vector from the location of the point entity to the given location
	findVectorTo: function(location) { // point as Vector
		return location.to3D().subtract(this.getLocation()); // vector as Vector
	},
	
	// Handles graphical display of the entity
	updateLocation: function(location, universe) { // point as Vector or Point
		if ("create" in location) { // location is a Vector
			if (this.setLocation(location)) { // Successfully updated the location
				// Determine how far to move on the canvas
				var canvasCoordinatesOffset = universe.findCanvasCoordinates(location).subtract(this.getCanvasCoordinates());
				// Translate
				this.getGroup().group.translate(canvasCoordinatesOffset);
				// Update the graphics
				this.setCanvasCoordinates(canvasCoordinates);
				return true; // bool
			} else {
				return false; // bool
			}
		} else { // location is a Point
			if (this.setLocation(universe.findUniverseCoordinates(location))) { // Successfully updated the location
				// Determine how far to move on the canvas
				var canvasCoordinatesOffset = location.subtract(this.getCanvasCoordinates());
				// Translate
				this.getGroup().group.translate(canvasCoordinatesOffset);
				// Update the graphics
				this.setCanvasCoordinates(location);
				return true; // bool
			} else {
				return false; // bool
			}
		}
	},
	updateLocationByOffset: function(offset, universe) { // vector as Vector or Point
		if ("create" in offset) { // location is a Vector
			if (this.translateLocation(offset)) { // Successfully updated the location
				// Determine how far to move on the canvas
				var canvasCoordinatesOffset = universe.findCanvasCoordinatesOffset(offset);
				// Translate
				this.getGroup().group.translate(canvasCoordinatesOffset);
				// Update the graphics
				this.translateCanvasCoordinates(canvasCoordinatesOffset);
				return true; // bool
			} else {
				return false; // bool
			}
		} else { // location is a Point
			if (this.translateLocation(universe.findUniverseCoordinatesOffset(offset))) { // Successfully updated the location
				// Translate
				this.getGroup().group.translate(offset);
				// Update the graphics
				this.translateCanvasCoordinates(offset);
				return true; // bool
			} else {
				return false; // bool
			}
		}
	},
	getLabels: function() {
		return this.getGroup().labels; // Object
	},
	getMainLabel: function() {
		return this.getLabels().mainLabel; // Object
	},
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = this.getName();
		return true; // bool
	},
	refreshCanvasPosition: function(universe) { // Universe
		// Determine how far to move on the canvas
		var canvasCoordinatesOffset = universe.findCanvasCoordinates(this.getLocation()).subtract(this.getCanvasCoordinates());
		this.setCanvasCoordinates(universe.findCanvasCoordinates(this.getLocation()));
		// Translate
		this.getGroup().group.translate(canvasCoordinatesOffset);
		return true; // bool
	},
	
	// Handles mouse events
	setHovered: function() {
		// Draw the hovered-border for the point
		var hoveredBorder = new Path.Circle(this.getCanvasCoordinates(), 5);
		hoveredBorder.style = {
			fillColor: "white",
			strokeWidth: 3,
			strokeColor: "gray"
		};
		hoveredBorder.fillColor.alpha = 0;
		hoveredBorder.strokeColor.alpha = 0.5;
		// Commit graphics
		this.getHovered().border = hoveredBorder;
		this.getHovered().group.appendTop(hoveredBorder);
	},
	setUnhovered: function() {
		if (typeof(this.getHovered().border) !== "undefined") {
			this.getHovered().border.remove();
		}
	},
	setSelected: function() {
		// Draw the selected-border for the point
		var selectedBorder = new Path.Circle(this.getCanvasCoordinates(), 8);
		selectedBorder.style = {
			fillColor: "white",
			strokeWidth: 3,
			strokeColor: "black"
		};
		selectedBorder.fillColor.alpha = 0.5;
		selectedBorder.strokeColor.alpha = 0.5;
		// Commit graphics
		this.getSelected().border = selectedBorder;
		this.getSelected().group.appendTop(selectedBorder);
	},
	setUnselected: function() {
		if (typeof(this.getSelected().border) !== "undefined") {
			this.getSelected().border.remove();
		}
	}
});

// Models a location probe in the universe
var UniverseLocation = new Class({
	Extends: PointEntity,
	
	initialize: function(properties, universe) { // Object, Universe
		// Handle preset properties
		//var newProperties = Object.clone(properties);
		var newProperties = properties;
		newProperties.mass = 0;
		// Handle preset properties which don't clone properly with MooTools
		//newProperties.point.location = properties.point.location.dup();
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle universe-location-specific constants
		this.getType().push("Universe Location");
		// Handle universe-location-specific properties
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		this.refreshGraphics(universe);
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		var decimalEpsilonPrecision = universe.getDecimalEpsilonPrecision();
		var coordinates = this.getLocation().elements.map(function(coordinate) {
			var rounded = parseFloat(coordinate.toPrecision(decimalEpsilonPrecision));
			if (Math.abs(rounded) < universe.getLocationPrecision()) {
				return 0;
			} else {
				return rounded;
			}
		});
		this.getMainLabel().text.content = "(" + coordinates[0] + "m," + coordinates[1] + "m)";
		return true; // bool
	}
});

// Models the (0,0) anchor in the universe
var UniverseAnchorPoint = new Class({
	Extends: UniverseLocation,
	
	initialize: function(properties, universe) { // Object, Universe
		// Handle preset properties
		//var newProperties = Object.clone(properties);
		var newProperties = properties;
		newProperties.name = "Center of the Universe";
		newProperties.anchored = true;
		if (typeof(newProperties.point) === "undefined") {
			newProperties.point = new Object();
		}
		newProperties.point.location = Vector.Zero(3);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle universe-anchor-point-specific constants
		this.getType().push("Universe Anchor Point");
		// Handle universe-anchor-point-specific properties
	}
});

// Models support points used to give direction to lines and rays 
var LinearEntitySecondaryPoint = new Class({
	Extends: UniverseLocation,
	
	initialize: function(properties, universe) { // Object, Universe
		// Send up to parent
		this.parent(properties, universe);
		// Handle universe-anchor-point-specific constants
		this.getType().push("Secondary Anchor Point for Linear Entities");
	},
	
	// Handles the entity's location
	setLocation: function(location) { // point as Vector
		if (typeof(this.getLocation()) !== "undefined" && this.isAnchored()) {
			debug.warn("Tried to set the location of anchored entity " + this.getId());
			return false; // bool
		} else {
			// TODO: clone the location
			this.properties.point.location = location.to3D();
			if (typeof(this.getProperties().parentEntity) !== "undefined") {
				this.getProperties().parentEntity.setSecondaryLocation(location);
			}
			return true; // bool
		}
	},
});

var UniverseAxisTick = new Class({
	Extends: UniverseLocation,
	
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		// Modify text label
		this.getMainLabel().text.position = this.getCanvasCoordinates().add(new Point(10, 0));
		this.getMainLabel().text.paragraphStyle.justification = 'right';
		this.getMainLabel().text.rotate(-30, this.getCanvasCoordinates());
		// Make unclickable
		this.getClickable().group.isClickable = false;
		this.getHovered().group.remove();
		this.getSelected().group.remove();
		// Move to bottom of canvas
		this.getGroup().group.insertBelow(this.getProperties().parentEntity.getGroup().group);
	},
	
	// Method to remove the entity
	remove: function(universe) { // Universe
		delete this.properties.id;
		return this.getGroup().group.remove(); // bool
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		var decimalEpsilonPrecision = universe.getDecimalEpsilonPrecision();
		if (parseFloat(this.getLocation().e(1).toPrecision(decimalEpsilonPrecision)) != 0) { // x-axis is nonzero
			this.getMainLabel().text.content = parseFloat(this.getLocation().e(1).toPrecision(decimalEpsilonPrecision)) + "m";
		} else if (parseFloat(this.getLocation().e(2).toPrecision(decimalEpsilonPrecision))) { // y-axis is nonzero
			this.getMainLabel().text.content = parseFloat(this.getLocation().e(2).toPrecision(decimalEpsilonPrecision)) + "m";
		} else { // is at origin
			this.getMainLabel().text.content = "";
		}
		return true; // bool
	},
});
