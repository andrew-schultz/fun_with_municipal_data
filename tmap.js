
var MapboxClient = require('mapbox');
var client = new MapboxClient('pk.eyJ1IjoiYXMxNzMxNzEiLCJhIjoiY2lsNDR6bWdwM3cxb3Z5bTNvbmtmeTJsbiJ9.16HxpvRVaoKgLOBG9L-Quw');

d3.json("https://data.cityofnewyork.us/resource/b2sp-asbg.json?", function(error, response){
	var healthcenters = response;
	var health_address = response.center_address;
});

map_markers(health_address);

var f = client.geocodeForward("https://api.mapbox.com/geocoding/v5/mapbox.places/1600+pennsylvania+ave+nw.json?access_token=pk.eyJ1IjoiYXMxNzMxNzEiLCJhIjoiY2lrdDljeGNjMDAybHZvbTNhZDFoaXliNSJ9.SvzsJFUNo8uBXrtclVlywA");
console.log(f)

function map_markers(group){
	var hcenters = [];
	for(centers in group){
		// d3.json("https://api.mapbox.com/geocoding/v5/mapbox.places/" + centers + ".json?proximity=-73.977800,40.715824&access_token=pk.eyJ1IjoiYXMxNzMxNzEiLCJhIjoiY2lsNDR6bWdwM3cxb3Z5bTNvbmtmeTJsbiJ9.16HxpvRVaoKgLOBG9L-Quw", function(response) {
			
			client.geocodeForward(centers, function(err, res){
				hcenters.push(res);
			})
		};
	};
	console.log(hcenters);


