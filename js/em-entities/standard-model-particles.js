// Various real physics particles
var StandardModelParticle = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Initialize standard-model-particle-specific properties container
		this.properties.standardModelParticle = new Object();
		// Handle standard-model-particle-specific constants
		this.getType().push("Standard Model Particle");
		// Handle standard-model-particle-specific variables
		this.properties.standardModelParticle.symbol = properties.standardModelParticle.symbol;
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		this.refreshGraphics(universe);
	},
	
	// Override mutator methods to avoid changing charge and mass if they've already been initialized
	setCharge: function(charge) {
		if (typeof(this.getCharge()) !== "undefined") {
			debug.warn("Tried to set the charge of standard model particle " + this.getId());
			return false; // bool
		} else {
			return this.parent(charge); // bool
		}
	},
	setMass: function(mass) {
		if (typeof(this.getMass()) !== "undefined") {
			debug.warn("Tried to set the mass of standard model particle " + this.getId());
			return false; // bool
		} else {
			return this.parent(mass); // bool
		}
	},
	
	// Returns the symbol used to represent the standard-model-particle
	getStandardModelParticleSymbol: function() {
		return this.properties.standardModelParticle.symbol // String
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = this.getStandardModelParticleSymbol();
		return true; // bool
	}
});

var Electron = new Class({
	Extends: StandardModelParticle,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		if (typeof(newProperties.charge) === "undefined") {
			newProperties.charge = new Object();
		}
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperties.mass = 9.10938291 * Math.pow(10, -31);
		if (typeof(newProperties.standardModelParticle) === "undefined") {
			newProperties.standardModelParticle = new Object();
		}
		newProperties.standardModelParticle.symbol = "e⁻";
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle electron-specific constants
		this.getType().push("Electron");
	}
});
var Positron = new Class({
	Extends: StandardModelParticle,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		if (typeof(newProperties.charge) === "undefined") {
			newProperties.charge = new Object();
		}
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperties.mass = 9.10938291 * Math.pow(10, -31);
		if (typeof(newProperties.standardModelParticle) === "undefined") {
			newProperties.standardModelParticle = new Object();
		}
		newProperties.standardModelParticle.symbol = "e⁺";
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle positron-specific constants
		this.getType().push("Positron");
	}
});
var Proton = new Class({
	Extends: StandardModelParticle,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		if (typeof(newProperties.charge) === "undefined") {
			newProperties.charge = new Object();
		}
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.672621777 * Math.pow(10, -27);
		if (typeof(newProperties.standardModelParticle) === "undefined") {
			newProperties.standardModelParticle = new Object();
		}
		newProperties.standardModelParticle.symbol = "p";
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle proton-specific constants
		this.getType().push("Proton");
	}
});
var AntiProton = new Class({
	Extends: StandardModelParticle,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		if (typeof(newProperties.charge) === "undefined") {
			newProperties.charge = new Object();
		}
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.672621777 * Math.pow(10, -27);
		if (typeof(newProperties.standardModelParticle) === "undefined") {
			newProperties.standardModelParticle = new Object();
		}
		newProperties.standardModelParticle.symbol = "p̅";
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle antiproton-specific constants
		this.getType().push("AntiProton");
	}
});
var Muon = new Class({
	Extends: StandardModelParticle,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		if (typeof(newProperties.charge) === "undefined") {
			newProperties.charge = new Object();
		}
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.883531 * Math.pow(10, -28);
		if (typeof(newProperties.standardModelParticle) === "undefined") {
			newProperties.standardModelParticle = new Object();
		}
		newProperties.standardModelParticle.symbol = "μ⁻";
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle muon-specific constants
		this.getType().push("Muon");
	}
});
var AntiMuon = new Class({
	Extends: StandardModelParticle,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		if (typeof(newProperties.charge) === "undefined") {
			newProperties.charge = new Object();
		}
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.883531 * Math.pow(10, -28);
		if (typeof(newProperties.standardModelParticle) === "undefined") {
			newProperties.standardModelParticle = new Object();
		}
		newProperties.standardModelParticle.symbol = "μ⁺";
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle antimuon-specific constants
		this.getType().push("AntiMuon");
	}
});
var Tauon = new Class({
	Extends: StandardModelParticle,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		if (typeof(newProperties.charge) === "undefined") {
			newProperties.charge = new Object();
		}
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperites.mass = 3.16777 * Math.pow(10, -27);
		if (typeof(newProperties.standardModelParticle) === "undefined") {
			newProperties.standardModelParticle = new Object();
		}
		newProperties.standardModelParticle.symbol = "τ⁻";
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle tauon-specific constants
		this.getType().push("Tauon");
	}
});
var AntiTau = new Class({
	Extends: StandardModelParticle,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		if (typeof(newProperties.charge) === "undefined") {
			newProperties.charge = new Object();
		}
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperites.mass = 3.16777 * Math.pow(10, -27);
		if (typeof(newProperties.standardModelParticle) === "undefined") {
			newProperties.standardModelParticle = new Object();
		}
		newProperties.standardModelParticle.symbol = "τ⁺";
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle antitau-specific constants
		this.getType().push("AntiTau");
	}
});
