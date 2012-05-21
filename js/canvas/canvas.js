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
		canvasZoom: 3,
		vectorScaling: 9
	},
	text: {
		typeface: "Segoe UI",
		fontSize: 12,
		decimalPrecision: 5,
		decimalEpsilonPrecision: 10
	}
});
location0Preset = {
	id: currentUniverse.getNextEntityId(),
	name: "Second Location",
	point: {
		location: Vector.create([0.4, 0])
	}
};
currentUniverse.addEntity(new UniverseLocation(location0Preset, currentUniverse));
location1Preset = {
	id: currentUniverse.getNextEntityId(),
	name: "Third Location",
	point: {
		location: Vector.create([0.2, -0.2])
	}
};
currentUniverse.addEntity(new UniverseLocation(location1Preset, currentUniverse));
electronPreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First Electron",
	point: {
		location: Vector.create([0.2, 0.2])
	}
};
currentUniverse.addEntity(new Electron(electronPreset, currentUniverse));
protonPreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First Proton",
	point: {
		location: Vector.create([-0.2, 0.2])
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
antiProtonPreset = {
	id: currentUniverse.getNextEntityId(),
	name: "First Antiproton",
	point: {
		location: Vector.create([-0.2, -0.2])
	}
};
currentUniverse.addEntity(new AntiProton(antiProtonPreset, currentUniverse));
XAxisPreset = {
	id: currentUniverse.getNextEntityId(),
	name: "X Axis",
	line: {
		line: Line.X,
		anchor: currentUniverse.getEntity(0)
	}
};
currentUniverse.addEntity(new UniverseAxis(XAxisPreset, currentUniverse));
YAxisPreset = {
	id: currentUniverse.getNextEntityId(),
	name: "Y Axis",
	line: {
		line: Line.Y,
		anchor: currentUniverse.getEntity(0)
	}
};
currentUniverse.addEntity(new UniverseAxis(YAxisPreset, currentUniverse));
Line3Preset = {
	id: currentUniverse.getNextEntityId(),
	name: "Third Line",
	line: {
		/*line: Line.create([0.1, 0], [0.05, -0.1])*/
		anchor: currentUniverse.getEntity(1),
		direction: [0.05, -0.1]
	}
};
currentUniverse.addEntity(new LineEntity(Line3Preset, currentUniverse));
debug.debug("Test universe now looks like", currentUniverse);

// Set up view stuff
view.onResize = function(event) {
	currentUniverse.refreshCanvasPositions(currentUniverse);
	currentUniverse.refreshObservedUniverseData(currentUniverse);
}
// TODO: Add proper onResize handler
