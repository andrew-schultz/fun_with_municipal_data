	// var daMap = document.getElementById("map").id;
	// console.log(daMap);

	mapboxgl.accessToken = 'pk.eyJ1IjoiYXMxNzMxNzEiLCJhIjoiY2lsNDR6bWdwM3cxb3Z5bTNvbmtmeTJsbiJ9.16HxpvRVaoKgLOBG9L-Quw';

	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'mapbox://styles/as173171/ciku69e5q009998kmnudm6j2e', //hosted style id
			center: [-73.977800, 40.715824], // starting position
			zoom: 10, // starting zoom
	});

	// disable zooming on scroll, makes it easier to navigate around the page without accidentally zooming way out or way in
	map.scrollZoom.disable();
	map.on('click', function(data) {
	  var e = data && data.originalEvent;
	  console.log('got click ' + (e ? 'button = ' + e.button : ''));
	});
