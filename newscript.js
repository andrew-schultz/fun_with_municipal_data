$(document).ready(function(){

var location

var tables = [
	"B01001", //age by sex
	"B14001", //current enrollment by age education
	"B19001", //household income 1 year
	"B02001"  //race
	];

$('#select').on('click', function(){
	clear();
	
	var location = $("#locSelect").val();
	var location = String(location);
	var table = tables[0];
	titleIt(location, table);

function titleIt(location, table){	
	d3.json("http://api.censusreporter.org/1.0/data/show/latest?table_ids=" + table + "&geo_ids="+location, function(error,response) {
	var locationN = response.geography[location]['name'];
	console.log(locationN);
	$('#locationName').append("<h2>" + locationN + "</h2>");
	});
};


	for(var i = 0; i < tables.length; i++){
		var table = tables[i];
		
		var location = $("#locSelect").val();
		var location = String(location);
		console.log(tables);
		console.log(location);

		
		chartIt(location, table);
	


function chartIt(location, table){
	console.log(table);
	console.log(location);
	d3.json("http://api.censusreporter.org/1.0/data/show/latest?table_ids=" + table + "&geo_ids="+location, function(error,response) {
  	var data = response.data[location][table].estimate;
  	console.log(data);  //Log output to console

	keyArray = [];
	valueArray = [];
	for (value in data) {
	    if (data.hasOwnProperty(value)) {
	        // keyArray.push(key);         // Push the key on the array
	        valueArray.push(data[value]); // Push the key's value on the array
	    }
	}

  	var title = response.tables[table].title;

	var labels = response.tables[table].columns;

  	for (key in labels) {
  		// keyArray.push(labels[key]);
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
	
	
	visualizeIt(dataset, title);
	
	});
	
	};
	};

});
function visualizeIt(dataset, title) {
	var margin = {
		top: 70, 
		right: 20, 
		bottom: 60,
		left: 100
	};

	
	var width = 700 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;
	var w = width;
	var h = height;

	//Create the SVG element
	var svg = d3.select("#graph")
	.append("svg")
	.attr("width", w + margin.left + margin.right)
	.attr("height", h + margin.top + margin.bottom);

	
	//Define the X scale
	var xScale = d3.scale.ordinal()
	.domain(dataset.map(function (d) {return d.key;}))
	.rangeRoundBands([margin.left, w], 0.05);

	//Define the X Axis
	var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom");

	//Define the Y Scale
	var yScale = d3.scale.linear()
	.domain([0, d3.max(dataset, function(d) {return d.value; } )])
	.range([h, margin.top]);

	//Define the Y Axis
	var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left");


	// creates bars
	bars = svg.selectAll("rect").data(dataset);
	
	// creates labels (for bars)
	barLabels = svg.selectAll("text").data(dataset);
	

	// add new bars
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
	// .attr("transform", "translate(105, 0)")
	.attr("fill", "steelblue");


	// draw the X axis
	svg.append("g")
	.attr("class", "xaxis")
	.attr("transform", "translate(0," + h + ")")
	.call(xAxis)
	.selectAll("text")
	.style("text-anchor", "end")
	.attr("dx", "-.8em")
	.attr("dy", ".15em")
	.attr("transform", "rotate(-65)");


	//draw the Y axis
	svg.append("g")
	.attr("class", "yaxis")
	.attr("transform", "translate(" + margin.left + ",0)")
	.call(yAxis);

	// add the X axis label
	svg.append("text")
	.attr("class", "xaxislabel graphlabel")
	.attr("text-anchor", "middle")
	.attr("transform", "translate(" + (w/2) + "," + (h + (margin.bottom / 2) + 60) + ")")
	// .text("Educational Level");

	// add Y Axis label
	svg.append("text")
	.attr("class", "yaxislabel graphlabel")
	.attr("text-anchor", "middle")
	.attr("transform", "translate(15," + (h / 2) + ")rotate(-90)")
	// .text("Number of People Enrolled");

	// add Title for chart
	svg.append("text")
	.attr("class", "chartTitle graphlabel")
	.attr("text-anchor", "middle")
	.attr("transform", "translate(" + (w/2) + ", 40)")
	.text(title);

}


	function clear(){
		d3.selectAll("svg").remove();
		$("h2").remove();

	};

});

			
