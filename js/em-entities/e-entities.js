// Definitions for all electric charges

// Models any point charge in the universe
var ChargedPointEntity = new Class({
	Extends: PointEntity,
	
	initialize: function(properties) { // Object
		// Send up to parent
		this.parent(properties);
		// Initialize charged-point-specific properties container
		this.properties.charge = new Object();
		// Handle charged-point-specific constants
		this.getType().push("Charge");
		// Handle charged-point-specific variables
		this.setCharge(properties.charge.charge);
	},
	
	// Handles the entity's electric charge
	setCharge: function(charge) { // double
		this.charge.charge = charge;
		return true; // bool
	},
	getCharge: function() {
		return this.charge.charge; // double
	},

	// Handles calculation of the electric field from the entity
	findElectricFieldAt: function(location, vacuumPermittivity) { // point as Vector, int
		// Find the displacement vector
		var displacement = this.findVectorTo(location);
		// Calculate the magnitude of the field vector
		var EMagnitude = 1 / (4 * Math.PI * vacuumPermittivity) * this.getCharge() / Math.pow(displacement.modulus(), 2);
		return displacement.toUnitVector().multiply(EMagnitude); // vector as Vector
	},
	// Handles calculation of the electric potential from the entity
	findElectricPotentialAt: function(location, vacuumPermittivity) { // point as Vector, int
		return 1 / (4 * Math.PI * vacuumPermittivity) * this.getCharge() / this.findVectorTo(location).modulus(); // double
	}
});

// Models any line charge in the universe
var ChargedLineEntity = new Class({
	Extends: LineEntity,
	
	initialize: function(properties) { // Object
		// Send up to parent
		this.parent(properties);
		// Initialize charged-line-specific properties container
		this.properties.charge = new Object();
		// Handle charged-line-specific constants
		this.getType().push("Charge");
		// Handle charged-point-specific variables
		this.setChargeDensity(properties.charge.chargeDensity);
	},
	
	// Handles the entity's electric charge density
	setChargeDensity: function(chargeDensity) { // double
		this.charge.chargeDensity = chargeDensity;
		return true; // bool
	},
	getChargeDensity: function() {
		return this.charge.chargeDensity; // double
	},
	
	// Handles calculation of the electric field from the entity
	// FIXME: location is assumed to be close to the charge
	findElectricFieldAt: function(location, vacuumPermittivity) { // point as Vector, int
		// Find the displacement vector
		var displacement = this.findVectorTo(location);
		// Calculate the magnitude of the field vector
		var EMagnitude = 2 / (4 * Math.PI * vacuumPermittivity) * this.getChargeDensity() / displacementVector.modulus();
		return displacementVector.toUnitVector().multiply(EMagnitude); // vector as Vector
	},
	// Handles calculation of the electric potential from the entity
	// TODO: verify if the calculation is correct, or if some reference distance for a reference potential is needed
	findElectricPotentialAt: function(location, vacuumPermittivity) { // point as Vector, int
		return -2 / (4 * Math.PI * vacuumPermittivity) * this.getChargeDensity() * Math.ln(this.getLine().distanceFrom(location)); // double
	}
});