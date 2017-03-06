/**
 * Created by Jang_ThinkPad on 2016-04-08.
 */


// Set the dimensions of the canvas / graph
var margin = {top: 20, right: 20, bottom: 40, left: 50},
    width = 1090 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x).tickFormat(function(d, i){
        return d + "화";
    })
    .orient("bottom").ticks(20);

var yAxis = d3.svg.axis().scale(y)
    .orient("left");

// Define the line
var valueline3 = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.epi); })
    .y(function(d) { return y(d.npt); });

// Adds the svg canvas
var svg3 = d3.select("#graph3")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1090 400")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// Get the data
d3.csv("assets/csv/love_3.csv", function(error, data) {
    data.forEach(function(d) {
        d.epi = +d.epi;
        d.npt = +d.ryunpt;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.epi; }));
    y.domain([0, 450]);

    // Add the valueline path.
    svg3.append("path")
        .attr("class", "line")
        .attr("d", valueline3(data))
        .attr('stroke', function(d, j) {
            return color(1);
        })
        .style("opacity", 0.7);

    // Add the scatterplot
    svg3.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.epi); })
        .attr("cy", function(d) { return y(d.ryunpt); })
        .on("mouseover", function(d) {
            svg1.call(tip);
            tip.show(d,4);

            d3.select(this)
                .attr("style","fill:#CB5A4B;");
        })
        .on("mouseout", function(d) {
            tip.hide();

            d3.select(this)
                .attr("style","fill:black;");
        });

    // Add the X Axis
    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg3.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});

//get another data
d3.csv("assets/csv/love_3.csv", function(error, data) {
    data.forEach(function(d) {
        d.epi = +d.epi;
        d.npt = +d.taeknpt;
    });
    var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "epi" && key !== "npt"; });


    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.epi; }));
    y.domain([0, 450]);

    // Add the valueline path.
    svg3.append("path")
        .attr("class", "line")
        .attr("d", valueline3(data))
        .attr('stroke', function(d, j) {
            return color(2);
        })
        .style("opacity", 0.7);

    // Add the scatterplot
    svg3.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.epi); })
        .attr("cy", function(d) { return y(d.taeknpt); })
        .on("mouseover", function(d) {
            svg1.call(tip);
            tip.show(d,5);

            d3.select(this)
                .attr("style","fill:#CB5A4B;");
        })
        .on("mouseout", function(d) {
            tip.hide();

            d3.select(this)
                .attr("style","fill:black;");
        });

    // x axis title
    svg3.append("text")
        .attr("x",width-10)
        .attr("y",height+margin.bottom-5)
        .style("text-anchor","middle")
        .text("Episode")
        .attr("font-family","sans-serif");

    // y axis title
    svg3.append("text")
        .attr("transform","rotate(-90)")
        .attr("y",-35)
        .attr("x",-10)
        .style("text-anchor","middle")
        .text("Point")
        .attr("font-family","sans-serif");

    var legend = svg3.selectAll(".legend")
        .data(ageNames.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)
        .style("opacity", 0.7);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .attr("class", "le-text")
        .text(function(d, i){
            return ["어남류", "어남택"][i];
        });
});
