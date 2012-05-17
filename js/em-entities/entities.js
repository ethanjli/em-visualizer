// Definitions for all objects in the universe by shape

// Models any object, real or imaginary, in the universe that is displayed on the canvas
var Entity = new Class({
	initialize: function(properties, universe) { // Object, Universe
		// Initialize entity-specific properties container
		this.properties = new Object();
		// Handle entity-specific constants
		this.properties.id = properties.id;
		this.properties.type = ["Object"];
		this.properties.parentEntity = properties.parentEntity;
		// Handle entity-specific variables
		this.setName(properties.name);
		if (typeof(properties.anchored) == "undefined" || !properties.anchored) {
			properties.anchored = false;
		}
		this.setAnchored(properties.anchored);
		if (typeof(properties.mass) == "undefined" || !properties.mass) {
			properties.mass = 0;
		}
		this.setMass(properties.mass);
		if (typeof(properties.graphics) == "undefined") {
			properties.graphics = new Object();
		}
		this.properties.graphics = properties.graphics;
		this.setCanvasCoordinates(properties.graphics.canvasCoordinates);
	},
	initializeGraphics: function(universe) { // Universe
		// Set up storage
		this.getGraphics().group = {
			group: new Group(),
			clickable: {
				group: new Group(),
				main: {
					group: new Group()
				},
				hovered: {
					group: new Group()
				},
				selected: {
					group: new Group()
				}
			}
		};
		////// Custom properties
		this.getGroup().group.associatedEntity = this;
		this.getClickable().group.isClickable = true;
		////// Nest the groups
		this.getGroup().group.appendTop(this.getClickable().group);
		this.getClickable().group.appendTop(this.getMain().group);
		this.getClickable().group.appendBottom(this.getHovered().group);
		this.getClickable().group.appendBottom(this.getSelected().group);
	},
	initializeChildren: function(universe) {
		return true;
	},
	
	// Handles the entity's basic properties
	getId: function() {
		return this.properties.id; // int
	},
	getType: function() {
		return this.properties.type; // String
	},
	setName: function(name) { // String
		this.properties.name = name;
		return true; // bool
	},
	getName: function() {
		return this.properties.name; // String
	},
	
	// Method to remove the entity
	remove: function(universe) { // Universe
		if (typeof(this.getProperties().parentEntity) === "undefined") {
			return this.getGroup().group.remove(); // bool
		} else {
			universe.removeEntity(universe, this.getProperties().parentEntity);
			return this.getGroup().group.remove(); // bool
		}
	},
	
	// Handles properties in a bulk manner
	setProperties: function(properties) { // Object
		// FIXME: figure out how to clone better without ruining vectors and points
		this.properties = Object.clone(properties);
		return true; // bool
	},
	getProperties: function() {
		return this.properties; // Object
	},
	
	// Handles whether or not the entity is mobile
	setAnchored: function(anchored) { // bool
		this.properties.anchored = anchored;
		return true; // bool
	},
	isAnchored: function() {
		return this.properties.anchored; // bool
	},
	
	// Handles the entity's mass
	setMass: function(mass) { // double
		this.properties.mass = mass;
		return true; // bool
	},
	getMass: function() {
		return this.properties.mass; // double
	},
	
	// Handles graphical display of the entity
	updateLocation: function(location, universe) { // point as Vector or Point, Universe
		return false;
	},
	updateLocationByOffset: function(offset, universe) { // vector as Vector or Point, Universe
		return false;
	},
	getGraphics: function() {
		return this.properties.graphics; // Object
	},
	getGroup: function() {
		return this.getGraphics().group; // Object
	},
	getClickable: function() {
		return this.getGroup().clickable; // Object
	},
	getMain: function() {
		return this.getClickable().main; // Object
	},
	getHovered: function() {
		return this.getClickable().hovered; // Object
	},
	getSelected: function() {
		return this.getClickable().selected; // Object
	},
	setCanvasCoordinates: function(location) { // point as Point
		this.getGraphics().canvasCoordinates = location;
		return true; // boolean
	},
	getCanvasCoordinates: function() {
		return this.getGraphics().canvasCoordinates; // point as Point
	},
	translateCanvasCoordinates: function(offset) { // vector as Point
		return this.setCanvasCoordinates(this.getCanvasCoordinates().add(offset));
	},
	refreshGraphics: function() {
		return true;
	},
	refreshParentEntityGraphics: function(universe) { // Universe
		if (typeof(this.properties.parentEntity) !== "undefined") {
			this.properties.parentEntity.refreshGraphics(universe);
		}
	},
	refreshCanvasPosition: function() {
		return true;
	},
	
	// Handles mouse events
	setHovered: function() {
		this.getHovered().group.visible = true;
	},
	setUnhovered: function() {
		this.getHovered().group.visible = false;
	},
	setSelected: function() {
		this.getSelected().group.visible = true;
	},
	setUnselected: function() {
		this.getSelected().group.visible = false;
	},
	setUntouched: function() {
		this.setUnhovered();
		this.setUnselected();
	}
});

// Models any solid object in the universe
// TODO: determine how to store the solid object
var SolidEntity = new Class({
	Extends: Entity,
	
	initialize: function(properties, universe) { // Object, Universe
		// Send up to parent
		this.parent(properties, universe);
		// Initialize solid-specific properties container
		this.properties.solid = new Object();
		// Handle solid-specific constants
		this.getType().push("Solid");
		// Handle line-segment-specific constants
		this.setSolid(properties.solid.solid);
	}
});

// TODO: add object for measuring distances
