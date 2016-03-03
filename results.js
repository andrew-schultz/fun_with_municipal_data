// $(document).ready(function(){
// 	var tables = [
// 		"B01001", //age by sex
// 		"B14001", //current enrollment by age education
// 		"B19001", //household income 1 year
// 		"B02001"  //race
// 		];

// 	$("#map").on('click', function(){
// 		console.log(thing);

// 		// this should grab the location id of the selected borough from the map
// 		var location = $('#map').val();
// 		// console.log(thing);
// 		console.log(location);
// 		startIt(location);
// 	 });
// 		function startIt(loc){
// 			if(loc == ""){
// 				console.log('error');
// 			} else {
// 				// clears off the old graphs so we don't get duplicates
// 				clear();

// 				var location = loc
// 				// define a variable for the tables loop
// 				var table = tables[0];

// 				//checks to see if a value has been assigned to the location variable
// 				if(location == null){
// 					console.log(error);
// 				} else {
// 				// titleIt(location, table);
// 			};
		
// 			function titleIt(loc, t){	
// 				d3.json("http://api.censusreporter.org/1.0/data/show/latest?table_ids=" + t + "&geo_ids="+loc, function(error,response) {
// 					var locationN = response.geography[loc]['name'];
// 					console.log(locationN);
// 					$('#locationName').animate({
// 						left: '-25%',
// 					});
// 					$('#locationName').append("<h2>" + locationN + "</h2>");
// 					$('#selectedBoroughs').prepend("<p id='bName'>" + locationN.toUpperCase() + "</p>");
					
// 				});
// 			};


// 		for(var x = 0; x < locations.length; x++){
// 			for(var i = 0; i < tables.length; i++){
// 				var table = tables[i];
// 				var location = locations[x]
				
// 				// calls function that finds the location of the first table and posts it to the page
// 				chartIt(location, table);
				
// 				function chartIt(loc, t){

// 					// queries the census api with the current location and table
// 					d3.json("http://api.censusreporter.org/1.0/data/show/latest?table_ids=" + t + "&geo_ids=" +loc, function(error,response) {
// 				  	var data = response.data[loc][t].estimate;
				  
// 					keyArray = [];
// 					valueArray = [];
// 					for (value in data) {
// 					    if (data.hasOwnProperty(value)) {
// 					        valueArray.push(data[value]); 
// 					        // Push the key's value on the array
// 					    }
// 					}
// 					// sets a variable for the titles of the graphs
// 				  	var title = response.tables[t].title;

// 				  	// sets a variable for the bar labels
// 					var labels = response.tables[t].columns;

// 				  	for (key in labels) {
// 				  		keyArray.push(labels[key]['name']);
// 				  	}

// 					// create an empty dataset array variable for d3
// 					var dataset = [];

// 					// loop through keyArray (array of keys) and valueArray(array of values) to create object instances
// 					for(var i = 1; i < keyArray.length; i++){
// 						var item = new Object();
// 							item.key = keyArray[i];
// 							item.value = valueArray[i];
// 							dataset.push(item);
// 					};

// 					console.log(dataset);
// 					// calls the function that actually builds the charts
// 					visualizeIt(dataset, title);

// 					});
// 				};
// 			};
// 		};	
// 	};
// 	// this function constructs the charts
// 	function visualizeIt(ds, ti) {
// 		// set a variable the longest chart column label, to be used for defining the length of the area alloted for labels
// 		var bot = d3.max(ds, function(d) {return d.key.length; } );

// 		// sets the margins for the svg
// 		var margin = {
// 			top: 70, 
// 			right: 200, 
// 			bottom: (bot + 20),
// 			left: 60
// 		};
		
// 		var width = 860;
// 		var height = 550 - margin.top - margin.bottom;
// 		var w = width;
// 		var h = height;
		
// 		//Create the SVG element
		
// 		var svg = d3.select("#graph")
// 			.append("svg")
// 			.attr("class", "svg")
// 			.attr("width", w + margin.left + margin.right)
// 			.attr("height", h + margin.top + margin.bottom)
			
// 		//Define the X scale
// 		var xScale = d3.scale.ordinal()
// 			.domain(ds.map(function (d){return d.key;}))
// 			.rangeRoundBands([margin.left, (w - margin.left)], 0.05);

// 		//Define the X Axis
// 		var xAxis = d3.svg.axis()
// 			.scale(xScale)
// 			.orient("bottom");

// 		//Define the Y Scale
// 		var yScale = d3.scale.linear()
// 			.domain([0, d3.max(ds, function(d) {return d.value; } )])
// 			.range([h, margin.top]);

// 		//Define the Y Axis
// 		var yAxis = d3.svg.axis()
// 			.scale(yScale)
// 			.orient("left");

// 		// creates bars
// 		bars = svg.selectAll("rect").data(ds);
		
// 		// add new bars
// 		bars.enter()
// 			.append("rect")
// 			.attr("x", function(d, i) { 
// 				return xScale(d.key); 
// 			})
// 			.attr("y", function(d) {
// 				return yScale(d.value);
// 			})
// 			.attr("width", xScale.rangeBand())
// 			.attr("height", function(d) {
// 				return h - yScale(d.value);
// 			})
// 			.attr("fill", "#024E83");

// 		// display popups when you scroll over a bar
// 		bars.on("mouseover", function(d){

// 			svg.append("text")
// 				.attr("id", "info");

// 			// get the x and y positions for the popup in question
// 			var xPos = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand()/2;
// 			var yPos = parseFloat(d3.select(this).attr("y")) + 18;
			
