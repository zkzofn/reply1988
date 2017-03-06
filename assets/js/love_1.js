/**
 * Created by Jang_ThinkPad on 2016-04-08.
 */

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 1090 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#222", "#f22222"]);


var svg1 = d3.select("#graph1")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1090 400")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis1 = d3.svg.axis()
    .scale(x0)
    .orient("bottom")
    .tickFormat(function(d, i){
        return d+ "화"
    });

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .style('font-size','15px')
    .html(function(d, graphNum) {
        var html = "";

        switch (graphNum) {
            case 1:
                var name = "";

                switch(d.name) {
                    case "ryu" :
                        name = "정환이가";
                        break;
                    case "taek" :
                        name = "택이가";
                        break;
                    default:
                        break;
                }

                html = "<strong>덕선이와 "+ name+ " 같이 나온 씬 수:</strong> <span style='color:red'>" +
                    d.value + "</span>";
                break;
            case 2:
                html = "<strong>케미점수: </strong> <span style='color:red'>" + d.ryu.toFixed(1) + "점</span>";
                break;
            case 3:
                html = "<strong>케미점수: </strong> <span style='color:red'>" + d.taek.toFixed(1) + "점</span>";
                break;
            case 4:
                html = "<strong>누적케미점수: </strong> <span style='color:red'>" + d.ryunpt + "점</span>";
                break;
            case 5:
                html = "<strong>누적케미점수: </strong> <span style='color:red'>" + d.taeknpt + "점</span>";
                break;
            default:
                html = "";
                break;
        }
        return html;
    });



d3.csv("assets/csv/love_1.csv", function(error, data) {
    if (error) throw error;

    var ageNames1 = d3.keys(data[0]).filter(function(key) { return key !== "epi"; });


    data.forEach(function(d) {
        d.ages = ageNames1.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d.epi; }));
    x1.domain(ageNames1).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, 20]);

    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis1)
        .append("text")
        .attr("x", width-40)
        .attr("dy","3em")
        .text("Episode")
        .attr("font-family","sans-serif");


    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(270)")
        .attr("y", -37)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Scene")
        .attr("font-size","13px")
        .attr("font-family","sans-serif")
    ;

    var epi = svg1.selectAll(".epi")
        .data(data)
        .enter().append("g")
        .attr("class", "epi")
        .attr("transform", function(d) { return "translate(" + x0(d.epi) + ",0)"; });

    epi.selectAll(".rect")
        .data(function(d) { return d.ages; })
        .enter().append("rect")
        .attr("rx",5)
        .attr("ry",3)
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height",0)
        .style("fill", function(d) { return color(d.name); })
		.style("opacity", 0.7)
        .on("mouseover", function(d){
            svg1.call(tip);

            d3.select(this)
                .style("fill", "#A0AFB7")
                .style("opacity", 0.7);
            tip.show(d,1);
        })
        .on("mouseout", function(d){
            d3.select(this)
                .style("fill", function(d) { return color(d.name); });
            tip.hide(d,1);
        })
        .transition()
        .duration(1500)
        .delay(function(d,i){
            return i*10;
        })
        .ease("exp")
        .ease("bounce")
        .attr("height", function(d,i) { return (height - y(d.value)); })
        //.attr("height", function(d,i) { return (y(d.value) - height); })
    ;





    var legend1 = svg1.selectAll(".legend1")
        .data(ageNames1.slice())
        .enter().append("g")
        .attr("class", "legend1")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend1.append("rect")
        .attr("rx",5)
        .attr("ry",3)
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)
        .style("opacity", 0.7);

    legend1.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .attr("class", "le-text")
        .text(function(d, i){
            return ["어남류", "어남택"][i];
        });

});