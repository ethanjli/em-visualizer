// Gets the E Field vector for a point in the universe
var EFieldVector = new Class({
	Extends: PointEntity,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-probe-specific constants
		this.getType().push("E Field Vector");
		// Handle e-field-probe-specific variables
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricFieldAt(this.getLocation()); // vector as Vector
	}
});

// Gets the E Field direction vector for a point in the universe
var EFieldDirection = new Class({
	Extends: EFieldVector,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-direction-probe-specific constants
		this.getType().push("E Field Direction Vector");
		// Handle e-field-direction-probe-specific variables
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricFieldAt(this.getLocation()).toUnitVector(); // vector as Vector
	}
});

// Gets the E Field magnitude for a point in the universe
var EFieldMagnitude = new Class({
	Extends: EFieldVector,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-magnitude-probe-specific constants
		this.getType().push("E Field Magnitude");
		// Handle e-field-magnitude-probe-specific variables
	},	
	initializeGraphics: function() { // Object
		this.parent();
		// Draw the label
		this.getGraphics().label.content = "???N/C";
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricFieldAt(this.getLocation()).modulus(); // double
	},
	
	// Handles graphical display of the entity
	refreshLabel: function(universe) { // Universe
		var decimalPrecision = universe.getDecimalPrecision();
		this.getGraphics().label.content = parseFloat(this.measure(universe).toPrecision(decimalPrecision)) + "N/C";
		return true; // bool
	},
});

// Gets the E Potential for a point in the universe
var EPotential = new Class({
	Extends: PointEntity,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-magnitude-probe-specific constants
		this.getType().push("E Potential");
		// Handle e-field-magnitude-probe-specific variables
	},	
	initializeGraphics: function() { // Object
		this.parent();
		// Draw the Label
		this.getGraphics().label.content = "???V";
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricPotentialAt(this.getLocation()); // double
	},
	
	// Handles graphical display of the entity
	refreshLabel: function(universe) { // Universe
		var decimalPrecision = universe.getDecimalPrecision();
		this.getGraphics().label.content = parseFloat(this.measure(universe).toPrecision(decimalPrecision)) + "V";
		return true; // bool
	},
});
