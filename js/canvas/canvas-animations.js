var canvasAnimationsSupport = {
	data: {
		canvasAnimations: new Array(),
		canvasAnimationsToRemove: new Array()
	},
	zoomAnimatedly: function(targetZoom, stepCount, duration) {
		var zoomAnimation = {
			stepSize: (targetZoom - currentUniverse.getCanvasZoomExponent()) / stepCount,
			animationDuration: duration,
			stepDuration: duration / stepCount,
			numberOfStepsRemaining: stepCount,
			lastUpdateTime: 0,
			shouldUpdate: function(event) {
				return (event.time - this.lastUpdateTime) > this.stepDuration;
			},
			update: function(event) {
				currentUniverse.setCanvasZoomExponent(currentUniverse.getCanvasZoomExponent() + this.stepSize);
				currentUniverse.refreshCanvasPositions(currentUniverse);
				this.numberOfStepsRemaining--;
				this.lastUpdateTime = event.time;
			},
			shouldRemoveAnimation: function(event) {
				return this.numberOfStepsRemaining == 0;
			}
		};
		debug.debug(zoomAnimation);
		this.data.canvasAnimations.push(zoomAnimation);
	}
};

view.onFrame = function(event) {
	canvasAnimationsSupport.data.canvasAnimations.forEach(function(animation) {
		if (animation.shouldUpdate(event)) {
			debug.debug("time to update!");
			animation.update(event);
		}
		if (animation.shouldRemoveAnimation(event)) {
			debug.debug("time to remove!");
			canvasAnimationsSupport.data.canvasAnimationsToRemove.push(animation);
		}
	});
	if (canvasAnimationsSupport.data.canvasAnimationsToRemove.length > 0) {
		canvasAnimationsSupport.data.canvasAnimationsToRemove.forEach(function(animation) {
			canvasAnimationsSupport.data.canvasAnimations.erase(animation);
		});
		canvasAnimationsSupport.data.canvasAnimationsToRemove.empty();
	}
}
