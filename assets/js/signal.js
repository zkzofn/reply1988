/**
 * Created by Jang on 2016-04-05.
 */
var margin = {top: 20, right: 20, bottom: 30, left: 30},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var color = d3.scale.category20b();

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x).tickFormat(function (d, i) {
        return d + "화";
    })
    .orient("bottom")
    .ticks(20);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var areaR = d3.svg.area()
    .x(function (d) {
        return x(d.epi);
    })
    .y0(height)
    .y1(function (d) {
        return y(d.r);
    });

var areaT = d3.svg.area()
    .x(function (d) {
        return x(d.epi);
    })
    .y0(height)
    .y1(function (d) {
        return y(d.t);
    });

var svg = d3.select("#summaryGraph")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 620")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var nodes = svg.selectAll(".nodes");


d3.csv("assets/csv/behavior_data.csv", function (error, data_graph) {
    if (error) throw error;

    d3.json("assets/json/signal.json", function (err, data_text) {
        if (err) throw error;

        x.domain([0, 20]);
        y.domain([0, d3.max(data_graph, function (d) {
            return d.t;
        })]);

        svg.append("path")
            .attr("class", "areaR")
            .attr("d", function () {
                return areaR(data_graph);
            })
            .attr("opacity", "0.6");

        svg.append("path")
            .attr("class", "areaT")
            .attr("d", function () {
                return areaT(data_graph);
            })
            .attr("opacity", "0.6");

        //circle을 이용하여 노드를 생성
        textConstruct(data_text.signal.filter(function (signal) {
            return signal.epi == 0
        })[0]);

        var nodes = svg.selectAll(".nodes")
            .data(data_graph)
            .enter()
            .append("circle")
            .attr("r", function (d) {
                if (d.epi == epiCheck(d.epi)) {
                    return 8;
                } else {
                    return 0;
                }
            })
            .attr("cx", function (d) {
                return x(d.epi);
            })
            .attr("cy", function (d) {
                if (d.epi == epiCheck(d.epi)) {
                    if (y(d.t) > y(d.r)) {
                        return y(d.r);
                    } else {
                        return y(d.t);
                    }
                }
            })
            .attr("opacity", "0.8")
            .on("mouseover", function (d) {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("r", 13);

                var data = data_text.signal.filter(function (signal) {
                    return signal.epi == d.epi
                })[0];
                textRefresh(data);
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("r", 8);
                var data = data_text.signal.filter(function (signal) {
                    return signal.epi == 0
                })[0];

                textRefresh(data);
            });


        var legend = svg.selectAll(".legend")
            .data(["어남택", "어남류"])
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0, " + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", 30)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (d) {
                if (d == "어남택") {
                    return "#ff8c00";
                }
                else {
                    return "#8a89a6"
                }
            })
            .attr("opacity", "0.6");

        legend.append("text")
            .attr("x", 90)
            .attr("y", 10)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 26)
            .attr("dy", ".71em")
            .attr("x", width - 40)
            .text("Episode");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Point");

    });
});


//성환이 그래프 시작

