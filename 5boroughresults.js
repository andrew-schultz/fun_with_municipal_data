var tables = [
	"B01001", //age by sex
	"B14001", //current enrollment by age education
	"B19001", //household income 1 year
	"B02001"  //race
	];

var locations = [
	"06000US3600508510",
	"06000US3604710022",
	"06000US3606144919",
	"06000US3608160323",
	"06000US3608570915"
];

	// var location = locations[0];
	// // define a variable for the tables loop
	// var table = tables[0];
	
	var rData = [];
	var asData = [];
	var eduData = [];
	var incData = [];
	var allData = [];

	for(var x = 0; x < locations.length; x++){
		var loc = locations[x]
		for(var i = 0; i < tables.length; i++){
			var table = tables[i];

			// calls function that finds the location of the first table and posts it to the page
			makeData(loc, table);
		

			function makeData(loc, t){

				// queries the census api with the current location and table
				d3.json("http://api.censusreporter.org/1.0/data/show/latest?table_ids=" + t + "&geo_ids=" +loc, function(error,response) {
				  	var data = response.data[loc][t].estimate;
					keyArray = [];
					valueArray = [];

					var locationN = response.geography[loc]['name'];

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
							item.boro = locationN;
							dataset.push(item);
					};
					buildIt(dataset, t);
				});
				function buildIt(data, loc){
					if(t == "B01001"){
						asData.push(data);
					} else if(t == "B14001"){
						eduData.push(data);
					} else if(t == "B19001"){
						incData.push(data);
					} else if(t == "B02001"){
						rData.push(data);
					} else {
						console.log('error');
					};
					measureIt(asData, eduData, incData, rData);
				};
			};
		};

		function measureIt(as, edu, inc, r){
			if((r.length == 4) && (as.length == 4) && (edu.length == 4) && (inc.length == 4)){
				var age = as;
				var edu = edu;
				var income = inc;
				var race = r;

				graphIt(age, edu, income, race);
			} else {
				console.log('error, something is amiss');
			};
		};

		function graphIt(as, edu, inc, r){
			console.log(as);
			console.log(edu);
			console.log(inc);
			console.log(r);

			var allData = [as, edu, inc, r];

			for(data in allData){
			// set a variable the longest chart column label, to be used for defining the length of the area alloted for labels
			// var bot = d3.max(ds, function(d) {return d.key.length; } );
			console.log(data[0]);
			// sets the margins for the svg
				var margin = {
					top: 70, 
					right: 200, 
					bottom: (70),
					left: 60
				};
				
				var width = 860;
				var height = 550 - margin.top - margin.bottom;
				var w = width;
				var h = height;

				var x0 = d3.scale.ordinal()
					.rangeRoundBands([0, width], .1);

				var x1 = d3.scale.ordinal();

				var y = d3.scale.linear()
					.range([height, 0]);

				var color = d3.scale.ordinal()
					.range(["#F6776A", "#024E83", "#97DCDD", "#DC4032", "#78C652"]);

				var xAxis = d3.svg.axis()
					.scale(x0)
					.orient("bottom");

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left")
					.tickFormat(d3.format(".2s"));

				var svg = d3.select("#results")
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var labelNames = d3.keys(data[0[0]]['key']);
				console.log(labelNames)
				data.forEach(function(d) {
					d.labels = labelNames.map(function(l) { return {l: l, value: +d[l]}; });

				x0.domain(data.map(function(d) { return d.Label; }));
				x1.domain(labelNames).rangeRoundBands([0, x0.rangeBand()]);
				y.domain([0, d3.max(data, function(d) { return d3.max(d.labels, function(d) { return d.value; }); })]);

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				var label = svg.selectAll(".Label")
					.data(data)
					.enter()
					.append("g")
					.attr("class", "label")
					.attr("transform", function(d) { return "translate(" + x0(data.d.Label) + ",0)"; });

				label.selectAll("rect")
					.data(function(d) { return d.value;});

				});
			};
		};
	};	