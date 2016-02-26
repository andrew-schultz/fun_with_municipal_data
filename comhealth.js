$(document).ready(function(){

	$('#select').on('click', function(){


	var margin = {
		top: 30,
		right: 40,
		bottom: 20,
		left: 20,
	}

	var width = 600;
	var height = 400;
	
	var radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var labelArc = d3.svg.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.value; });

		d3.json("https://data.cityofnewyork.us/resource/b2sp-asbg.json?", function(error, response){
		var comHealth = response;
		var boroughs = []
		for (value in comHealth){
			boroughs.push(comHealth[value]['__name_of_borough']);
		};
		var bk = 0;
		var bx = 0;
		var si = 0;
		var m = 0;
		var q = 0;
		var bvals = [];
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
		
		bvals.push(bx);
		bvals.push(bk);
		bvals.push(m);
		bvals.push(q);
		bvals.push(si);


		var percent = [];
		for( i in bvals){
			percent.push(((bvals[i] / boroughs.length) * 100).toFixed(2) + "%");
		};

		console.log(percent);

		var bor = boroughs.filter(function(x, i){
			return boroughs.indexOf(x) == i;
		});

		var data = [];
		for(var i = 0; i < bor.length; i++){
			var item = new Object();
			item.key = bor[i];
			item.value = bvals[i];
			item.percent = percent[i];
			data.push(item);
		};

		var legend = d3.select("#pie1")
			.append("svg")
			.attr("class", "legend")
			.attr("width", 120)
			.attr("height", (data.length - 1) * 20)
			.selectAll("g")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		legend.append("text")
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.text(function(d) { return d; });
		console.log(data);

		var g = svg.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc");

		g.append("path")
			.attr("d", arc)
			.style("fill", function(d) { return color(d.data.key); });

		g.append("text")
			.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.text(function(d) { return d.data.percent; });

		});

	var svg = d3.select("#pie1").append("svg")
		.attr("class", "svg pie1")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



		function type(d) {
			d.value = +d.value;
			return d;
		};
	});
});


d3.json("https://data.cityofnewyork.us/resource/b2sp-asbg.json?", function(error, response){
		console.log(response);
	})

	d3.json("https://data.cityofnewyork.us/resource/ajxm-kzmj.json", function(error, response){
		var garden = response;
		console.log(response);
	})