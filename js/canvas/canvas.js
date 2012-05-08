// Get a reference to the canvas object
paper.install(window);
var canvas = document.getElementById('myCanvas');
// Create an empty project and a view for the canvas:
paper.setup(canvas);
debug.info("Set up canvas view of", view.viewSize);

var currentUniverse = new Universe({
	id: 0,
	name: "Test Universe",
	physicalConstants: {
		vacuumPermittivity: 1.0 / (4 * Math.PI * Math.pow(10, -7) * Math.pow(299792458, 2)),
		vacuumPermeability: 4 * Math.PI * Math.pow(10, -7)
	},
	graphics: {
		locationOfCenterOfCanvas: Vector.create([0, 0]),
		canvasZoom: 2,
		vectorScaling: 9
	},
	text: {
		typeface: "Segoe UI",
		fontSize: 10,
		decimalPrecision: 5,
		decimalEpsilonPrecision: 10
	}
});
entity0Preset = {
	id: currentUniverse.getNextEntityId(),
	name: "Second Location",
	point: {
		location: Vector.create([0, 0.4])
	}
};
currentUniverse.addEntity(new UniverseLocation(entity0Preset, currentUniverse));
entity1Preset = {
	id: currentUniverse.getNextEntityId(),
	name: "Third Location",
	point: {
		location: Vector.create([0, -0.4])
	}
};
currentUniverse.addEntity(new UniverseLocation(entity1Preset, currentUniverse));
electronPreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First Electron",
	point: {
		location: Vector.create([0.5, 0.2])
	}
};
currentUniverse.addEntity(new Electron(electronPreset, currentUniverse));
protonPreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First Proton",
	point: {
		location: Vector.create([-0.5, 0.2])
	}
};
currentUniverse.addEntity(new Proton(protonPreset, currentUniverse));
eMagnitudeProbePreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First E Magnitude Probe",
	point: {
		location: Vector.create([0, 0.2])
	}
};
currentUniverse.addEntity(new EFieldMagnitude(eMagnitudeProbePreset, currentUniverse));
eFieldVectorProbePreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First E Field Probe",
	point: {
		location: Vector.create([-0.2, 0])
	}
};
currentUniverse.addEntity(new EFieldVector(eFieldVectorProbePreset, currentUniverse));
eFieldDirectionProbePreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First E Field Direction Probe",
	point: {
		location: Vector.create([0, -0.2])
	}
};
currentUniverse.addEntity(new EFieldDirection(eFieldDirectionProbePreset, currentUniverse));
ePotentialProbePreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First E Potential Probe",
	point: {
		location: Vector.create([0.2, 0])
	}
};
currentUniverse.addEntity(new EPotential(ePotentialProbePreset, currentUniverse));
debug.debug("Test universe now looks like", currentUniverse);

// Set up view
view.onFrame = function(event) {
	//currentUniverse.getEntity(2).updateLocationByOffset(new Point(5, 5), currentUniverse);
};
// TODO: Add proper onResize handler
