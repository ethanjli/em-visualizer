var stats = new Stats();

// Align top-left
stats.getDomElement().style.position = 'absolute';
stats.getDomElement().style.left = '40px';
stats.getDomElement().style.top = '80px';

document.body.appendChild( stats.getDomElement() );

setInterval( function () {

    stats.update();

}, 1000 / 60 );
