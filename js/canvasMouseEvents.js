// Get a reference to the canvas object
paper.install(window);
var canvas = document.getElementById('myCanvas');
// Create an empty project and a view for the canvas:
paper.setup(canvas);
debug.info("Set up canvas view of", view.viewSize);

// TODO: Add proper onResize handler

// Set up tools
//// Tool to select and move entities
/*var hitOptions = {
	fill: true,
	stroke: true,
	segment: true,
	tolerance: 5
};
for (var i = 0; i < 20; i++) {
    var randomPoint = view.size * Point.random()
    var path = new Path.Circle(randomPoint, 30);
    path.style = {
        fillColor: 'white',
        strokeColor: 'black'
    };
    var label = new PointText(randomPoint.add(new Point(30, -30)));
    label.fillColor = "white";
    label.content = "circle " + i + "!";
    var clickable = new Group([path]);
    var group = new Group([clickable, label]);
}

var group;
function onMouseDown(event) {
    group = null;
    var hitResult = project.hitTest(event.point, hitOptions);

    if (hitResult) {
        group = hitResult.item.parent.parent;
    }
    project.activeLayer.addChild(hitResult.item.parent.parent);
}

function onMouseMove(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    project.activeLayer.selected = false;
    if (hitResult && hitResult.item.parent.parent)
        hitResult.item.parent.parent.selected = true;
}

function onMouseDrag(event) {
    group.position += event.delta;
}*/
/*var selectAndMove = new Tool();
var group;
selectAndMove.onMouseDown = function(event) {
	var hitResult = project.hitTest(event.point, hitOptions);
	debug.debug("mouse down", hitResult);
	project.activeLayer.selected = false;
	if (hitResult && hitResult.item.parent.parent) {
		debug.debug("mouse moved onto something!");
		hitResult.item.selected = true;
	}
};*/

var hitOptions = {
	fill: true,
	stroke: true,
    segment: true,
    tolerance: 5
};
for (var i = 0; i < 20; i++) {    
    var randomPoint = view.size.multiply(Point.random());
    var path = new Path.Circle(randomPoint, 30);
    path.style = {
        fillColor: 'white',
        strokeColor: 'black'
    };
    
    var label = new PointText(randomPoint.add(new Point(30, -30)));
    label.fillColor = "white";
    label.content = "circle " + i + "!";
    
    var clickable = new Group([path]);
    var group = new Group([clickable, label]);
}

var group;
var moveGroup = false;
var tool = new Tool();
tool.onMouseDown = function(event) {
    group = null;
    var hitResult = project.hitTest(event.point, hitOptions);

    if (hitResult) {
        group = hitResult.item.parent.parent;
    }
    moveGroup = hitResult.type == 'fill';
    if (moveGroup)
        project.activeLayer.addChild(group);
};

tool.onMouseMove = function(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    project.activeLayer.selected = false;
    if (hitResult && hitResult.item.parent)
        hitResult.item.parent.selected = true;
};

tool.onMouseDrag = function(event) {
    if (moveGroup)
        group.position = group.position.add(event.delta);
};