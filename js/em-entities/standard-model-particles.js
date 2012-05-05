// Various real physics particles
var StandardModelParticle = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Handle standard-model-particle-specific constants
		this.getType().push("Standard Model Particle");
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
	}
});

var Electron = new Class({
	Extends: StandardModelParticle,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperties.mass = 9.10938291 * Math.pow(10, -31);
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle electron-specific constants
		this.getType().push("Electron");
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = "e⁻";
		return true; // bool
	}
});
var Positron = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperties.mass = 9.10938291 * Math.pow(10, -31);
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle positron-specific constants
		this.getType().push("Positron");
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = "e⁺";
		return true; // bool
	}
});
var Proton = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.672621777 * Math.pow(10, -27);
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle proton-specific constants
		this.getType().push("Proton");
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = "p";
		return true; // bool
	}
});
var AntiProton = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.672621777 * Math.pow(10, -27);
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle antiproton-specific constants
		this.getType().push("AntiProton");
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = "p̅";
		return true; // bool
	}
});
var Muon = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.883531 * Math.pow(10, -28);
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle muon-specific constants
		this.getType().push("Muon");
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = "μ⁻";
		return true; // bool
	}
});
var AntiMuon = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperties.mass = 1.883531 * Math.pow(10, -28);
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle antimuon-specific constants
		this.getType().push("AntiMuon");
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = "μ⁺";
		return true; // bool
	}
});
var Tauon = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = -1.602176565 * Math.pow(10, -19);
		newProperites.mass = 3.16777 * Math.pow(10, -27);
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle tauon-specific constants
		this.getType().push("Tauon");
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = "τ⁻";
		return true; // bool
	}
});
var AntiTau = new Class({
	Extends: ChargedPointEntity,
	
	initialize: function(properties, universe) { // Object
		// Handle preset properties
		var newProperties = Object.clone(properties);
		newProperties.charge.charge = 1.602176565 * Math.pow(10, -19);
		newProperites.mass = 3.16777 * Math.pow(10, -27);
		// Handle preset properties which don't clone properly with MooTools
		newProperties.point.location = Vector.create(properties.point.location.elements);
		// Send up to parent
		this.parent(newProperties, universe);
		// Handle antitau-specific constants
		this.getType().push("AntiTau");
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		this.getGraphics().label.content = "τ⁺";
		return true; // bool
	}
});