// Gets the E Field for a point in the universe
var EField = new Class({
	Extends: PointEntity,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-probe-specific constants
		this.getType().push("E Field");
		// Handle e-field-probe-specific variables
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricFieldAt(this.getLocation()); // vector as Vector
	}
});

// Gets the E Field vector for a point in the universe
var EFieldVector = new Class({
	Extends: EField,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-probe-specific constants
		this.getType().push("Vector");
		// Handle e-field-probe-specific variables
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		// Create container for vector arrow display
		this.getGraphics().vector = new Object();
		// Draw the arrowhead for the vector
		var arrowhead = new Path.RegularPolygon(this.getCanvasCoordinates(), 3, 3.5);
		arrowhead.style = {
			fillColor: "black",
			strokeColor: "black",
			strokeWidth: 2
		};
		arrowhead.rotate(-150);
		// Draw the arrowtail for the vector
		var arrowtail = new Path.Line(this.getCanvasCoordinates(), this.getCanvasCoordinates());
		arrowtail.style = {
			strokeColor: "black",
			strokeWidth: 2
		};
		// Commit graphics
		this.getGraphics().vector.arrowhead = arrowhead;
		this.getClickable().addChild(arrowhead);
		this.getGraphics().vector.arrowtail = arrowtail;
		this.getClickable().addChild(arrowtail);
		// Initialize other stuff
		this.getGraphics().vector.magnitude = 0;
		this.getGraphics().vector.angle = 0;
		this.refreshGraphics(universe);
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		// Update label
		var decimalPrecision = universe.getDecimalPrecision();
		this.getGraphics().label.content = parseFloat(this.measure(universe).modulus().toPrecision(decimalPrecision)) + "N/C";
		// Prepare for updating the vector arrow
		var vectorData = this.measure(universe).to3D();
		// Determine information about vector arrow
		var vectorMagnitude = vectorData.modulus() * Math.pow(10, 9);
		if (vectorMagnitude > Math.pow(10, 20) || vectorMagnitude == 0) {
			vectorMagnitude = 0;
			vectorAngle = 0;
		} else {
			var vectorOrientation = -1 * Vector.i.cross(vectorData).toUnitVector().e(3); // Direction of 1 means the arrow is clockwise from j; direction of -1 means the arrow is counterclockwise from j
			var vectorAngle = vectorOrientation * vectorData.angleFrom(Vector.i) * 180 / Math.PI;
		}
		var previousMagnitude = this.getGraphics().vector.magnitude;
		var previousAngle = this.getGraphics().vector.angle;
		// Modify the arrowhead-end of the arrow
		if (previousMagnitude == 0) { // The vector was previously drawn as zero
			// Make a new endpoint
			this.getGraphics().vector.arrowtail.lastSegment.point = (new Point(vectorMagnitude, 0)).add(this.getCanvasCoordinates());
		} else {
			// Scale the vector
			var newVector = this.getGraphics().vector.arrowtail.lastSegment.point.subtract(this.getGraphics().vector.arrowtail.firstSegment.point).multiply(vectorMagnitude / previousMagnitude);
			this.getGraphics().vector.arrowtail.lastSegment.point = newVector.add(this.getCanvasCoordinates());
		}
		this.getGraphics().vector.magnitude = vectorMagnitude;
		// Move the arrowhead
		this.getGraphics().vector.arrowhead.position = this.getGraphics().vector.arrowtail.lastSegment.point;
		// Set the new probe-end of the arrow
		this.getGraphics().vector.arrowtail.firstSegment.point = this.getCanvasCoordinates();
		// Rotate the arrow accordingly
		this.getGraphics().vector.arrowtail.rotate(vectorAngle - previousAngle, this.getGraphics().vector.arrowtail.firstSegment.point);
		this.getGraphics().vector.arrowhead.rotate(vectorAngle - previousAngle, this.getGraphics().vector.arrowtail.firstSegment.point);
		this.getGraphics().vector.angle = vectorAngle;
		return true; // bool
	},
});

// Gets the E Field direction vector for a point in the universe
var EFieldDirection = new Class({
	Extends: EFieldVector,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-direction-probe-specific constants
		this.getType().push("Direction Vector");
		// Handle e-field-direction-probe-specific variables
	},
	
	measure: function(universe) { // Universe
		return this.parent(universe).toUnitVector().multiply(Math.pow(10, -8)); // vector as Vector
	}
});

// Gets the E Field magnitude for a point in the universe
var EFieldMagnitude = new Class({
	Extends: EField,
	
	initialize: function(properties, universe) { // Object
		// Send up to parent
		this.parent(properties, universe);
		// Handle e-field-magnitude-probe-specific constants
		this.getType().push("Magnitude");
		// Handle e-field-magnitude-probe-specific variables
	},
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		this.refreshGraphics(universe);
	},
	
	measure: function(universe) { // Universe
		return this.parent(universe).modulus(); // double
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
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
	initializeGraphics: function(universe) { // Universe
		this.parent(universe);
		this.refreshGraphics(universe);
	},
	
	measure: function(universe) { // Universe
		return universe.findElectricPotentialAt(this.getLocation()); // double
	},
	
	// Handles graphical display of the entity
	refreshGraphics: function(universe) { // Universe
		var decimalPrecision = universe.getDecimalPrecision();
		this.getGraphics().label.content = parseFloat(this.measure(universe).toPrecision(decimalPrecision)) + "V";
		return true; // bool
	},
});
