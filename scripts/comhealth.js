$(document).ready(function(){

	$('#map').on('click', function(){
		// this should grab the location id of the selected borough from the map
		var location = $('#map').val();
		console.log(location);
		initialize(location);
	});

	function initialize(loc){
		if(loc == ""){
			console.log('error');
		} else {
			// queries the socrata(nyc) api 
			d3.json("https://data.cityofnewyork.us/resource/b2sp-asbg.json?", function(error, response){
				// sets the api response equal to a variable
				var comHealth = response;
				var boroughs = []

				// loops through the api response and pushes the values '__name_of_borough' to an array
				for (value in comHealth){
					boroughs.push(comHealth[value]['__name_of_borough']);
				};

				// had to set up some helper variables for working with the data
				var bk = 0;
				var bx = 0;
				var si = 0;
				var m = 0;
				var q = 0;
				var bvals = [];

				// loops through boroughs array, counts up each mention of a borough
				for(i in boroughs){
					if(boroughs[i] == "Brooklyn"){
						bk += 1
					} else if (boroughs[i] == "Bronx"){
						bx += 1
					} else if (boroughs[i] == "Queens"){
						q += 1
					} else if (boroughs[i] == "Manhattan"){
						m += 1
					} else {
						si += 1
					};
					
				};
				
				// push the borough count totals to the bvals array
				bvals.push(bx);
				bvals.push(bk);
				bvals.push(m);
				bvals.push(q);
				bvals.push(si);

				var percent = [];
				
				// loops through bvals array, translates the borough counts into percents
				for(i in bvals){
					percent.push(((bvals[i] / boroughs.length) * 100).toFixed(2) + "%");
				};

				// this block filters out all of the duplicates in the boroughs array, leaving us with just the 5 boroughs
				var bor = boroughs.filter(function(x, i){
					return boroughs.indexOf(x) == i;
				});

				var data = [];

				// this block executes a loop for each borough and creates objects from all the data we've been manipulating thus far
				for(var i = 0; i < bor.length; i++){
					var item = new Object();
						item.key = bor[i];
						item.value = bvals[i];
						item.percent = percent[i];
						data.push(item);
				};

				// starts the chart and pie creation functions
				chart_viz(data);
				pie_viz(data);
			});
		};

		function chart_viz(data){
			var margin = {
				top: 30,
				right: 40,
				bottom: 20,
				left: 20,
			}

			var width = 620 - margin.left - margin.right;
			var height = 400 - margin.top;
			var w = width
			var h = height

			var color = d3.scale.ordinal()
				.range(["#F6776A", "#024E83", "#97DCDD", "#DC4032", "#78C652"]);

			var svg = d3.select("#hchart")
				.append("svg")
				.attr("class", "citySvg")
				.attr("width", w + margin.left + margin.right)
				.attr("height", h + margin.top + margin.bottom);

			var xScale = d3.scale.ordinal()
				.domain(data.map(function (d){ return d.key;}))
				.rangeRoundBands([margin.left, w], 0.05);

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom");

			var yScale = d3.scale.linear()
				.domain([0, d3.max(data, function(d) { return d.value; } )])
				.range([h, (margin.top + 40)]);

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");

			bars = svg.selectAll("rect").data(data);

			bars.enter()
				.append("rect")
				.attr("x", function(d, i) {
					return xScale(d.key);
				})
				.attr("y", function(d) {
					return yScale(d.value);
				})
				.attr("width", xScale.rangeBand())
				.attr("height", function(d) {
					return h - yScale(d.value);
				})
				.attr("transform", "translate(20, 0)")
				.attr("fill", function(d) { return color(d.key); });

			bars.on("mouseover", function(d) {
				svg.append("text")
					.attr("id", "info");

				var xPos = parseFloat(d3.select(this).attr("x")) + (xScale.rangeBand()/2 + 20);
				var yPos = parseFloat(d3.select(this).attr("y")) + 18;

				svg.select("#info")
					.attr("x", xPos)
					.attr("y", function(){
						var x = d3.max(data, function(d) { return d.value; });
						if (d.value < 0.1 * x) {
							return yPos - 22;
						} else {
							return yPos;
						};
					})
					.attr("text-anchor", "middle")
					.attr("fill", function(){
						var x = d3.max(data, function(d){ return d.value; });
						if (d.value < 0.1 * x) {
							return "#2B3E42";
						} else {
							return "#2B3E42";
						};
					})
					.attr("font-size", "18px")
					.text(d.value);
			})
			.on("mouseout", function(){
				d3.select("#info").remove();
			});

			svg.append("g")
				.attr("class", "xaxis")
				.attr("transform", "translate(20," + h + ")")
				.call(xAxis)
				.selectAll("text")
				.style("font-size", "17px")
				.style("font-family", "Avenir")
				.style("text-anchor", "middle");
				

			svg.append("text")
				.attr("class", "chartTitle graphlabel")
				.attr("text-anchor", "middle")
				.attr("transform", "translate(" + ((w/2)+ 40) + ", 36)")
				.style("font-family", "Avenir")
				.text("Distribution Across Boroughs");
		};

		function pie_viz(data){

			var margin = {
				top: 30,
				right: 40,
				bottom: 20,
				left: 20,
			}

			var width = 600 + margin.left ;
			var height = 400 - margin.top;

			var radius = Math.min(width, height) / 2;

			var color = d3.scale.ordinal()
				.range(["#F6776A", "#024E83", "#97DCDD", "#DC4032", "#78C652"]);

			var svg = d3.select("#pie1")
				.append("svg")
				.attr("class", "citySvg pie1")
				.attr("width", width)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + width / 2 + "," + ((height / 2) + 60) + ")");

			var arc = d3.svg.arc()
				.outerRadius(radius - 10)
				.innerRadius(0);

			var labelArc = d3.svg.arc()
				.outerRadius(radius - 40)
				.innerRadius(radius - 40);

			var pie = d3.layout.pie()
				.sort(null)
				.value(function(d) { return d.value; });

			var legend = d3.select("#pie1")
				.append("svg")
				.attr("class", "legend")
				.attr("width", 200)
				.attr("height", (data.length) * 20)
				.selectAll("g")
				.data(data)
				.enter()
				.append("g")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			legend.append("text")
				.attr("class", "legendText")
				.attr("x", 24)
				.attr("y", 9)
				.attr("dy", ".35em")
				.attr("fill", "#2B3E42")
				.text(function(d) { return d.key; });

			legend.append("rect")
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", function(d) { return color(d.key); });

			var g = svg.selectAll(".arc")
				.data(pie(data))
				.enter().append("g")
				.attr("class", "arc");

			g.append("path")
				.attr("d", arc)
				.style("fill", function(d) { return color(d.data.key); });

			g.append("text")
				.attr("transform", function(d) { return "translate(" + labelArc.centroid(d)+ ")"; })				.attr("dy", ".35em")
				.text(function(d) { return d.data.percent; })
				.style("text-anchor", "middle")
				.attr("fill", "#ffffff");

			svg.append("text")
				.attr("class", "pietitle")
				.attr("text-anchor", "middle")
				.attr("transform", "translate( 0 , -200)")
				.text("Distribution by Percent");

				function type(d) {
					d.value = +d.value;
					return d;
				};
			};
		};
	});

	