// 			// add the actual info
// 			svg.select("#info")
// 				.attr("x", xPos)
// 				.attr("y", function(){
// 					// if the bar is very small, diplay the tooltip above it instead of trying to cram it inside
// 					var x = d3.max(ds, function(d) { return d.value; });
// 					if (d.value < 0.1 * x) {
// 						return yPos - 22;
// 					} else {
// 						return yPos;
// 					};
// 				})
// 				.attr("text-anchor", "middle")
// 				.style("font-family", "Avenir")
// 				.attr("fill", function(){
// 					// change the color of the info based on where it's going to be displayed(if the value is small, make it a darker color since it'll be on the white background)
// 					var x = d3.max(ds, function(d) { return d.value; });
// 					if (d.value < 0.1 * x) {
// 						return "#2B3E42";
// 					} else {
// 						return "#2B3E42";
// 					};
// 				})
// 				.attr("font-size", "12px")
// 				.text(d.value);

// 			svg.append("text")
// 				.attr("id", "bigBarLabel")

// 			svg.select("#bigBarLabel")
// 				.attr("x", (w / 2))
// 				.attr("y", 80)
// 				.attr("text-anchor", "middle")
// 				.style("font-family", "Avenir")
// 				.attr("fill", "#2B3E42")
// 				.attr("font-size", "20px")
// 				.text(d.key);

// 		})
// 		.on("mouseout", function(){
// 			d3.select("#info").remove();
// 			d3.select("#bigBarLabel").remove();
// 		});
			

// 		// draw the X axis
// 		svg.append("g")
// 			.attr("class", "xaxis")
// 			.attr("transform", "translate(0," + h + ")")
// 			.call(xAxis)
// 			.selectAll("text")
// 			.style("text-anchor", "end")
// 			.style("font-family", "Avenir")
// 			.attr("dx", "-.8em")
// 			.attr("dy", ".15em")
// 			.attr("transform", "rotate(-65)")
// 			// if the label is over 15 characters long, take the first 15 characters and add a '...' 
// 			.text(function(d){
// 				if(d.length > 15){
// 					return d.substr(0, 15) + "...";
// 				} else {
// 					return d;
// 				}
// 			});

// 		// add the X axis label
// 		svg.append("text")
// 			.attr("class", "xaxislabel graphlabel")
// 			.attr("text-anchor", "middle")
// 			.attr("transform", "translate(" + (w/2) + "," + (h + (margin.bottom / 2) + 60) + ")")
// 			// .text("Educational Level");

// 		// add Y Axis label
// 		svg.append("text")
// 			.attr("class", "yaxislabel graphlabel")
// 			.attr("text-anchor", "middle")
// 			.attr("transform", "translate(15," + (h / 2) + ")rotate(-90)")
// 			// .text("Number of People Enrolled");

// 		// add Title for chart
// 		svg.append("text")
// 			.attr("class", "chartTitle graphlabel")
// 			.attr("text-anchor", "middle")
// 			.attr("transform", "translate(" + ((w/2)+ 215) + ", 20)")
// 			.style("font-family", "Avenir")
// 			.text(ti.toUpperCase());

// 	}

// });

			
	var tables = [
		"B01001", //age by sex
		"B14001", //current enrollment by age education
		"B19001", //household income 1 year
		"B02001"  //race
		];

	$("#map").on('click', function(){
		console.log(thing);

		// this should grab the location id of the selected borough from the map
		var location = $('#map').val();
		// console.log(thing);
		console.log(location);
		startIt(location);
	 });
		function startIt(loc){
			if(loc == ""){
				console.log('error');
			} else {
				// clears off the old graphs so we don't get duplicates
				clear();

				var location = loc
				// define a variable for the tables loop
				var table = tables[0];

				//checks to see if a value has been assigned to the location variable
				if(location == null){
					console.log(error);
				} else {
				// titleIt(location, table);
			};
		
			function titleIt(loc, t){	
				d3.json("http://api.censusreporter.org/1.0/data/show/latest?table_ids=" + t + "&geo_ids="+loc, function(error,response) {
					var locationN = response.geography[loc]['name'];
					console.log(locationN);
					$('#locationName').animate({
						left: '-25%',
					});
					$('#locationName').append("<h2>" + locationN + "</h2>");
					$('#selectedBoroughs').prepend("<p id='bName'>" + locationN.toUpperCase() + "</p>");
					
				});
			};


		for(var x = 0; x < locations.length; x++){
			for(var i = 0; i < tables.length; i++){
				var table = tables[i];
				var location = locations[x]
				
				// calls function that finds the location of the first table and posts it to the page
				chartIt(location, table);
				
				function chartIt(loc, t){

					// queries the census api with the current location and table
					d3.json("http://api.censusreporter.org/1.0/data/show/latest?table_ids=" + t + "&geo_ids=" +loc, function(error,response) {
				  	var data = response.data[loc][t].estimate;
				  
					keyArray = [];
					valueArray = [];
					for (value in data) {
					    if (data.hasOwnProperty(value)) {
					        valueArray.push(data[value]); 
					        // Push the key's value on the array
					    }
					}
					// sets a variable for the titles of the graphs
				  	var title = response.tables[t].title;

				  	// sets a variable for the bar labels
					var labels = response.tables[t].columns;

				  	for (key in labels) {
				  		keyArray.push(labels[key]['name']);
				  	}

					// create an empty dataset array variable for d3
					var dataset = [];

					// loop through keyArray (array of keys) and valueArray(array of values) to create object instances
					for(var i = 1; i < keyArray.length; i++){
						var item = new Object();
							item.key = keyArray[i];
							item.value = valueArray[i];
							dataset.push(item);
					};

					console.log(dataset);
					// calls the function that actually builds the charts
					visualizeIt(dataset, title);

					});
				};
			};
		};	
	};