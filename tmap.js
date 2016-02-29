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
			
			d3.json("https://maps.googleapis.com/maps/api/geocode/json?address=" + group[i] + "&components=administrative_area:NY&key=AIzaSyAa-qYzg4MO0srP1OdmsdN2hAqzMJhPBXo", function(error, response){
				
				var coords = [];
				var addresses = [];
				var addr = response;
				for(var q = 0; q < addr.length; q++){
					coords.push(addr[q].results[0].geometry.location);
					addresses.push(addr[q].results[0].formatted_address);
				}
				console.log(coords);
				console.log(addresses);
				var markers = [];
				for (var x = 0; x < coords.length; x++){
					var item = new Object();
						item.address = addresses[x];
						item.geo = coords[x];
						markers.push(item);
				};
			console.log(markers);
			});
		};`
	};
});
