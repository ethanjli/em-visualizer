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
		canvasZoom: Math.log(500)
	},
	text: {
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
antiProtonPreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First Proton",
	point: {
		location: Vector.create([-0.5, 0.2])
	}
};
currentUniverse.addEntity(new AntiProton(antiProtonPreset, currentUniverse));
eMagnitudeProbePreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First E Magnitude Probe",
	point: {
		location: Vector.create([0, 0.2])
	}
};
currentUniverse.addEntity(new EFieldMagnitude(eMagnitudeProbePreset, currentUniverse));
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
