
// Models any object in the universe
var Entity = new Class({
	initialize: function(properties) { // Object
		this.id = properties.id;
		this.type = "Object";
		this.setName(properties.name);
		this.setAnchored(properties.anchored);
	},
	
	getId: function() {
		return this.id; // int
	},
	getType: function() {
		return this.type; // String
	},
	
	setName: function(name) { // String
		this.name = name;
	},
	getName: function() {
		return this.name; // String
	},
	
	setAnchored: function(anchored) { // Boolean
		this.anchored = anchored;
	},
	isAnchored: function() {
		return this.anchored; // Boolean
	}
});

// Models any point object in the universe
var PointEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type = "Point Object";
		this.setLocation(properties.location);
	},
	
	setLocation: function(location) { // Point
		this.location = location;
	},
	getLocation: function() {
		return this.location; // Point
	}
});

// Models any line object in the universe
var LineEntity = new Class({
	Extends: PointEntity,
	
	initialize: function(properties) { // Object
		this.parent(properties);
		this.type = "Line Object";
	},
	
	setDirection: function(direction) { // vector as a Point
		
	},
	getDirection: function() {
		return this.direction; // vector as a Point
	}
});
