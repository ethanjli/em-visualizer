var Animation = new Class({
	initialize: function() {
		this.properties = new Object();
	},
	
	shouldUpdate: function(event) {
		return false;
	},
	update: function(event) {
		
	},
	
	shouldRemove: function(event) {
		return true;
	}
});

var ConstantStepAnimation = new Class({
	Extends: Animation,
	
	initialize: function(properties) {
		// Send up to parent
		this.parent(properties);
		// Handle constantstepanimation-specific variables
		this.properties.animationDuration = properties.animationDuration;
		this.properties.stepDuration = properties.animationDuration / properties.stepCount;
		this.properties.numberOfStepsRemaining = properties.stepCount;
		this.properties.lastUpdateTime = 0;
		this.properties.stepSize = 0;
	},
	
	shouldUpdate: function(event) {
		return (event.time - this.properties.lastUpdateTime) > this.properties.stepDuration;
	},
	update: function(event) {
		this.properties.numberOfStepsRemaining--;
		this.properties.lastUpdateTime = event.time;
	},
	
	shouldRemove: function(event) {
		return this.properties.numberOfStepsRemaining == 0;
	}
});

var LinearZoomAnimation = new Class({
	Extends: ConstantStepAnimation,
	
	initialize: function(properties) {
		// Send up to parent
		this.parent(properties);
		// Handle zoomanimation-specific variables
		this.properties.stepSize = (properties.targetZoom - currentUniverse.getCanvasZoomExponent()) / properties.stepCount;
	},
	
	update: function(event) {
		// Send up to parent
		this.parent(event);
		currentUniverse.setCanvasZoomExponent(currentUniverse.getCanvasZoomExponent() + this.properties.stepSize);
		currentUniverse.refreshCanvasPositions(currentUniverse);
		currentUniverse.resetObservedUniverseData(currentUniverse);
	}
});

var LinearPanAnimation = new Class({
	Extends: ConstantStepAnimation,
	
	initialize: function(properties) {
		// Send up to parent
		this.parent(properties);
		// Handle pananimation-specific variables
		this.properties.stepSize = properties.locationOffset.multiply(1 / properties.stepCount);
	},
	
	update: function(event) {
		// Send up to parent
		this.parent(event);
		currentUniverse.translateCenterOfCanvas(currentUniverse.findUniverseCoordinatesOffset(this.properties.stepSize));
		currentUniverse.refreshCanvasPositions(currentUniverse);
		currentUniverse.refreshObservedUniverseData(currentUniverse);
	}
});

var LinearScaleVectorsAnimation = new Class({
	Extends: ConstantStepAnimation,
	
	initialize: function(properties) {
		// Send up to parent
		this.parent(properties);
		// Handle pananimation-specific variables
		this.properties.stepSize = (properties.targetScale - currentUniverse.getVectorScalingExponent()) / properties.stepCount;
	},
	
	update: function(event) {
		// Send up to parent
		this.parent(event);
		currentUniverse.setVectorScalingExponent(currentUniverse.getVectorScalingExponent() + this.properties.stepSize);
		currentUniverse.refreshProbeGraphics(currentUniverse);
	}
});

var canvasAnimationsSupport = {
	data: {
		canvasAnimations: new Array(),
		canvasAnimationsToRemove: new Array()
	},
	activeOnFrameHandler: function(event) {
		canvasAnimationsSupport.data.canvasAnimations.forEach(function(animation) {
			if (animation.shouldUpdate(event)) {
				animation.update(event);
			}
			if (animation.shouldRemove(event)) {
				canvasAnimationsSupport.data.canvasAnimationsToRemove.push(animation);
			}
		});
		if (canvasAnimationsSupport.data.canvasAnimationsToRemove.length > 0) {
			canvasAnimationsSupport.data.canvasAnimationsToRemove.forEach(function(animation) {
				canvasAnimationsSupport.data.canvasAnimations.erase(animation);
			});
			canvasAnimationsSupport.data.canvasAnimationsToRemove.empty();
		}
		if (canvasAnimationsSupport.data.canvasAnimations.length == 0) {
			delete view.onFrame;
		}
	},
	zoom: function(targetZoom, stepCount, animationDuration) {
		if (typeof(view.onFrame) == "undefined") {
			view.onFrame = this.activeOnFrameHandler;
		}
		var zoomAnimation = new LinearZoomAnimation({
			targetZoom: targetZoom,
			stepCount: stepCount,
			animationDuration: animationDuration
		});
		this.data.canvasAnimations.push(zoomAnimation);
	},
	pan: function(locationOffset, stepCount, animationDuration) {
		if (typeof(view.onFrame) == "undefined") {
			view.onFrame = this.activeOnFrameHandler;
		}
		var panAnimation = new LinearPanAnimation({
			locationOffset: locationOffset,
			stepCount: stepCount,
			animationDuration: animationDuration
		});
		this.data.canvasAnimations.push(panAnimation);
	},
	scaleVectors: function(targetScale, stepCount, animationDuration) {
		if (typeof(view.onFrame) == "undefined") {
			view.onFrame = this.activeOnFrameHandler;
		}
		var scaleAnimation = new LinearScaleVectorsAnimation({
			targetScale: targetScale,
			stepCount: stepCount,
			animationDuration: animationDuration
		});
		this.data.canvasAnimations.push(scaleAnimation);
	}
};
