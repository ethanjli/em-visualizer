// Gets the E Field vector for a point in the universe
var EFieldVector = new Class({
	Extends: PointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("E Field Vector");
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricFieldAt(this.getLocation()); // vector as Vector
	}
});

// Gets the E Field direction vector for a point in the universe
var EFieldDirection = new Class({
	Extends: EFieldVector,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("E Field Direction Vector");
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricFieldAt(this.getLocation()).toUnitVector(); // vector as Vector
	}
});

// Gets the E Field direction vector for a point in the universe
var EFieldMagnitude = new Class({
	Extends: EFieldVector,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type.push("E Field Magnitude");
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricFieldAt(this.getLocation()).modulus(); // double
	}
});