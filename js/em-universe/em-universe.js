var Universe = new Class({
	initialize: function(properties) {
		this.id = properties.id;
		this.type = "Universe";
		this.setName(properties.name);
		this.entityIdCounter = 0;
		this.entitiesList = properties.entities;
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
	entityIdCounter: function() {
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
	removeEntity: function(entity) {
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
	}
});
