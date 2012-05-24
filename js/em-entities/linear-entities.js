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
		if (typeof(properties.line.line) == "undefined") {
			if (typeof(properties.line.anchor) !== "undefined" && typeof(properties.line.direction) !== "undefined") {
				// Try to make the line from anchor and direction
				if (typeof(properties.line.anchor.getType) !== "undefined") { // anchor is a valid Entity
					var anchor = properties.line.anchor.getLocation();
				} else {
					var anchor = Vector.create(properties.line.anchor);
				}
				if (typeof(properties.line.direction.getType) !== "undefined") { // direction is a valid Entity
					var direction = properties.line.direction.getLocation().subtract(anchor);
				} else {
					var direction = Vector.create(properties.line.direction);
				}
				properties.line.line = Line.create(anchor, direction);
			} else {
				debug.error("Could not create a line for entity", this.getId());
			}
		}
		this.setLine(properties.line.line);
		if (typeof(properties.line.anchor) !== "undefined") {
			// Try to set the given anchor as the anchoring entity
			if ((typeof(properties.line.anchor) == "Array" || typeof(properties.line.anchor.create) !== "undefined") && Vector.create(properties.line.anchor).to3D().liesOn(this.getLine())) { // is a valid array for a Vector, or is a valid Vector
				// Create a new entity
				properties.line.anchor = new UniverseLocation({
					id: universe.getNextEntityId(),
					name: "Anchor for line " + this.getId(),
					parentEntity: this,
					point: {
						location: Vector.create(properties.line.anchor).to3D()
					}
				}, universe);
				universe.addEntity(properties.line.anchor);
			} else if (typeof(properties.line.anchor.getType) !== "undefined" && properties.line.anchor.getLocation().liesOn(this.getLine())) { // is a valid Entity
				// Set the entity
				properties.line.anchor.getProperties().parentEntity = this;
				if (typeof(universe.getEntity(properties.line.anchor.getId())) == "undefined") {
					universe.addEntity(properties.line.anchor);
				}
			} else {
				// Failed to set the given anchor as the anchoring entity
				debug.error("Could not set", properties.line.anchor, "as the anchor for entity", this.getId());
			}
		} else {
			// Create a new entity
			properties.line.anchor = new UniverseLocation({
				id: universe.getNextEntityId(),
				name: "Anchor for line " + this.getId(),
				parentEntity: this,
				point: {
					location: this.getLine().anchor.to3D()
				}
			}, universe);
			universe.addEntity(properties.line.anchor);
		}
		if (typeof(properties.line.direction) !== "undefined") {
			// Try to set the given direction as the secondary anchoring entity
			if ((typeof(properties.line.direction.slice) !== "undefined" || typeof(properties.line.direction.create) !== "undefined") && Vector.create(properties.line.direction).to3D().add(this.getLine().anchor).liesOn(this.getLine())) { // is a valid array for a Vector, or is a valid Vector
				// Create a new entity
				properties.line.direction = new LinearEntitySecondaryPoint({
					id: universe.getNextEntityId(),
					name: "Secondary anchor for line " + this.getId(),
					parentEntity: this,
					point: {
						location: Vector.create(properties.line.direction).to3D().add(this.getLine().anchor)
					}
				}, universe);
				universe.addEntity(properties.line.direction);
			} else if (typeof(properties.line.direction.getType) !== "undefined" && properties.line.direction.getLocation().liesOn(this.getLine())) { // is a valid Entity
				// Set the entity
				properties.line.direction.getProperties().parentEntity = this;
				if (typeof(universe.getEntity(properties.line.direction.getId())) == "undefined") {
					universe.addEntity(properties.line.direction);
				}
			} else {
				// Failed to set the given anchor as the anchoring entity
				debug.error("Could not set", properties.line.direction, "as the secondary anchor for entity", this.getId());
			}
		} else {
			// Create a new entity
			properties.line.direction = new LinearEntitySecondaryPoint({
				id: universe.getNextEntityId(),
				name: "Secondary anchor for line " + this.getId(),
				parentEntity: this,
				point: {
					location: this.getLine().direction.to3D()
				}
			}, universe);
			universe.addEntity(properties.line.direction);
		}
		
		this.setLocation(properties.line.anchor.getLocation());
		this.setAnchor(properties.line.anchor);
		this.setSecondaryAnchor(properties.line.direction);
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		// Draw the line
		var lineSegment = new Path.Line(this.getProperties().line.centerPoint, this.getProperties().line.centerPoint);
		lineSegment.style = {
			strokeWidth: 2
			strokeColor: "black",
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
		this.getAnchor().getGroup().group.insertAbove(this.getGroup().group);
		this.getSecondaryAnchor().getGroup().group.insertAbove(this.getGroup().group);
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
	setAnchor: function(anchor) { // Entity
		this.properties.line.anchor = anchor;
	},
	getAnchor: function() {
		return this.properties.line.anchor; // Entity
	},
	setSecondaryAnchor: function(anchor) { // Entity
		this.properties.line.direction = anchor;
	},
	getSecondaryAnchor: function() {
		return this.properties.line.direction; // Entity
	},
	translateLocation: function(offset) { // vector as Vector
		if (typeof(this.getLine()) !== "undefined" && this.isAnchored()) {
			debug.warn("Tried to set the location of anchored line entity " + this.getId());
			return false; // bool
		} else {
			this.getLine().translate(offset);
			this.getAnchor().translateLocation(offset);
			this.getProperties().line.direction.translateLocation(offset);
			if (this.getLine().liesIn(Plane.XY)) {
				this.getProperties().line.centerPoint = this.getLine().pointClosestTo(Vector.Zero(3));
			}
			return true;
		}
	},
	// Handles the line's anchor's location
	setLocation: function(location) { // point as Vector
		if (typeof(this.getAnchor()) !== "undefined" && (this.isAnchored() || this.getAnchor().isAnchored())) {
			debug.warn("Tried to set the location of anchored line entity " + this.getId());
			return false; // bool
		} else {
			// TODO: clone the location
			this.getLine().anchor = location.to3D();
			if (typeof(this.getProperties().line.direction) !== "undefined") {
				this.setSecondaryLocation(this.getProperties().line.direction.getLocation());
			}
			if (this.getLine().liesIn(Plane.XY)) {
				this.getProperties().line.centerPoint = this.getLine().pointClosestTo(Vector.Zero(3));
			}
			return true; // bool
		}
	},
	getLocation: function() {
		return this.getLine().anchor; // point as Vector
	},
	// Handles the line's secondary anchor's location 
	setSecondaryLocation: function(location) { // point as Vector
		if (typeof(this.getSecondaryAnchor()) !== "undefined" && (this.isAnchored() || this.getAnchor().isAnchored())) {
			debug.warn("Tried to set the secondary location of anchored line entity " + this.getId());
			return false; // bool
		} else {
			// TODO: clone the location
			this.getLine().direction = location.to3D().subtract(this.getLocation()).toUnitVector();
			if (this.getLine().liesIn(Plane.XY)) {
				this.getProperties().line.centerPoint = this.getLine().pointClosestTo(Vector.Zero(3));
			}
			return true; // bool
		}
	},
	getSecondaryLocation: function() {
		return this.getLocation().add(this.getLine().direction); // point as Vector
	},
	
	// Returns the smallest-magnitude vector from the line entity to the given location
	findVectorTo: function(location) { // point as Vector
		return location.subtract(this.getLine().pointClosestTo(location)); // vector as Vector
	},
	
	// Handles graphical display of the entity
	updateLocationByOffset: function(offset, universe) { // vector as Vector or Point
		if ("create" in offset) { // location is a Vector
			if (this.translateLocation(offset)) { // Successfully updated the location
				return true; // bool
			} else {
				return false; // bool
			}
		} else { // location is a Point
			if (this.translateLocation(universe.findUniverseCoordinatesOffset(offset))) { // Successfully updated the location
				return true; // bool
			} else {
				return false; // bool
			}
		}
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
			this.getAnchor().refreshCanvasPosition(universe);
			this.getAnchor().refreshGraphics(universe);
			this.getSecondaryAnchor().refreshCanvasPosition(universe);
			this.getSecondaryAnchor().refreshGraphics(universe);
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

// Models axes in the universe
var UniverseAxis = new Class({
	Extends: LineEntity,
	
	initialize: function(properties, universe) { // Object, Universe
		// Handle preset properties
		//var newProperties = Object.clone(properties);
		var newProperties = properties;
		newProperties.anchored = true;
		// Handle preset properties which don't clone properly with MooTools
		// Send up to parent
		this.parent(newProperties, universe);
		// Initialize axis-specific properties container
		this.properties.axis = new Object();
		// Handle axis-specific constants
		this.getType().push("Axis");
		// Handle axis-specific variables
		this.setSpacing(properties.axis.spacing);
		this.properties.axis.ticks = new Array();
		this.properties.line.observedUniverse.innerRadius = universe.getObservedUniverseInnerRadius(universe);
	},
	
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		// Hide the secondary endpoint
		this.getProperties().line.direction.getGroup().group.visible = false;
	},
	
	// Method to remove the entity
	remove: function(universe) { // Universe
		Object.values(this.getTicks()).forEach(function(tick) {
			universe.removeEntity(universe, tick);
		});
		this.parent(universe);
		return true;
	},
	
	// Handles axis tick spacing
	setSpacing: function(spacing) { // double
		this.getProperties().axis.spacing = spacing;
	},
	getSpacing: function() {
		return this.getProperties().axis.spacing; // double
	},
	// Handles axis ticks
	addTick: function(universe, location) { // Universe, double
		if (typeof(this.getTicks()[location + " " + this.getName()]) !== "undefined") { // Tick is already on the axis
			return false;
		} else {
			// Make a new tick
			var tick = new UniverseAxisTick({
				id: universe.getNextEntityId(),
				name: "Tick on " + this.getName(),
				parentEntity: this,
				anchored: true,
				point: {
					location: this.getLine().anchor.add(this.getLine().direction.multiply(location))
				}
			}, universe);
			universe.addEntity(tick);
			this.getTicks()[location + " " + this.getName()] = tick;
			return true;
		}
	},
	addNewTicks: function(universe) { // Universe
		var increment = this.getSpacing();
		if (increment == 0) {
			return false;
		}
		for (var i = Math.floor(this.getObservedUniverseInnerRadius() / increment); i < Math.ceil(this.getObservedUniverseOuterRadius() / increment); i++) {
			this.addTick(universe, i * increment);
			this.addTick(universe, -1 * i * increment);
		}
		return true;
	},
	getTicks: function() {
		return this.getProperties().axis.ticks; // Array
	},
	updateTicks: function(universe) { // Universe
		Object.values(this.getTicks()).forEach(function(tick, index) {
			if (tick.getLocation().modulus() < this.getObservedUniverseInnerRadius() || tick.getLocation().modulus() > this.getObservedUniverseOuterRadius()) { // outside the bounds of the observed universe
				delete this.getTicks()[Object.keys(this.getTicks())[index]];
				universe.removeEntity(universe, tick);
			} else if (parseFloat(tick.getLocation().modulus() / this.getSpacing()) != parseInt(tick.getLocation().modulus() / this.getSpacing())) { // not within the right tick spacing
				delete this.getTicks()[Object.keys(this.getTicks())[index]];
				universe.removeEntity(universe, tick);
			}
		}, this);
		this.addNewTicks(universe);
	},
	
	// Handles graphical display of the entity
	setObservedUniverseInnerRadius: function(innerRadius) { // double
		this.getProperties().line.observedUniverse.innerRadius = innerRadius;
		return true; // boolean
	},
	getObservedUniverseInnerRadius: function() {
		return this.getProperties().line.observedUniverse.innerRadius; // double
	},
	refreshCanvasPosition: function(universe) { // Universe
		this.parent(universe);
		this.updateTicks(universe);
		return true; // bool
	}
});
