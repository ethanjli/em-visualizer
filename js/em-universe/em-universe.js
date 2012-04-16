var Universe = new Class({
	initialize: function(properties) {
		this.id = properties.id;
		this.type = "Universe";
		this.setName(properties.name);
		// Managing entities
		this.entityIdCounter = 0;
		this.entities = new Array();
		// Managing graphical display
		this.setCanvasDimensions(properties.canvasDimensions);
		this.setCenterOfCanvas(properties.locationOfCenterOfCanvas);
		this.setCanvasZoom(properties.canvasZoom);
		// Populate the universe
		this.addEntity(new UniverseAnchorPoint({
			id: this.getNextEntityId(),
			canvasCoordinates: this.findCanvasCoordinates(Vector.create([0, 0]))
		}));
		debug.debug("Added centerOfUniverse entity", this.getEntity(0));
		this.setEntities(properties.entities);
	},
	
	getId: function() {
		return this.id; // int
	},
	getType: function() {
		return this.type; // String
	},
	
	// Handles the universe's name
	setName: function(name) { // String
		this.name = name;
	},
	getName: function() {
		return this.name; // String
	},
	
	// Handles the universe's ε_0
	setVacuumPermittivity: function(vacuumPermittivity) { // double
		this.vacuumPermittivity = vacuumPermittivity;
	},
	getVacuumPermittivity: function() {
		return this.vacuumPermittivity; // double
	},
	
	// Handles the universe's μ_0
	setVacuumPermeability: function(vacuumPermeability) { // double
		this.vacuumPermeability = vacuumPermeability;
	},
	getVacuumPermeability: function() {
		return this.vacuumPermeability; // double
	},
	
	// Provides a counter to be used for setting the id of the next entity made in the universe
	getNextEntityId: function() {
		return this.entityIdCounter++; // int
	},
	
	// Handles the universe's list of entities
	setEntities: function(entities) { // Entity[]
		this.entities = entities;
	},
	getEntities: function() {
		return this.entities; // Entity[]
	},
	addEntity: function(entity) {
		this.entities[entity.getId()] = entity;
	},
	getEntity: function(id) { // int
		return this.entities[id]; // Entity
	},
	removeEntity: function(entity) { // Entity
		this.entities[entity.getId()] = null;
	},
	
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
	
	// Handles the dimensions of the canvas
	setCanvasDimensions: function(bottomRightCorner) { // size as Size
		this.canvasDimensions = bottomRightCorner;
	},
	getCanvasDimensions: function() {
		return this.canvasDimensions // size as Size
	},
	
	// Handles the location in the universe where the center of the canvas is
	setCenterOfCanvas: function(location) { // point as Vector
		this.locationOfCenterOfCanvas = location;
	},
	getCenterOfCanvas: function() {
		return this.locationOfCenterOfCanvas; // point as Vector
	},
	
	// Handles the zoom of the canvas
	setCanvasZoom: function(zoom) { // double
		this.canvasZoom = zoom;
	},
	getCanvasZoom: function() {
		return this.canvasZoom; // double
	},
	
	// Handles conversion of coordinates between the universe and the canvas
	findCanvasCoordinates: function(universeCoordinates) { // point as Vector
		var canvasCoordinates = universeCoordinates.subtract(this.getCenterOfCanvas()).multiply(this.getCanvasZoom()).add(Vector.create([this.getCanvasDimensions().width, this.getCanvasDimensions().height]).multiply(0.5));
		return new paper.Point([canvasCoordinates.elements[0], canvasCoordinates.elements[1]]); // point as Point
	},
	findUniverseCoordinates: function(canvasCoordinates) { // point as Point
		return Vector.create([canvasCoordinates.x, canvasCoordinates.y]).subtract(Vector.create([this.getCanvasDimensions().width, this.getCanvasDimensions().height]).multiply(0.5)).multiply(1 / this.getCanvasZoom()).add(this.getCenterOfCanvas()); // point as Vector
	}
});
