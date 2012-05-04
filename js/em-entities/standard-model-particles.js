// Various real physics particles
var StandardModelParticle = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties) { // Object
		// Send up to parent
		this.parent(newProperties);
		// Handle standard-model-particle-specific constants
		this.getType().push("Standard Model Particle");
	},
	
	// Override mutator methods to do nothing
	setCharge: function(charge) {
		return false;
	},
	setMass: function(mass) {
		return false;
	}
});

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
		this.getType().push("Electron");
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
		this.getType().push("Positron");
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
		this.getType().push("Proton");
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
		this.getType().push("AntiProton");
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
		this.getType().push("Muon");
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
		this.getType().push("AntiMuon");
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
		this.getType().push("Tauon");
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
		this.getType().push("AntiTau");
	}
});