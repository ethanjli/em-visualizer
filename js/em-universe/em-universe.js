var Universe = new Class({
	initialize: function(properties) {
		// Initialize universe-specific properties container
		this.properties = new Object();
		// Handle universe-specific constants
		this.properties.id = properties.id;
		this.properties.type = "Universe";
		// Handle universe-specific variables
		this.setName(properties.name);
		// Handle physical constant variables
		this.properties.physicalConstants = new Object();
		this.setVacuumPermittivity(properties.physicalConstants.vacuumPermittivity);
		this.setVacuumPermeability(properties.physicalConstants.vacuumPermeability);
		//// Handle entities
		this.properties.entities = new Object();
		this.properties.entities.entityIdCounter = 0;
		this.properties.entities.entities = new Array();
		//// Handle graphical display
		this.properties.graphics = new Object();
		this.setCenterOfCanvas(properties.graphics.locationOfCenterOfCanvas);
		this.setCanvasZoomExponent(properties.graphics.canvasZoom);
		this.setVectorScalingExponent(properties.graphics.vectorScaling);
		//// Handle text display
		this.properties.text = new Object();
		this.setTypeface(properties.text.typeface);
		this.setFontSize(properties.text.fontSize);
		this.setDecimalPrecision(properties.text.decimalPrecision);
		this.setDecimalEpsilonPrecision(properties.text.decimalEpsilonPrecision);
		//// Populate the universe with initial entities
		////// Add the (0,0) anchor point
		this.addEntity(new UniverseAnchorPoint({
			id: this.getNextEntityId()
		}, this));
		////// Put all the other entities in if the entity list is not undefined
		if (typeof(properties.entities) !== "undefined" && typeof(properties.entities.entities) !== "undefined" && properties.entities.entities.length != 0) {
			this.setEntities(properties.entities.entities);
		} 
	},
	
	getId: function() {
		return this.properties.id; // int
	},
	getType: function() {
		return this.properties.type; // String
	},
	
	// Handles the universe's name
	setName: function(name) { // String
		this.properties.name = name;
		return true; // bool
	},
	getName: function() {
		return this.properties.name; // String
	},
	
	// Handles the universe's ε_0
	setVacuumPermittivity: function(vacuumPermittivity) { // double
		this.properties.physicalConstants.vacuumPermittivity = vacuumPermittivity;
		return true; // bool
	},
	getVacuumPermittivity: function() {
		return this.properties.physicalConstants.vacuumPermittivity; // double
	},
	
	// Handles the universe's μ_0
	setVacuumPermeability: function(vacuumPermeability) { // double
		this.properties.physicalConstants.vacuumPermeability = vacuumPermeability;
		return true; // bool
	},
	getVacuumPermeability: function() {
		return this.properties.physicalConstants.vacuumPermeability; // double
	},
	
	// Provides a counter to be used for setting the id of the next entity made in the universe
	getNextEntityId: function() {
		debug.debug("The next entity will have id", this.properties.entities.entityIdCounter + 1);
		return this.properties.entities.entityIdCounter++; // int
	},
	
	// Handles the universe's list of entities
	setEntities: function(entities) { // Entity[]
		// FIXME: this should deep copy the entities without messing up the locations. Maybe add a clone method to each entity?
		this.properties.entities.entities = entities;
		return true; // bool
	},
	getEntities: function() {
		return this.properties.entities.entities; // Entity[]
	},
	getProbeEntities: function() {
		return this.properties.entities.entities.filter(function(entity) {
			return typeof(entity.measure) !== "undefined";
		}); // Entity[]
	},
	getObservedUniverseEntities: function() {
		return this.properties.entities.entities.filter(function(entity) {
			return typeof(entity.getObservedUniverseOuterRadius) !== "undefined";
		}); // Entity[]
	},
	getCompositeEntities: function() {
		return this.properties.entities.entities.filter(function(entity) {
			return typeof(entity.getProperties().parentEntity) !== "undefined";
		}).map(function(entity) {
			return entity.getProperties().parentEntity;
		}); // Entity[]
	},
	addEntity: function(entity) { // Entity
		this.properties.entities.entities[entity.getId()] = entity;
		entity.initializeGraphics(this);
		this.refreshProbeGraphics(this);
		return true; // bool
	},
	getEntity: function(id) { // int
		return this.properties.entities.entities[id]; // Entity
	},
	removeEntity: function(universe, entity) { // Universe, Entity
		delete this.properties.entities.entities[entity.getId()];
		entity.remove(universe);
		return entity; // Entity
	},
	removeEntityById: function(universe, id) { // Universe, int
		var entity = this.getEntity(id);
		delete this.properties.entities.entities[id];
		entity.remove(universe);
		return entity; // Entity
	},
	// TODO: add method to compress the entity list and entity ids by filling empty spots
	
	// Calculates the electric field in the universe at a given spot by superpositioning
	findElectricFieldAt: function(location) { // point as Vector
		var vacuumPermittivity = this.getVacuumPermittivity();
		return this.properties.entities.entities.reduce(function(totalElectricField, currentEntity) { // vector as Vector, Entity
			if (typeof(currentEntity.findElectricFieldAt) !== "undefined") {
				return totalElectricField.add(currentEntity.findElectricFieldAt(location, vacuumPermittivity)); // vector as Vector
			} else {
				return totalElectricField;
			}
		}, Vector.Zero(3));
	},
	// Calculates the electric potential in the universe at a given spot by superpositioning
	findElectricPotentialAt: function(location) { // point as Vector
		var vacuumPermittivity = this.getVacuumPermittivity();
		return this.properties.entities.entities.reduce(function(totalElectricPotential, currentEntity, index, array) { // double // double, Entity, int, Entity[] // double
			if (typeof(currentEntity.findElectricPotentialAt) !== "undefined") {
				return totalElectricPotential + currentEntity.findElectricPotentialAt(location, vacuumPermittivity); // double
			} else {
				return totalElectricPotential;
			}
		}, 0);
	},
	
	// Determines the outer and inner radii of the observed universe as determined by the location of the canvas view
	getObservedUniverseOuterRadius: function(universe) { // Universe
		var corners = [view.bounds.topLeft, view.bounds.topRight, view.bounds.bottomRight, view.bounds.bottomLeft];
		var maxRadius = corners.map(function(corner) {
			return universe.findUniverseCoordinates(corner).modulus();
		}).reduce(function(previousValue, currentValue) {
			return Math.max(previousValue, currentValue);
		});
		return maxRadius;
	},
	getObservedUniverseInnerRadius: function(universe) { // Universe
		var origin = this.findCanvasCoordinates(Vector.Zero(3));
		if (view.bounds.contains(origin)) { // both axes are in view
			return 0;
		} else if (view.bounds.bottom > origin.y && origin.y > view.bounds.top) { // x axis is in view
			if (origin.x < view.bounds.left) { // view is to the right of the y axis
				return (view.bounds.left - origin.x) / this.getCanvasZoom();
			} else {
				return (origin.x - view.bounds.right) / this.getCanvasZoom();
			}
		} else if (view.bounds.left < origin.x && origin.x < view.bounds.right) { // y axis is in view
			if (origin.y < view.bounds.bottom) { // view is above the x axis
				return (view.bounds.top - origin.y) / this.getCanvasZoom();
			} else {
				return (origin.y - view.bounds.bottom) / this.getCanvasZoom();
			}
		} else {
			var corners = [view.bounds.topLeft, view.bounds.topRight, view.bounds.bottomRight, view.bounds.bottomLeft];
			var minRadius = corners.map(function(corner) {
				return universe.findUniverseCoordinates(corner).modulus();
			}).reduce(function(previousValue, currentValue) {
				return Math.min(previousValue, currentValue);
			});
			return minRadius;
		}
	},
	
	// Handles the location in the universe where the center of the canvas is
	setCenterOfCanvas: function(location) { // point as Vector
		this.properties.graphics.locationOfCenterOfCanvas = location.dup().to3D();
		return true; // bool
	},
	getCenterOfCanvas: function() {
		return this.properties.graphics.locationOfCenterOfCanvas; // point as Vector
	},
	translateCenterOfCanvas: function(offset) { // vector as Vector
		return this.setCenterOfCanvas(this.getCenterOfCanvas().add(offset)); // bool
	},
	
	// Handles the zoom of the canvas
	setCanvasZoomExponent: function(zoom) { // double
		if (zoom > 6) {
			zoom = 6;
		}
		if (zoom < -6) {
			zoom = -6;
		}
		this.properties.graphics.canvasZoom = zoom;
		return true; // bool
	},
	getCanvasZoomExponent: function() {
		return this.properties.graphics.canvasZoom; // double
	},
	getCanvasZoom: function() {
		return Math.pow(10, this.getCanvasZoomExponent()); // double
	},
	
	// Handles the scaling of vectors in the canvas
	setVectorScalingExponent: function(vectorScaling) { // double
		this.properties.graphics.vectorScaling = vectorScaling;
	},
	getVectorScalingExponent: function() { // double
		return this.properties.graphics.vectorScaling
	},
	getVectorScaling: function() {
		return Math.pow(10, this.getVectorScalingExponent()); // double
	},
	
	// Refreshes the graphics for entities
	refreshCanvasPositions: function(universe) { // Universe
		this.getEntities().forEach(function(entity) {
			entity.refreshCanvasPosition(universe);
		});
	},
	refreshProbeGraphics: function(universe) { // Universe
		this.getProbeEntities().forEach(function(entity) {
			entity.refreshGraphics(universe);
		});
	},
	refreshObservedUniverseData: function(universe) { // Universe
		this.getObservedUniverseEntities().forEach(function(entity) {
			if (typeof(entity.setObservedUniverseOuterRadius) !== "undefined") {
				entity.setObservedUniverseOuterRadius(Math.max(entity.getObservedUniverseOuterRadius(), universe.getObservedUniverseOuterRadius(universe)));
			}
			if (typeof(entity.setObservedUniverseInnerRadius) !== "undefined") {
				entity.setObservedUniverseInnerRadius(Math.min(entity.getObservedUniverseInnerRadius(), universe.getObservedUniverseInnerRadius(universe)));
			}
		});
	},
	resetObservedUniverseData: function(universe) { // Universe
		this.getObservedUniverseEntities().forEach(function(entity) {
			if (typeof(entity.setObservedUniverseOuterRadius) !== "undefined") {
				entity.setObservedUniverseOuterRadius(universe.getObservedUniverseOuterRadius(universe));
			}
			if (typeof(entity.setObservedUniverseInnerRadius) !== "undefined") {
				entity.setObservedUniverseInnerRadius(universe.getObservedUniverseInnerRadius(universe));
			}
		});
	},
	refreshCompositeEntityCanvasPositions: function(universe) { // Universe
		this.getCompositeEntities().forEach(function(entity) {
			entity.refreshCanvasPosition(universe);
		});
	},
	
	// Handles conversion of coordinate offsets between the universe and the canvas
	findCanvasCoordinatesOffset: function(universeCoordinatesOffset) { // point as Vector
		var canvasCoordinatesOffset = universeCoordinatesOffset.multiply(this.getCanvasZoom());
		return new paper.Point([canvasCoordinatesOffset.e(1), canvasCoordinatesOffset.e(2) * -1]); // point as Point
	},
	findUniverseCoordinatesOffset: function(canvasCoordinatesOffset) { // point as Point
		return Vector.create([canvasCoordinatesOffset.x, canvasCoordinatesOffset.y * -1]).multiply(1 / this.getCanvasZoom()).to3D(); // point as Vector
	},
	
	// Handles conversion of coordinates between the universe and the canvas
	findCanvasCoordinates: function(universeCoordinates) { // point as Vector
		var relativeCanvasCoordinates = universeCoordinates.subtract(this.getCenterOfCanvas()).multiply(this.getCanvasZoom());
		relativeCanvasCoordinates.elements[1] = relativeCanvasCoordinates.e(2) * -1;
		var absoluteCanvasCoordinates = relativeCanvasCoordinates.add(Vector.create([view.viewSize.width, view.viewSize.height, 0]).multiply(0.5));
		return new paper.Point(absoluteCanvasCoordinates.elements.slice(0, 2)); // point as Point
	},
	findUniverseCoordinates: function(canvasCoordinates) { // point as Point
		var relativeUniverseCoordinates = Vector.create([canvasCoordinates.x, canvasCoordinates.y, 0]).subtract(Vector.create([view.viewSize.width, view.viewSize.height, 0]).multiply(0.5)).multiply(1 / this.getCanvasZoom());
		relativeUniverseCoordinates.elements[1] = relativeUniverseCoordinates.e(2) * -1;
		return relativeUniverseCoordinates.add(this.getCenterOfCanvas()).to3D(); // point as Vector
	},
	
	// Handles text display
	setTypeface: function(typeface) { // String
		this.properties.text.typeface = typeface;
	},
	getTypeface: function() {
		return this.properties.text.typeface; // String
	},
	setFontSize: function(fontSize) { // int
		this.properties.text.fontSize = fontSize;
	},
	getFontSize: function() {
		return this.properties.text.fontSize; // int
	},
	
	// Handles the maximum number of digits after decimals to display
	setDecimalPrecision: function(decimalPrecision) { // int
		this.properties.text.decimalPrecision = decimalPrecision;
		return true; // bool
	},
	getDecimalPrecision: function() {
		return this.properties.text.decimalPrecision; // int
	},
	setDecimalEpsilonPrecision: function(decimalEpsilonPrecision) { // int
		this.properties.text.decimalEpsilonPrecision = decimalEpsilonPrecision;
		return true; // bool
	},
	getDecimalEpsilonPrecision: function() {
		return this.properties.text.decimalEpsilonPrecision; // int
	}
});
