// Definitions for all objects in the universe by shape

// Models any object in the universe
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
		this.properties.graphics.clickable = new Group();
		this.properties.graphics.group = new Group();
	},
	
	// Handles the entity's basic properties
	getId: function() {
		return this.properties.id; // int
	},
	getType: function() {
		return this.properties.type; // String
	},
	
	// Handles the entity's name
	setName: function(name) { // String
		this.properties.name = name;
		return true; // bool
	},
	getName: function() {
		return this.properties.name; // String
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
	
	// Handles properties in a bulk way
	setProperties: function(properties) { // Object
		this.properties = Object.clone(properties);
		return true; // bool
	},
	getProperties: function() {
		return this.properties; // Object
	},
	
	// Handles graphics
	getClickable: function() {
		return this.properties.graphics.clickable; // group as Group
	},
	getGraphics: function() {
		return this.properties.graphics.clickable; // group as Group
	}
});

// Models any point object in the universe
var PointEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties) { // Object
		// Send up to parent
		this.parent(properties);
		// Initialize point-specific properties container
		this.properties.point = new Object();
		// Handle point-specific constants
		this.properties.type.push("Point");
		// Handle point-specific variables
		this.setLocation(properties.point.location);
		// Initialize graphics
		//// Draw the point
		debug.debug("Drawing new point at", properties.graphics.canvasCoordinates);
		var point = new Path.Circle(properties.graphics.canvasCoordinates, 2);
		point.style = {
			fillColor: "black"
		};
		//// Commit graphics
		this.properties.graphics.point = point;
		//// Make clickable group and overall group
		this.properties.graphics.clickable.addChild(point);
		this.properties.graphics.group.addChild(point);
		debug.debug("Finished initialization of point graphics", this.properties.graphics);
	},
	
	// Handles the entity's location
	setLocation: function(location) { // point as Vector
		if (typeof(this.getLocation()) !== 'undefined' && this.isAnchored()) {
			debug.warn("Tried to set the location of anchored entity " + this.getId());
			return false; // bool
		} else {
			// TODO: clone the location
			this.properties.point.location = location;
			debug.debug("Successfully set the location of anchored entity " + this.getId(), this.getLocation());
			return true; // bool
		}
	},
	getLocation: function() {
		return this.properties.point.location; // point as Vector
	},

	// Returns a vector from the location of the point entity to the given location
	findVectorTo: function(location) { // point as Vector
		return location.subtract(this.getLocation()); // vector as Vector
	},
	
	// Handles graphical display of the universe location
	updateLocation: function(location, canvasCoordinates) { // point as Vector, point as Point
		if (this.setLocation(location)) {
			// Determine how far to move
			var offset = canvasCoordinates.subtract(this.properties.graphics.point.position);
			// Translate
			this.properties.graphics.group.translate(offset);
			// Update label
			this.properties.graphics.label.content = "(" + this.getLocation().e(1) + "m," + this.getLocation().e(2) + "m)";
			// Update canvasCoordinates property
			this.properties.graphics.canvasCoordinates = canvasCoordinates;
			return true; // bool
		} else {
			return false; // bool
		}
	},
	updateLocationByOffset: function(locationOffset, canvasCoordinateOffset) { // vector as Vector, vector as Point
		if (this.setLocation(location.add(locationOffset))) {
			// Translate
			this.properties.graphics.group.translate(canvasCoordinateOffset);
			// Update label
			this.properties.graphics.label.content = "(" + this.getLocation().e(1) + "m," + this.getLocation().e(2) + "m)";
			// Update canvasCoordinates property
			this.properties.graphics.canvasCoordinates = canvasCoordinates;
			return true; // bool
		} else {
			return false; // bool
		}
	}
});

// Models any line object in the universe
var LineEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties) { // Object
		// Send up to parent
		this.parent(properties);
		// Initialize line-specific properties container
		this.properties.line = new Object();
		// Handle line-specific constants
		this.properties.type.push("Line");
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
	
	initialize: function(properties) { // Object
		// Send up to parent
		this.parent(properties);
		// Initialize ray-specific properties container
		this.properties.ray = new Object();
		// Handle ray-specific constants
		this.properties.type.push("Ray");
		// Handle ray-specific variables
		this.setRay(properties.ray.ray);
	}
});

