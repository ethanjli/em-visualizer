// Definitions for all objects in the universe by shape

// Models any object, real or imaginary, in the universe that is displayed on the canvas
var Entity = new Class({
	initialize: function(properties) { // Object
		// Initialize entity-specific properties container
		this.properties = new Object();
		// Handle entity-specific constants
		this.properties.id = properties.id;
		this.properties.type = ["Object"];
		// Handle entity-specific variables
		this.setName(properties.name);
		this.setAnchored(properties.anchored);
		this.setMass(properties.mass);
		this.properties.graphics = new Object();
		this.setCanvasCoordinates(properties.graphics.canvasCoordinates);
		this.getGraphics().group = new Group();
		this.getGroup().associatedEntity = this;
		this.getGraphics().clickable = new Group();
		this.getGroup().addChild(this.getClickable());
		this.getGraphics().hovered = new Group();
		this.getGroup().addChild(this.getHovered());
		this.getHovered().insertBelow(this.getClickable());
		this.getGraphics().selected = new Group();
		this.getGroup().addChild(this.getSelected());
		this.getSelected().insertBelow(this.getClickable());
	},
	initializeGraphics: function(universe) { // Universe
		return true;
	},
	
	// Handles the entity's basic properties
	getId: function() {
		return this.properties.id; // int
	},
	getType: function() {
		return this.properties.type; // String
	},
	setName: function(name) { // String
		this.properties.name = name;
		return true; // bool
	},
	getName: function() {
		return this.properties.name; // String
	},
	
	// Method to remove the entity
	remove: function() {
		return this.getGroup().remove(); // bool
	},
	
	// Handles properties in a bulk manner
	setProperties: function(properties) { // Object
		// FIXME: figure out how to clone better without ruining vectors and points
		this.properties = Object.clone(properties);
		return true; // bool
	},
	getProperties: function() {
		return this.properties; // Object
	},
	
	// Handles whether or not the entity is mobile
	setAnchored: function(anchored) { // bool
		this.properties.anchored = anchored;
		return true; // bool
	},
	isAnchored: function() {
		return this.properties.anchored; // bool
	},
	
	// Handles the entity's mass
	setMass: function(mass) { // double
		this.properties.mass = mass;
		return true; // bool
	},
	getMass: function() {
		return this.properties.mass; // double
	},
	
	// Handles graphics
	getGraphics: function() {
		return this.properties.graphics; // Group
	},
	getGroup: function() {
		return this.getGraphics().group; // Group
	},
	getClickable: function() {
		return this.getGraphics().clickable; // Group
	},
	getHovered: function() {
		return this.getGraphics().hovered; // Group
	},
	getSelected: function() {
		return this.getGraphics().selected; // Group
	},
	setCanvasCoordinates: function(location) { // point as Point
		this.getGraphics().canvasCoordinates = location;
		return true; // boolean
	},
	getCanvasCoordinates: function() {
		return this.getGraphics().canvasCoordinates; // point as Point
	},
	translateCanvasCoordinates: function(offset) { // vector as Point
		return this.setCanvasCoordinates(this.getCanvasCoordinates().add(offset));
	},
	refreshGraphics: function() {
		return true;
	},
	refreshCanvasPosition: function() {
		return true;
	}
});

