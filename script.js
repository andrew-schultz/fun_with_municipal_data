$(document).ready(function(){

	$('#select').on('click', function(){
		clear();
		var location = $("#locSelect").val();
		var location = String(location);


	var comHealth= [];
	d3.json("https://data.cityofnewyork.us/resource/b2sp-asbg.json?", function(error, response){
		var comHealth = response;
		console.log(comHealth);

		nums = [];

	})

	hVisualizeIt(comHealth);
	
});
	function hVisualizeIt(comHealth) {

		var margin = {
			top: 30,
			right: 10,
			bottom: 20,
			left: 30
		};

		var width = 400 - margin.left - margin.right;
		var height = 400 - margin.top - margin.bottom;
		var w = width;
		var h = height;
		var radius = Math.min(w, h) / 2;

		var color = d3.scale.ordinal()
			.range(["#90A7CF", "#FADF3C", "#9696A2", "#DC4032", "#78C652"]);

		var boroughs = d3.scale.ordinal()
			.range(comHealth.map(function(d){ return d.__name_of_borough; }))

		var arc = d3.svg.arc()
			.outerRadius(radius - 40)
			.innerRadius(radius - 40);

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d;});

		var data = []

		var svg = d3.select("#graph")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + w /2 + "," + h / 2 + ")");

		var g = svg.selectAll(".arc")
			.data(pie(comHealth.__name_of_borough))
			.enter()
			.append("g")
			.attr("class", "arc");

		g.append("path")
			.attr("d", arc)
			.style("fill", function(d) { return color(d.data); });

		g.append("text")
			.attr("transform", function(d) {
				return "translate(" + labelArc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.text(function(d){ return boroughs(d.data);} );
	

	}

	

	function clear(){
		d3.selectAll("svg").remove();
		$("h2").remove();
		$(".svgDiv").remove();
	};
});

d3.json("https://data.cityofnewyork.us/resource/ajxm-kzmj.json", function(error, response){
		var garden = response;
		console.log(response);
	})