// Models any line segment object in the universe
// TODO: determine how to store the line segment; maybe as a line, with the anchor and dir vector as the endpoints?
var LineSegmentEntity = new Class({
	Extends: LineEntity,
	
	initialize: function(properties) { // Object
		// Send up to parent
		this.parent(properties);
		// Initialize line-segment-specific properties container
		this.properties.lineSegment = new Object();
		// Handle line-segment-specific constants
		this.properties.type.push("Segment");
		// Handle line-segment-specific variables
		this.setLineSegment(properties.lineSegment.lineSegment);
	}
});

// Models any solid object in the universe
// TODO: determine how to store the solid object
var SolidEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties) { // Object
		// Send up to parent
		this.parent(properties);
		// Initialize solid-specific properties container
		this.properties.solid = new Object();
		// Handle solid-specific constants
		this.properties.type.push("Solid");
		// Handle line-segment-specific constants
		this.setSolid(properties.solid.solid);
	}
});

// Models a location probe in the universe
var UniverseLocation = new Class({
	Extends: PointEntity,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.mass = 0;
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		newProperties.graphics.canvasCoordinates = new Point(properties.graphics.canvasCoordinates);
		//debug.debug("Finished preset for universe location", newProperties);
		// Send up to parent
		this.parent(newProperties);
		// Handle universe-location-specific constants
		this.properties.type.push("Universe Location");
		// Handle universe-location-specific properties
		// Initialize graphics
		//// Draw the label
		var label = new PointText(newProperties.graphics.canvasCoordinates.add(new Point(2, -2)));
		label.fillColor = "black";
		label.content = "(" + this.getLocation().e(1) + "m," + this.getLocation().e(2) + "m)";
		//// Commit graphics
		this.properties.graphics.label = label;
		//// Update clickable group and overall group
		this.properties.graphics.group.addChild(label);
		debug.debug("Finished initialization of universe-location graphics", this.properties.graphics);
	},
	
	// Handles graphical display of the universe location
	updateLocation: function(location, canvasCoordinates) { // point as Vector, point as Point
		if (this.setLocation(location)) {
			// Determine how far to move
			var offset = canvasCoordinates.subtract(this.properties.graphics.point.position);
			// Translate
			this.properties.graphics.group.translate(offset);
			// Update label
			this.properties.graphics.label.content = "(" + this.getLocation().e(1) + "m," + this.getLocation().e(2) + "m)";
			// Update canvasCoordinates property
			this.properties.graphics.canvasCoordinates = canvasCoordinates;
			return true; // bool
		} else {
			return false; // bool
		}
	},
	updateLocationByOffset: function(locationOffset, canvasCoordinateOffset) { // vector as Vector, vector as Point
		if (this.setLocation(location.add(locationOffset))) {
			// Translate
			this.properties.graphics.group.translate(canvasCoordinateOffset);
			// Update label
			this.properties.graphics.label.content = "(" + this.getLocation().e(1) + "m," + this.getLocation().e(2) + "m)";
			// Update canvasCoordinates property
			this.properties.graphics.canvasCoordinates = canvasCoordinates;
			return true; // bool
		} else {
			return false; // bool
		}
	}
});

// Models the (0,0) anchor in the universe
var UniverseAnchorPoint = new Class({
	Extends: UniverseLocation,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.name = "Center of the Universe";
		newProperties.anchored = true;
		newProperties.point = new Object();
		newProperties.point.location = Vector.create([0,0]);
		//debug.debug("Finished preset for universe anchor point", newProperties);
		// Send up to parent
		this.parent(newProperties);
		// Handle universe-anchor-point-specific constants
		this.properties.type.push("Universe Anchor Point");
		// Handle universe-anchor-point-specific properties
	}
});

// TODO: add object for measuring distances