$LAB.setGlobalDefaults({
	AllowDuplicates: false,
	CacheBust: true
});

// Initial Scripts
$LAB.script("js/libs/modernizr/modernizr.js");
$LAB.script("js/libs/javascript-debug/ba-debug.js");
$LAB.script("//static.getclicky.com/js").wait(function() {
	try{
		clicky.init(66563347);
	} catch(e) {}
});

// jQuery Scripts
$LAB.script("js/libs/jquery/dist/jquery.js").wait()
	.script("js/libs/bootstrap/transition.js")
	.script("js/libs/bootstrap/collapse.js");

// Modeling Scripts
$LAB.script("js/libs/paper.js/dist/paper.js")
	.script("js/libs/mootools/mootools-core-1.4.5-full-nocompat.js")
	.script("js/libs/mootools/mootools-more-1.4.0.1.js").wait()
	.script("js/em-entities/em-entities.js");