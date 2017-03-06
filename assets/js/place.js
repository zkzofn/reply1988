/**
 * Created by Jang on 2016-04-07.
 */
var units = "Widgets";

var margin = {top: 10, right: 10, bottom: 10, left: 10};
var width = 750 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function (d) {
        return formatNumber(d) + " " /*+ units*/;
    },
    color = d3.scale.category20b();

// append the svg canvas to the page
var svg = d3.select("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 750 400")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(10)
    .size([width, height]);

var path = sankey.link();

// load the data
d3.json("assets/json/place.json", function (error, graph) {
    var nodeMap = {};
    graph.nodes.forEach(function (x) {
        nodeMap[x.name] = x;
    });
    graph.links = graph.links.map(function (x) {
        return {
            source: nodeMap[x.source],
            target: nodeMap[x.target],
            value: x.value
        };
    });

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

// add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
        })   //선 두께
        .sort(function (a, b) {
            return b.dy - a.dy;
        });

// add the link titles
    link.append("title")
        .text(function (d) {
            return d.source.name + " → " +
                d.target.name + ": " + format(d.value);
        });


// add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

// add the rectangles for the nodes
    node.append("rect")
        .attr("height", function (d) {
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("opacity", "0.8")
        .on("mouseover", function (g) {
            d3.selectAll(".link")
                .filter(function (d) {
                    return g.name != d.source.name && g.name != d.target.name;
                })
                .style("opacity", .2);
        })
        .on("mouseout", function () {
            d3.selectAll(".link")
                .style("opacity", 1);
        })
        .append("title")
        .text(function (d) {                             //마우스오버 시 이름표
            return d.name + ": " + format(d.value);
        });

// add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function (d) {
            return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("class", "nodetitle")
        .attr("transform", null)
        .text(function (d) {
            return d.name;
        })
        .filter(function (d) {
            return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
});