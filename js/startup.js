$LAB.setGlobalDefaults({
	CacheBust: true
});

// Initial Scripts
$LAB.script("js/libs/modernizr/modernizr.js");
$LAB.script("js/libs/javascript-debug/ba-debug.js").wait(function() {
	debug.info("Logger initialized");
});
$LAB.script("js/libs/stats.js/build/Stats.js").wait(function() {
	debug.info("Stats.js initialized");
})
	.script("js/script.js");
$LAB.script("//static.getclicky.com/js").wait(function() {
	try{
		clicky.init(66563347);
	} catch(e) {}
});

// jQuery Scripts
/*$LAB.script("js/libs/jquery/dist/jquery.js").wait()
	.script("js/libs/bootstrap/transition.js")
	.script("js/libs/bootstrap/collapse.js");*/

// Modeling Scripts
$LAB.script("js/libs/sylvester/lib/sylvester-min.js")
	.script("js/libs/paper.js/dist/paper.js").wait(function() {
		debug.info("Finished loading paper.js and sylvester");
	})
	.script("js/libs/mootools/mootools-core-1.4.5-full-nocompat.js")/*
	.script("js/libs/mootools/mootools-more-1.4.0.1.js")*/.wait(function() {
		debug.info("Finished loading MooTools");
	})
	.script("js/em-entities/entities.js").wait()
	.script("js/em-entities/e-entities.js").wait()
	.script("js/em-entities/standard-model-particles.js")
	.script("js/em-entities/e-probes.js")
	.script("js/em-universe/em-universe.js").wait(function() {
		debug.info("Finished loading core classes");
	})
	.script("js/canvas/canvas.js").wait(function() {
		debug.info("Started up the canvas");
	})
	.script("js/canvas/canvas-tools.js")
	.script("js/canvas/canvas-tools-actions.js").wait(function() {
		debug.info("Set up mouse and keyboard tools");
	}).script("js/canvas/canvas-animations.js").wait(function() {
		debug.info("Set up animations");
	});