$(document).ready(function(){

	d3.json("https://data.cityofnewyork.us/resource/b2sp-asbg.json?", function(error, response){
		var healthcenters = response;
		var health_address = [];
		for(var i = 0; i < healthcenters.length; i++){
			var str = healthcenters[i].center_address.replace(/ /g, "+");
			health_address.push(str);
		};
		console.log(health_address);
		map_markers(health_address);
	});

	var map_markers = function(group){

		for(var i = 0; i < group.length; i++){
			var markers = [];
			d3.json("https://maps.googleapis.com/maps/api/geocode/json?address=" + group[i] + "&components=administrative_area:NY&key=AIzaSyAa-qYzg4MO0srP1OdmsdN2hAqzMJhPBXo", function(error, response){
				var addr = response;
				markers.push(addr);
			});
		};
		console.log(markers);
	};
});
