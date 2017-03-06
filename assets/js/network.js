/**
 * Created by Jang on 2016-04-02.
 */
/**
 * Created by Jang on 2016-04-02.
 */

//넓이와 폭 설정
//			var width = 960;
//			var height = 800;
var width = 1100;
var height = 565;

var powVar = 2.4;

var color = d3.scale.category20b();

//SVG 그리기
var svg = d3.select("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    //.attr("viewBox", "0 0 0 0");
    .attr("viewBox", "0 0 1100 580");
//.attr("width", width)
//.attr("height", height);

//포스 레이아웃 설정
var force = d3.layout.force()
    .size([width, height])
    .charge([-500])
    .linkStrength([0.1])
    .friction(0.1);

var epiNum = d3.select(".footer")
    .append("ul")
    .attr("class", "pagination");

for (var i = 1; i < 21; i++) {
    epiNum.append("li")
        .append("a")
        .attr("class", "epiButton")
        .text(i);
}


update(1);


d3.selectAll(".epiButton")
    .on("click", function () {
        update(this.text);

        d3.select(".current")
            .attr("class", "epiButton");

        d3.select(this)
            .attr("class", "current");
    });

d3.select(".epiButton")
    .attr("class", "current");

function update(epiNum) {
    d3.selectAll("line").remove();
    d3.selectAll("g").remove();
    d3.selectAll("circle").remove();
    d3.selectAll("text").remove();
    d3.selectAll("pattern").remove();

    d3.json("assets/json/network_text.json", function (error, dataset) {
        var data = dataset.network_text.filter(function (d) {
            return d.epi == epiNum
        })[0];

        d3.select("#epiNum")
            .text(data.epi + "화:");

        d3.select(".drama-title")
            .text(data.title);

        d3.select(".drama-overall-text")
            .text(data.summary1);

        d3.select(".drama-rel-text")
            .text(data.summary2);
    });


    d3.json("assets/json/nodeLink.json", function (error, dataset) { //dataset파일에서 json불러옴
        if (error) throw error;

        var data = dataset.network.filter(function (d) {
            return d.epi == epiNum
        })[0];

        force.nodes(data.nodes)
            .links(data.edges)
            .linkDistance(function (d) {
                return 600 / d.value
            })
            .start();

        //line을 이용하여 에지를 생성
        var edges = svg.selectAll(".edges")
            .data(data.edges)
            .enter()
            .append("line")
            .attr("class", "edges")
            .style("stroke-width", function (d) {
                return Math.pow(d.value, 1.2);
            }); //라인에 두께 조절해줌

        //circle을 이용하여 노드를 생성
        var nodes = svg.selectAll(".nodes")
            .data(data.nodes)
            .enter()
            .append("g")
            .attr("class", "nodes")
            .call(force.drag);

        force.nodes().forEach(function (element, index) {
            d3.select("defs")
                .append("pattern")
                .attr("id", "img" + index)
                .attr("patternUnits", "objectBoundingBox")
                .attr("width", "100%")
                .attr("height", "100%")
                .append("image")
                .attr("xlink:href", function () {
                    var imgPath = "assets/img/actor/";

                    switch (element.name) {
                        case "덕선":
                            return imgPath + "duck2.png";
                            break;
                        case "정환":
                            return imgPath + "ryu.png";
                            break;
                        case "선우":
                            return imgPath + "sun.png";
                            break;
                        case "덕선모":
                            return imgPath + "duckMo.png";
                            break;
                        case "덕선부":
                            return imgPath + "duckBoo.png";
                            break;
                        case "동룡":
                            return imgPath + "ryong.png";
                            break;
                        case "보라":
                            return imgPath + "bora.png";
                            break;
                        case "정봉":
                            return imgPath + "jungbong.png";
                            break;
                        case "정환모":
                            return imgPath + "ryuMo.png";
                            break;
                        case "정환부":
                            return imgPath + "ryuBoo.png";
                            break;
                        case "택이":
                            return imgPath + "tack.png";
                            break;
                        case "선우모" :
                            return imgPath + "sunmo.png";
                            break;
                        case "택이부" :
                            return imgPath + "tackboo.png";
                            break;
                        case "노을" :
                            return imgPath + "no.png";
                            break;
                        case "미옥" :
                            return imgPath + "miok.png";
                            break;
                        case "자현" :
                            return imgPath + "jahyun.png";
                            break;
                        case "동룡부" :
                            return imgPath + "dongbu.png";
                            break;
                        default:
                            break;
                    }
                })
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", function () {
                    return Math.pow(element.size, powVar) * 2
                }) //해당 원의 지름
                .attr("height", function () {
                    return Math.pow(element.size, powVar) * 2
                })
                .attr("preserveAspectRatio", "xMidYMid slice");
        });


        nodes.append("circle")
            .attr("r", function (d) {
                return Math.pow(d.size, powVar);
            })
            .attr("fill", function (d, i) {
                return "url(#img" + i + ")";
            })
            .on("mouseover", function (g) {
                d3.selectAll(".edges")
                    .filter(function (d) {
                        return g.name != d.source.name && g.name != d.target.name;
                    })
                    .style("stroke-opacity", .2);
            })
            .on("mouseout", function () {
                d3.selectAll(".edges")
                    .style("stroke-opacity", 1);
            });

        //node text생성
        nodes.append("text")
            .attr("class", "nodetext")
            .attr("dy", function (d) {
                return Math.pow(d.size, powVar) * 1.3;
            })
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.name;
            });


        //force 인터랙션 생성
        force.on("tick", function () {
            edges.attr("x1", function (d) {
                    var x = d.source.x;
                    var r = Math.pow(d.source.size, powVar);

                    if (x <= r) x = r;
                    if (x >= width - r) x = width - r;

                    return x;
                })
                .attr("y1", function (d) {
                    var y = d.source.y;
                    var r = Math.pow(d.source.size, powVar);

                    if (y <= r) y = r;
                    if (y >= height - r) y = height - r;

                    return y;
                })
                .attr("x2", function (d) {
                    var x = d.target.x;
                    var r = Math.pow(d.target.size, powVar);

                    if (x <= r) x = r;
                    if (x >= width - r) x = width - r;

                    return x;
                })
                .attr("y2", function (d) {
                    var y = d.target.y;
                    var r = Math.pow(d.target.size, powVar);

                    if (y <= r) y = r;
                    if (y >= height - r) y = height - r;

                    return y;
                });
            nodes.attr("transform", function (d) {
                var x = d.x;
                var y = d.y;
                var r = Math.pow(d.size, powVar);


                if (x <= r) x = r;
                if (x >= width - r) x = width - r;

                if (y <= r) y = r;
                if (y >= height - r) y = height - r;

                return "translate(" + x + "," + y + ")";
            });
        });
    });
}


