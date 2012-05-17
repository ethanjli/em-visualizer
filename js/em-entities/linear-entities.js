// Models any line object in the universe
var LineEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties, universe) { // Object, Universe
		// Send up to parent
		this.parent(properties, universe);
		// Initialize line-specific properties container
		this.properties.line = new Object();
		// Handle line-specific constants
		this.getType().push("Line");
		// Handle line-specific variables
		this.properties.line.centerPoint = Vector.Zero(3);
		this.properties.line.observedUniverse = {
			outerRadius: universe.getObservedUniverseOuterRadius(universe)
		};
		this.setLine(properties.line.line);
		if (typeof(properties.line.anchor) === "undefined") {
			properties.line.anchor = new UniverseLocation({
				id: universe.getNextEntityId(),
				name: "Anchor for line " + this.getId(),
				parentEntity: this,
				point: {
					location: this.getLine().anchor
				}
			}, universe);
			universe.addEntity(properties.line.anchor);
		}
		this.properties.line.anchor = properties.line.anchor;
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		// Draw the line
		var lineSegment = new Path.Line(this.getProperties().line.centerPoint, this.getProperties().line.centerPoint);
		lineSegment.style = {
			fillColor: "black",
			strokeColor: "black",
			strokeWidth: 2
		};
		// Draw the hovered-border for the line
		var hoveredBorder = new Path.Line(this.getProperties().line.centerPoint, this.getProperties().line.centerPoint);
		hoveredBorder.style = {
			strokeWidth: 6,
			strokeColor: "gray"
		};
		hoveredBorder.strokeColor.alpha = 0.5;
		// Draw the selected-border for the line
		var selectedBorderInner = new Path.Line(this.getProperties().line.centerPoint, this.getProperties().line.centerPoint);
		selectedBorderInner.style = {
			strokeWidth: 6,
			strokeColor: "white"
		};
		selectedBorderInner.strokeColor.alpha = 0.9;
		var selectedBorderOuter = new Path.Line(this.getProperties().line.centerPoint, this.getProperties().line.centerPoint);
		selectedBorderOuter.style = {
			strokeWidth: 12,
			strokeColor: "black"
		};
		selectedBorderOuter.strokeColor.alpha = 0.5;
		// Commit graphics
		//// Add the line segment
		this.getMain().lineSegment = lineSegment;
		this.getMain().group.appendTop(lineSegment);
		//// Add the hovered border
		this.getHovered().border = hoveredBorder;
		this.getHovered().group.appendTop(hoveredBorder);
		//// Add the selected border
		this.getSelected().borderInner = selectedBorderInner;
		this.getSelected().group.appendTop(selectedBorderInner);
		this.getSelected().borderOuter = selectedBorderOuter;
		this.getSelected().group.appendBottom(selectedBorderOuter);
		this.setUntouched();
		this.refreshCanvasPosition(universe);
	},
	
	// Handles the entity's location and direction
	setLine: function(line) { // Line
		if (typeof(this.getLine()) === "undefined" || line.isParallelTo(Line.Z) && !this.getLine().isParallelTo(Line.Z) || line.liesIn(Plane.XY) && !this.getLine().liesIn(Plane.XY)) {
			// Change the graphics storage for the line
		}
		if (line.liesIn(Plane.XY)) {
			this.getProperties().line.centerPoint = line.pointClosestTo(Vector.Zero(3));
		}
		this.properties.line.line = line;
		return true; // bool
	},
	getLine: function() {
		return this.properties.line.line; // Line
	},
	// Handles the entity's anchor's location
	setLocation: function(location) { // point as Vector
		if (typeof(this.getLocation()) !== "undefined" && this.isAnchored()) {
			debug.warn("Tried to set the location of anchored entity " + this.getId());
			return false; // bool
		} else {
			// TODO: clone the location
			this.getLine().anchor = location.to3D();
			if (this.getLine().liesIn(Plane.XY)) {
				this.getProperties().line.centerPoint = this.getLine().pointClosestTo(Vector.Zero(3));
			}
			return true; // bool
		}
	},
	getLocation: function() {
		return this.getLine().anchor; // point as Vector
	},
	
	// Returns the smallest-magnitude vector from the line entity to the given location
	findVectorTo: function(location) { // point as Vector
		return location.subtract(this.getLine().pointClosestTo(location)); // vector as Vector
	},
	
	setObservedUniverseOuterRadius: function(outerRadius) { // double
		this.getProperties().line.observedUniverse.outerRadius = outerRadius;
		return true; // boolean
	},
	getObservedUniverseOuterRadius: function() {
		return this.getProperties().line.observedUniverse.outerRadius; // double
	},
	refreshCanvasPosition: function(universe) { // Universe
		if (this.getLine().liesIn(Plane.XY)) { // Lies in the plane
			var lengthFromCenterPoint = Math.sqrt(Math.pow(this.getObservedUniverseOuterRadius(), 2) - Math.pow(this.getProperties().line.centerPoint.distanceFrom(Vector.Zero(3)), 2));
			var offset = this.getLine().direction.multiply(lengthFromCenterPoint);
			var firstEndpoint = universe.findCanvasCoordinates(this.getProperties().line.centerPoint.add(offset));
			var secondEndpoint = universe.findCanvasCoordinates(this.getProperties().line.centerPoint.add(offset.multiply(-1)));
			this.getMain().lineSegment.firstSegment.point = firstEndpoint;
			this.getMain().lineSegment.lastSegment.point = secondEndpoint;
			this.getHovered().border.firstSegment.point = firstEndpoint;
			this.getHovered().border.lastSegment.point = secondEndpoint;
			this.getSelected().borderInner.firstSegment.point = firstEndpoint;
			this.getSelected().borderInner.lastSegment.point = secondEndpoint;
			this.getSelected().borderOuter.firstSegment.point = firstEndpoint;
			this.getSelected().borderOuter.lastSegment.point = secondEndpoint;
		} else if (this.getLine().isParallelTo(Line.Z)) { // Perpendicular to the plane
			
		}
		
		return true; // bool
	},
});

// Models any ray object in the universe
// TODO: determine how to store the ray: maybe as a line, with the anchor as the starting point?
var RayEntity = new Class({
	Extends: LineEntity,
	
	initialize: function(properties, universe) { // Object, Universe
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
	
	initialize: function(properties, universe) { // Object, Universe
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