// 어남류의 행동을 d3로 구현함.
d3.csv("assets/csv/ryu_behavior.csv", function (error, data) {
    var margin = {left: 50, right: 30, top: 30, bottom: 50};
    var svgWidth = 700 - margin.left - margin.right;
    var svgHeight = 450 - margin.top - margin.bottom;

    d3.select("#ryuGraph")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 700 470")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var dotMargin = svgWidth / (data.length - 1);
    var scale = svgHeight / 100;

    drawArea(data, "basis");
    drawScale();

    function drawArea(data, interpolate) {
        var percentA = "A 40%";
        var percentB = "B 48%";
        var percentC = "C 12%";

        var area1 = d3.svg.area()
            .x(function (d, i) {
                return margin.left + i * dotMargin;
            })
            .y0(function (d, i) {
                return margin.top + svgHeight;
            })
            .interpolate(interpolate)
            .y1(function (d, i) {
                return margin.top + svgHeight - d.A * scale;
            });


        var areaElements1 = d3.select("#ryuGraph")
            .append("path")
            .attr("id", "ryu_Apath")
            .style("fill", "#8181b5")
            .attr("d", area1(data))
            .on("mouseover", function () {
                d3.selectAll(".percentRyu_A")
                    .style("fill", "red")
                    .style("font-weight", "bolder")
            })
            .on("mouseout", function () {
                d3.select(".percentRyu_A")
                    .style("fill", "black")
                    .style("font-weight", 100)
            });


//
        var area2 = d3.svg.area()
            .x(function (d, i) {
                return margin.left + i * dotMargin;
            })
            .y0(function (d, i) {
                return margin.top + svgHeight - d.A * scale;
            })
            .y1(function (d, i) {
                return margin.top + svgHeight - d.A * scale - d.B * scale;
            })
            .interpolate(interpolate);


        var areaElements2 = d3.select("#ryuGraph")
            .append("path")
            .attr("id", "ryu_Bpath")
            .attr("d", area2(data))
            .style("fill", "#a6a6cc")
            .on("mouseover", function () {
                d3.select(".percentRyu_B")
                    .style("fill", "red")
                    .style("font-weight", "bolder")
            })
            .on("mouseout", function (d, i) {
                d3.select(".percentRyu_B")
                    .style("fill", "black")
                    .style("font-weight", 100)
            });


        var area3 = d3.svg.area()
            .x(function (d, i) {
                return margin.left + i * dotMargin;
            })
            .y0(function (d, i) {
                return margin.top + svgHeight - d.A * scale - d.B * scale;
            })
            .y1(function (d, i) {
                return margin.top + svgHeight - d.A * scale - d.B * scale - d.C * scale;
            })
            .interpolate(interpolate);

        var areaElements3 = d3.select("#ryuGraph")
            .append("path")
            .attr("id", "ryu_Cpath")
            .attr("d", area3(data))
            .style("fill", "#cacadb")
            .on("mouseover", function () {
                d3.select(".percentRyu_C")
                    .style("fill", "red")
                    .style("font-weight", "bolder")
            })
            .on("mouseout", function () {
                d3.select(".percentRyu_C")
                    .style("fill", "black")
                    .style("font-weight", 100)
            });


        d3.select("#ryuGraph")
            .append("text")
            .attr("class", "percentRyu_A")
            .attr("transform", "translate(" + (svgWidth / 2 - 50) + ", " + (svgHeight - 50) + ")")
            .text(percentA)
            .on("mouseover", function () {
                d3.select(this)
                    .style("fill", "red")
                    .style("font-weight", "bolder");
            });

        d3.select("#ryuGraph")
            .append("text")
            .attr("class", "percentRyu_B")
            .attr("transform", "translate(" + (svgWidth - 70) + ", " + (margin.top + svgHeight * 3 / 5) + ")")
            .text(percentB)
            .on("mouseover", function () {
                d3.select(this)
                    .style("fill", "red")
                    .style("font-weight", "bolder");
            });

        d3.select("#ryuGraph")
            .append("text")
            .attr("class", "percentRyu_C")
            .attr("transform", "translate(" + (svgWidth - 75) + ", " + 80 + ")")
            .text(percentC)
            .on("mouseover", function () {
                d3.select(this)
                    .style("fill", "red")
                    .style("font-weight", "bolder");
            });
    }


    // 축을 그리는 함수 drawScale 실행
    function drawScale() {
        var yScale = d3.scale.linear()
            .domain([0, 100])
            .range([svgHeight, 0])

        d3.select("#ryuGraph")
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ", " + (margin.top + svgHeight - svgHeight) + ")")
            .call(
                d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickFormat(function (d, i) {
                        return d + "%";
                    })
                    .ticks(5)
            );

        var xScale = d3.scale.ordinal()
            .domain([3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
            .rangePoints([0, svgWidth]);

        d3.select("#ryuGraph")
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ", " + (margin.top + svgHeight) + ")")
            .call(
                d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickFormat(function (d, i) {
                        return d + "화";
                    })
            )
            .selectAll("text")
            .style("font-size", "11px")
    }
});


