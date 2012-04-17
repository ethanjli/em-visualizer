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
		this.type.push("Charge");
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
		this.type.push("Charge");
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

// Various real physics particles
var Electron = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperties.mass = 9.10938291 * Math.pow(10, -31);
		// Send up to parent
		this.parent(newProperties);
		// Handle electron-specific constants
		this.type.push("Electron");
	}
});
var Positron = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperties.mass = 9.10938291 * Math.pow(10, -31);
		// Send up to parent
		this.parent(newProperties);
		// Handle positron-specific constants
		this.type.push("Positron");
	}
});
var Proton = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.672621777 * Math.pow(10, -27);
		// Send up to parent
		this.parent(newProperties);
		// Handle proton-specific constants
		this.type.push("Proton");
	}
});
var AntiProton = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.672621777 * Math.pow(10, -27);
		// Send up to parent
		this.parent(newProperties);
		// Handle antiproton-specific constants
		this.type.push("AntiProton");
	}
});
var Muon = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.883531 * Math.pow(10, -28);
		// Send up to parent
		this.parent(newProperties);
		// Handle muon-specific constants
		this.type.push("Muon");
	}
});
var AntiMuon = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.883531 * Math.pow(10, -28);
		// Send up to parent
		this.parent(newProperties);
		// Handle antimuon-specific constants
		this.type.push("AntiMuon");
	}
});
var Tauon = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperites.mass = 3.16777 * Math.pow(10, -27);
		// Send up to parent
		this.parent(newProperties);
		// Handle tauon-specific constants
		this.type.push("Tauon");
	}
});
var AntiTau = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperites.mass = 3.16777 * Math.pow(10, -27);
		// Send up to parent
		this.parent(newProperties);
		// Handle antitau-specific constants
		this.type.push("AntiTau");
	}
});