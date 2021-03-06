var graph = getBipartiteGraph();

var width = 1000, height = 1000;

var classColor = {
    "Warrior": "#C79C6E",
    "Shaman": "#0070DE",
    "Rogue": "#FFF569",
    "Paladin": "#F58CBA",
    "Hunter": "#ABD473",
    "Druid": "#FF7D0A",
    "Warlock": "#9482C9",
    "Mage": "#69CCF0",
    "Priest": "#FFFFFF",
    "default": "#DFDFDF"
};

var links = graph.links;

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function (link) {
    link.source = nodes[link.source] || (nodes[link.source] = {cardId: link.source});
    link.target = nodes[link.target] || (nodes[link.target] = {cardId: link.target});
});

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(150)
    .charge(-300)
    .on("tick", tick)
    .start();

var svgImage = d3.select("body").append("svg")
    .attr({
        "width": 307,
        "height": 465
    });

var svg = d3.select("body").append("svg")
    .attr({
        "width": width,
        "height": height
    })
    .append("g")
    .call(d3.behavior.zoom().scaleExtent([-1, 10]).on("zoom", zoom))
    .append("g");

svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);

svgImage.append("svg:image")
    .attr({
        "xlink:href": "http://wow.zamimg.com/images/hearthstone/cards/enus/original/OG_280.png",
        "width": 307,
        "height": 465,
        "x": 0,
        "y": 0
    });

var link = svg.selectAll(".link")
    .data(force.links())
    .enter().append("line")
    .attr("class", "link")
    .attr({
        "stroke": "#999"
    });

var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .style("fill", function (d) {
        var card = getCard(graph.nodes, d.cardId);
        if (card != null)
            if (card.playerClass)
                return classColor[card.playerClass];
            else
                return classColor.default;
        else
            console.log(d.cardId);
    })
    //.on("mouseover", mouseover)
    .on("mouseover", function (d) {
        var card = getCard(graph.nodes, d.cardId);
        d3.select("svg > image").remove();
        svgImage.append("svg:image")
            .attr({
                "xlink:href": card.imgGold,
                "width": 307,
                "height": 465,
                "x": 0,
                "y": 0
            });
        var circle = d3.select(this)
            .select('circle');
        circle.style({
            "stroke": "white",
            "stroke-width": "3px"
        });
        d3.selectAll("line")
            .attr({
                "stroke-width": function (d) {
                    if (d.source["cardId"] == card.cardId || d.target["cardId"] == card.cardId) {
                        return 2;
                    }
                },
                "stroke": function (d) {
                    if (d.source["cardId"] == card.cardId || d.target["cardId"] == card.cardId) {
                        return "black";
                    }
                    return "#999";
                }
            });
    })
    .on("mouseout", function () {
        d3.select(this)
            .select('circle')
            .style({
                "stroke": "black",
                "stroke-width": "3px"
            });
        d3.selectAll("line")
            .attr({
                "stroke": "gray",
                "stroke-width": 1
            })
    })
    .call(force.drag);

node.append("circle")
    .attr({
        "r": function (d) {
            return d.weight / 3;
        }
    })
    .style({
        "stroke": "black",
        "stroke-width": "3px"
    });

function tick() {
    link
        .attr("x1", function (d) {
            return d.source.x;
        })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    node
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
}


function sizeByCost() {
    d3.selectAll("circle")
        .transition()
        .duration(750)
        .attr({
            "r": function (d) {
                var card = getCard(graph.nodes, d.cardId);
                return card.cost * 3 + 1;
            }
        });
}

function sizeByWeight() {
    d3.selectAll("circle")
        .transition()
        .duration(750)
        .attr({
            "r": function (d) {
                return d.weight / 3;
            }
        });
}

function sizeByAttack() {
    d3.selectAll("circle")
        .transition()
        .duration(750)
        .attr({
            "r": function (d) {
                var card = getCard(graph.nodes, d.cardId);
                if (card.attack)
                    return card.attack * 3;
                else
                    return 1;
            }
        });
}

function sizeByHealth() {
    d3.selectAll("circle")
        .transition()
        .duration(750)
        .attr({
            "r": function (d) {
                var card = getCard(graph.nodes, d.cardId);
                if (card.health)
                    return card.health * 3;
                else
                    return 1;
            }
        });
}

function sizeByDefault() {
    d3.selectAll("circle")
        .transition()
        .duration(750)
        .attr({
            "r": 8
        });
}

function zoom() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