// Models any point object in the universe
var PointEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		if (typeof(newProperties.graphics) === "undefined") {
			newProperties.graphics = new Object();
		}
		newProperties.graphics.canvasCoordinates = universe.findCanvasCoordinates(properties.point.location);
		// Handle preset properties which don't clone properly with MooTools
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle point-specific constants
		this.getType().push("Point");
		// Handle point-specific properties
		this.properties.point = new Object();
		this.setLocation(properties.point.location);
	},
	initializeGraphics: function(universe) { // Object
		// Draw the point
		var point = new Path.Circle(this.getCanvasCoordinates(), 2);
		point.style = {
			fillColor: "black",
			strokeColor: "black",
			strokeWidth: 1.5
		};
		// Draw the hovered-border for the point
		var hoveredBorder = new Path.Circle(this.getCanvasCoordinates(), 5);
		hoveredBorder.style = {
			fillColor: "white",
			strokeWidth: 3,
			strokeColor: "gray"
		};
		hoveredBorder.fillColor.alpha = 0;
		hoveredBorder.strokeColor.alpha = 0.5;
		// Draw the selected-border for the point
		var selectedBorder = new Path.Circle(this.getCanvasCoordinates(), 8);
		selectedBorder.style = {
			fillColor: "white",
			strokeWidth: 3,
			strokeColor: "black"
		};
		selectedBorder.fillColor.alpha = 0.5;
		selectedBorder.strokeColor.alpha = 0.5;
		// Draw the label
		var label = new PointText(this.getCanvasCoordinates().add(new Point(5, -5)));
		label.fillColor = "black";
		label.characterStyle.font = universe.getTypeface();
		label.characterStyle.fontSize = universe.getFontSize();
		label.content = this.getName();
		// Commit graphics
		this.getGraphics().point = point;
		this.getGraphics().label = label;
		this.getGraphics().hoveredBorder = hoveredBorder;
		this.getGraphics().selectedBorder = selectedBorder;
		// Make clickable group and overall group
		this.getHovered().addChild(hoveredBorder)
		this.getSelected().addChild(selectedBorder);
		this.getClickable().addChild(point)
		this.getGroup().addChild(label);
		this.setUntouched();
	},
	
	// Handles the entity's location
	setLocation: function(location) { // point as Vector
		if (typeof(this.getLocation()) !== "undefined" && this.isAnchored()) {
			debug.warn("Tried to set the location of anchored entity " + this.getId());
			return false; // bool
		} else {
			// TODO: clone the location
			this.properties.point.location = location;
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
		return location.subtract(this.getLocation()); // vector as Vector
	},
	
	// Handles graphical display of the entity
	updateLocation: function(location, universe) { // point as Vector or Point
		if ("create" in location) { // location is a Vector
			if (this.setLocation(location)) { // Successfully updated the location
				// Determine how far to move on the canvas
				var canvasCoordinatesOffset = universe.findCanvasCoordinates(location).subtract(this.getCanvasCoordinates());
				// Translate
				this.getGroup().translate(canvasCoordinatesOffset);
				// Update the graphics
				this.refreshGraphics(universe);
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
				this.getGroup().translate(canvasCoordinatesOffset);
				// Update the graphics
				this.refreshGraphics(universe);
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
				this.getGroup().translate(canvasCoordinatesOffset);
				// Update the graphics
				this.refreshGraphics(universe);
				this.translateCanvasCoordinates(canvasCoordinatesOffset);
				return true; // bool
			} else {
				return false; // bool
			}
		} else { // location is a Point
			if (this.translateLocation(universe.findUniverseCoordinatesOffset(offset))) { // Successfully updated the location
				// Translate
				this.getGroup().translate(offset);
				// Update the graphics
				this.refreshGraphics(universe);
				this.translateCanvasCoordinates(offset);
				return true; // bool
			} else {
				return false; // bool
			}
		}
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
		this.getGroup().translate(canvasCoordinatesOffset);
		return true; // bool
	},
	
	// Handles mouse events
	setHovered: function() {
		this.getHovered().visible = true;
	},
	setUnhovered: function() {
		this.getHovered().visible = false;
	},
	setSelected: function() {
		this.getSelected().visible = true;
	},
	setUnselected: function() {
		this.getSelected().visible = false;
	},
	setUntouched: function() {
		this.setUnhovered();
		this.setUnselected();
	}
});

// Models any line object in the universe
var LineEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Initialize line-specific properties container
		this.properties.line = new Object();
		// Handle line-specific constants
		this.getType().push("Line");
		// Handle line-specific variables
		this.setLine(properties.line.line);
	},
	
	// Handles the entity's location and direction
	setLine: function(line) { // Line
		this.line.line = line;
		return true; // bool
	},
	getLine: function() {
		return this.line.line; // Line
	},
	
	// Returns the smallest-magnitude vector from the line entity to the given location
	findVectorTo: function(location) {
		return location.subtract(this.getLine().pointClosestTo(location)); // vector as Vector
	}
});

// Models any ray object in the universe
// TODO: determine how to store the ray: maybe as a line, with the anchor as the starting point?
var RayEntity = new Class({
	Extends: LineEntity,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Initialize ray-specific properties container
		this.properties.ray = new Object();
		// Handle ray-specific constants
		this.getType().push("Ray");
		// Handle ray-specific variables
		this.setRay(properties.ray.ray);
	}
});

// Models any line segment object in the universe
// TODO: determine how to store the line segment; maybe as a line, with the anchor and dir vector as the endpoints?
var LineSegmentEntity = new Class({
	Extends: LineEntity,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Initialize line-segment-specific properties container
		this.properties.lineSegment = new Object();
		// Handle line-segment-specific constants
		this.getType().push("Segment");
		// Handle line-segment-specific variables
		this.setLineSegment(properties.lineSegment.lineSegment);
	}
});

// Models any solid object in the universe
// TODO: determine how to store the solid object
var SolidEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Initialize solid-specific properties container
		this.properties.solid = new Object();
		// Handle solid-specific constants
		this.getType().push("Solid");
		// Handle line-segment-specific constants
		this.setSolid(properties.solid.solid);
	}
});

// Models a location probe in the universe
var UniverseLocation = new Class({
	Extends: PointEntity,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.mass = 0;
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
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
		this.getGraphics().label.content = "(" + parseFloat(this.getLocation().e(1).toPrecision(decimalEpsilonPrecision)) + "m," + parseFloat(this.getLocation().e(2).toPrecision(decimalEpsilonPrecision)) + "m)";
		return true; // bool
	},
});

// Models the (0,0) anchor in the universe
var UniverseAnchorPoint = new Class({
	Extends: UniverseLocation,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.name = "Center of the Universe";
		newProperties.anchored = true;
		if (typeof(newProperties.point) === "undefined") {
			newProperties.point = new Object();
		}
		newProperties.point.location = Vector.create([0,0]);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle universe-anchor-point-specific constants
		this.getType().push("Universe Anchor Point");
		// Handle universe-anchor-point-specific properties
	}
});

// TODO: add object for measuring distances