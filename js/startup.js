$LAB.setGlobalDefaults({
	CacheBust: true
});

// Initial Scripts
$LAB.script("js/libs/modernizr/modernizr.js").wait(function() {
	jQuery("#loadingProgressBarContent").width("40%");
});
$LAB.script("js/libs/javascript-debug/ba-debug.js").wait(function() {
	debug.info("Logger initialized");
});
/*$LAB.script("js/libs/stats.js/build/Stats.js").wait(function() {
	debug.info("Stats.js initialized");
})
	.script("js/script.js");*/
$LAB.script("//static.getclicky.com/js").wait(function() {
	try{
		clicky.init(66563347);
	} catch(e) {}
});

// Modeling Scripts
$LAB.script("js/libs/mootools/mootools-core-1.4.5-full-nocompat.js")/*
	.script("js/libs/mootools/mootools-more-1.4.0.1.js")*/.wait(function() {
		jQuery("#loadingProgressBarContent").width("60%");
		debug.info("Finished loading MooTools");
	})
	.script("js/em-entities/entities.js").wait()
	.script("js/em-entities/point-entities.js")
	.script("js/em-entities/linear-entities.js").wait()
	.script("js/em-entities/e-entities.js").wait()
	.script("js/em-entities/standard-model-particles.js")
	.script("js/em-entities/e-probes.js")
	.script("js/em-universe/em-universe.js").wait(function() {
		jQuery("#loadingProgressBarContent").width("65%");
		debug.info("Finished loading core classes");
	});
$LAB.script("js/libs/paper.js/dist/paper.js")
    .script("js/libs/sylvester/lib/sylvester-min.js").wait(function() {
		jQuery("#loadingProgressBarContent").width("90%");
		debug.info("Finished loading paper.js");
	})
	.script("js/canvas/canvas.js")
	.script("js/canvas/canvas-tools.js")
	.script("js/canvas/canvas-tools-actions.js").script("js/canvas/canvas-animations.js").wait(function() {
		debug.info("Set the canvas");
		jQuery("#loadingProgressBarContent").width("100%");
		jQuery("#launchButton").button("reset");
		//jQuery("#loadingProgressBar").hide("slow");
	});