// 어남택의 행동을 d3로 구현함.
d3.csv("assets/csv/taek_behavior.csv", function (error, data) {
    var margin = {left: 50, right: 30, top: 30, bottom: 50};

    var svgWidth = 700 - margin.left - margin.right;
    var svgHeight = 450 - margin.top - margin.bottom;

    d3.select("#taekGraph")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 700 470")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dotMargin = svgWidth / (data.length - 1);
    var scale = svgHeight / 100;

    drawArea(data, "basis");
    drawScale();

    function drawArea(data, interpolate) {
        var percentA = "A 74%";
        var percentB = "B 24%";
        var percentC = "C 2%";

        var area1 = d3.svg.area()
            .x(function (d, i) {
                return margin.left + i * dotMargin;
            })
            .y0(function (d, i) {
                return margin.top + svgHeight;
            })
            .interpolate(interpolate)
            .y1(function (d, i) {
                return margin.top + svgHeight - d.A * scale;
            });


        var areaElements1 = d3.select("#taekGraph")
            .append("path")
            .attr("id", "taek_Apath")
            .attr("d", area1(data))
            .style("fill", "#ea9c4e")
            .on("mouseover", function () {
                d3.select(".percentTaek_A")
                    .style("fill", "red")
                    .style("font-weight", "bolder")
            })
            .on("mouseout", function () {
                d3.select(".percentTaek_A")
                    .style("fill", "black")
                    .style("font-weight", 100)
            });


//
        var area2 = d3.svg.area()
            .x(function (d, i) {
                return margin.left + i * dotMargin;
            })
            .y0(function (d, i) {
                return margin.top + svgHeight - d.A * scale;
            })
            .y1(function (d, i) {
                return margin.top + svgHeight - d.A * scale - d.B * scale;
            })
            .interpolate(interpolate);


        var areaElements2 = d3.select("#taekGraph")
            .append("path")
            .attr("id", "taek_Bpath")
            .attr("d", area2(data))
            .style("fill", "#f9ba75")
            .on("mouseover", function () {
                d3.select(".percentTaek_B")
                    .style("fill", "red")
                    .style("font-weight", "bolder")
            })
            .on("mouseout", function (d, i) {
                d3.select(".percentTaek_B")
                    .style("fill", "black")
                    .style("font-weight", 100)
            })


        var area3 = d3.svg.area()
            .x(function (d, i) {
                return margin.left + i * dotMargin;
            })
            .y0(function (d, i) {
                return margin.top + svgHeight - d.A * scale - d.B * scale;
            })
            .y1(function (d, i) {
                return margin.top + svgHeight - d.A * scale - d.B * scale - d.C * scale;
            })
            .interpolate(interpolate);

        var areaElements3 = d3.select("#taekGraph")
            .append("path")
            .attr("id", "taek_Cpath")
            .attr("d", area3(data))
            .style("fill", "#f9d2a7")
            .on("mouseover", function () {
                d3.select(".percentTaek_C")
                    .style("fill", "red")
                    .style("font-weight", "bolder")
            })
            .on("mouseout", function () {
                d3.select(".percentTaek_C")
                    .style("fill", "black")
                    .style("font-weight", 100)
            })

        d3.select("#taekGraph")
            .append("text")
            .attr("class", "percentTaek_A")
            .attr("transform", "translate(" + (margin.left + svgWidth / 2 - 100) + ", " + (margin.top + svgHeight - 70) + ")")
            .text(percentA)
            .on("mouseover", function () {
                d3.select(this)
                    .style("fill", "red")
                    .style("font-weight", "bolder");
            });

        d3.select("#taekGraph")
            .append("text")
            .attr("class", "percentTaek_B")
            .attr("transform", "translate(" + (margin.left + svgWidth * 3 / 5 - 10 ) + ", " + (margin.top + svgHeight * 2 / 5) + ")")
            .text(percentB)
            .on("mouseover", function () {
                d3.select(this)
                    .style("fill", "red")
                    .style("font-weight", "bolder");
            });


        d3.select("#taekGraph")
            .append("text")
            .attr("class", "percentTaek_C")
            .attr("transform", "translate(" + (svgWidth - 180) + ", " + (margin.top + 33) + ")")
            .text(percentC)
            .on("mouseover", function () {
                d3.select(this)
                    .style("fill", "red")
                    .style("font-weight", "bolder")
            })
    }


    // 축을 그리는 함수 drawScale 실행
    function drawScale() {
        var yScale = d3.scale.linear()
            .domain([0, 100])
            .range([svgHeight, 0])

        d3.select("#taekGraph")
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ", " + (margin.top + svgHeight - svgHeight) + ")")
            .call(
                d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .tickFormat(function (d, i) {
                        return d + "%";
                    })
                    .ticks(5)
            )

        var xScale = d3.scale.ordinal()
            .domain([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
            .rangePoints([0, svgWidth])

        d3.select("#taekGraph")
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ", " + (margin.top + svgHeight) + ")")
            .call(
                d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickFormat(function (d, i) {
                        return d + "화";
                    })
            )
    }

}); //성환이 그래프 끝


function epiCheck(epi) {
    var epis = ["9", "10", "11", "12", "15", "16", "17", "18", "19"];
    if (epis.indexOf(epi) > -1) return epi;
}

function textConstruct(data) {
    d3.select("#epiNum")
        .text("한눈에 보기");

    data.content_out.forEach(function (element_out) {
        d3.select(".summary")
            .append("div")
            .append("g")
            .attr("class", "drama-overall")
            .append("hgroup")
            .append("h3")
            .append("strong")
            .text(element_out.who);

        element_out.content_in.forEach(function (element_in) {
            d3.select(".summary")
                .append("p")
                .attr("class", "drama-overall-text")
                .text(element_in.epi + element_in.text);
        });
    })
}

function textRefresh(data) {
    if (data.epi == 0) {
        d3.select("#epiNum")
            .text("한눈에 보기");
    } else {
        d3.select("#epiNum")
            .text(data.epi + "화");
    }

    d3.selectAll(".drama-overall").remove();
    d3.selectAll(".drama-overall-text").remove();

    data.content_out.forEach(function (element_out) {
        d3.select(".light-line")
        d3.select(".summary")
            .append("div")
            .append("g")
            .attr("class", "drama-overall")
            .append("hgroup")
            .append("h3")
            .append("strong")
            .text(element_out.who);

        element_out.content_in.forEach(function (element_in) {
            d3.select(".light-line")
            d3.select(".summary")
                .append("p")
                .attr("class", "drama-overall-text")
                .text(element_in.epi + element_in.text);
        });
    });
}