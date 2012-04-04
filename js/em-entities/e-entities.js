// Definitions for all electric charges

// Models any point charge in the universe
var ChargedPointEntity = new Class({
	Extends: PointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Charge");
		this.setCharge(properties.charge);
	},
	
	// Handles the entity's electric charge
	setCharge: function(charge) { // double
		this.charge = charge;
	},
	getCharge: function() {
		return this.charge; // double
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
		this.parent(properties);
		this.type.push("Charge");
		this.setChargeDensity(properties.chargeDensity);
	},
	
	// Handles the entity's electric charge density
	setChargeDensity: function(chargeDensity) { // double
		this.chargeDensity = chargeDensity;
	},
	getChargeDensity: function() {
		return this.chargeDensity; // double
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
		return -2 / (4 * Math.PI * vacuumPermittivity) * this.chargeDensity * Math.ln(this.getLine().distanceFrom(location)); // double
	}
});

// Various real physics particles
var Electron = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Electron");
		this.setCharge(-1.602176565 * Math.pow(10, -19));
		this.setMass(9.10938291 * Math.pow(10, -31));
	}
});
var Positron = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Positron");
		this.setCharge(1.602176565 * Math.pow(10, -19));
		this.setMass(9.10938291 * Math.pow(10, -31));
	}
});
var Proton = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Proton");
		this.setCharge(1.602176565 * Math.pow(10, -19));
		this.setMass(1.672621777 * Math.pow(10, -27));
	}
});
var Proton = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Proton");
		this.setCharge(-1.602176565 * Math.pow(10, -19));
		this.setMass(1.672621777 * Math.pow(10, -27));
	}
});
var Muon = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Muon");
		this.setCharge(-1.602176565 * Math.pow(10, -19));
		this.setMass(1.883531 * Math.pow(10, -28));
	}
});
var AntiMuon = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Antimuon");
		this.setCharge(1.602176565 * Math.pow(10, -19));
		this.setMass(1.883531 * Math.pow(10, -28));
	}
});
var Tauon = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Tauon");
		this.setCharge(-1.602176565 * Math.pow(10, -19));
		this.setMass(3.16777 * Math.pow(10, -27));
	}
});
var AntiTau = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("Antitau");
		this.setCharge(1.602176565 * Math.pow(10, -19));
		this.setMass(3.16777 * Math.pow(10, -27));
	}
});