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
		this.setCanvasZoom(properties.graphics.canvasZoom);
		//// Handle text display
		this.properties.text = new Object();
		this.setDecimalPrecision(properties.text.decimalPrecision);
		//// Populate the universe with initial entities
		////// Add the (0,0) anchor point
		this.addEntity(new UniverseAnchorPoint({
			id: this.getNextEntityId(),
			graphics: {
				canvasCoordinates: this.findCanvasCoordinates(Vector.create([0, 0]))
			}
		}, this));
		////// Put all the other entities in if the entity list is not undefined
		if (typeof(properties.entities.entities) !== 'undefined' && properties.entities.entities.length != 0) {
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
	addEntity: function(entity) {
		this.properties.entities.entities[entity.getId()] = entity;
		entity.initializeGraphics();
		return this; // Entity
	},
	getEntity: function(id) { // int
		return this.properties.entities.entities[id]; // Entity
	},
	removeEntity: function(entity) { // Entity
		this.properties.entities.entities[entity.getId()] = null;
		// FIXME: remove graphics. Maybe add a erase method to each entity? 
		return entity; // Entity
	},
	// TODO: add method to compress the entity list and entity ids by filling empty spots
	
	// Calculates the electric field in the universe at a given spot by superpositioning
	findElectricFieldAt: function(location) { // point as Vector
		return entities.reduce(function(totalElectricField, currentValue, index, array) { // vector as Vector // double, Entity, int, Entity[]
			if (findElectricFieldAt in currentValue) {
				return totalElectricField.add(currentValue.findElectricFieldAt(location, this.getVacuumPermittivity())); // vector as Vector
			}
		});
	},
	// Calculates the electric potential in the universe at a given spot by superpositioning
	findElectricPotentialAt: function(location) { // point as Vector
		return entities.reduce(function(totalElectricPotential, currentValue, index, array) { // double // double, Entity, int, Entity[]
			if (findElectricPotentialAt in currentValue) {
				return totalElectricPotential + currentValue.findElectricPotentialAt(location, this.getVacuumPermittivity()); // double
			}
		});
	},
	
	// Handles the location in the universe where the center of the canvas is
	setCenterOfCanvas: function(location) { // point as Vector
		this.properties.graphics.locationOfCenterOfCanvas = Vector.create(location.elements);
		return true; // bool
	},
	getCenterOfCanvas: function() {
		return this.properties.graphics.locationOfCenterOfCanvas; // point as Vector
	},
	
	// Handles the zoom of the canvas
	setCanvasZoom: function(zoom) { // double
		this.properties.graphics.canvasZoom = zoom;
		return true; // bool
	},
	getCanvasZoom: function() {
		return this.properties.graphics.canvasZoom; // double
	},
	
	// Handles conversion of coordinate offsets between the universe and the canvas
	findCanvasCoordinatesOffset: function(universeCoordinatesOffset) { // point as Vector
		var canvasCoordinatesOffset = universeCoordinatesOffset.multiply(this.getCanvasZoom());
		return new paper.Point([canvasCoordinatesOffset.e(1), canvasCoordinatesOffset.e(2)]); // point as Point
	},
	findUniverseCoordinatesOffset: function(canvasCoordinatesOffset) { // point as Point
		return Vector.create([canvasCoordinatesOffset.x, canvasCoordinatesOffset.y]).multiply(1 / this.getCanvasZoom()); // point as Vector
	},
	
	// Handles conversion of coordinates between the universe and the canvas
	findCanvasCoordinates: function(universeCoordinates) { // point as Vector
		var canvasCoordinates = universeCoordinates.subtract(this.getCenterOfCanvas()).multiply(this.getCanvasZoom()).add(Vector.create([view.viewSize.width, view.viewSize.height]).multiply(0.5));
		return new paper.Point([canvasCoordinates.e(1), canvasCoordinates.e(2)]); // point as Point
	},
	findUniverseCoordinates: function(canvasCoordinates) { // point as Point
		return Vector.create([canvasCoordinates.x, canvasCoordinates.y]).subtract(Vector.create([view.viewSize.width, view.viewSize.height]).multiply(0.5)).multiply(1 / this.getCanvasZoom()).add(this.getCenterOfCanvas()); // point as Vector
	},
	
	// Handles the maximum number of digits after decimals to display
	setDecimalPrecision: function(decimalPrecision) { // int
		this.properties.text.decimalPrecision = decimalPrecision;
		return true; // bool
	},
	getDecimalPrecision: function() {
		return this.properties.text.decimalPrecision; // int
	}
});
