var myApp = angular.module("myApp", []);
myApp.controller("d3Controller", ["$scope", function($scope) {

  var svg = d3.select("svg"), //The svg element -- the "canvas" box on the page
      width = +svg.attr("width"), //Width; only used to center
      height = +svg.attr("height"); //Height; only used to center

  var color = d3.scaleOrdinal(d3.schemeCategory20); //Function to generate colors

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; })) //Creates links
      .force("charge", d3.forceManyBody().strength(-1500)) //Specifies repulsion
      .force("center", d3.forceCenter(width / 2, height / 2)); //Centers in svg element

// Main functionality here
  d3.json("./scripts/nodes.json", function(error, graph) {
    if (error) throw error;

    var link = svg.selectAll("line") //Make a new category
        .data(graph.links).enter().append("line") //Make links from the data
        .attr("stroke-width", 3) //sets the stroke-width
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("marker-end", function(link) { return "url(#" + link.id + ")"; });

    var node = svg.selectAll("circle") //Make a new category
        .data(graph.nodes).enter().append("circle") //Make circles from the data
        .attr("r", function(node) { return (Math.sqrt(node.weight * 50)); }) //Radius by weight
        .attr("stroke", "#999")
        .attr("stroke-width", 3)
        .attr("fill", function(node) { return color(node.group); }); //Give them a color

    var text = svg.selectAll(".text") //Make a new category
        .data(graph.nodes).enter().append("text") //Make labels from the data
        .attr("pointer-events", "none")
        .attr("font", "10px sans-serif")
        .attr("color", "black")
        .text(function(node) { return node.id; });

    var arrowHead = svg.selectAll(".arrows") //Make a new category
        .data(graph.links).enter().append("arrow").append("marker") //Make arrows from the data
        .attr("id", function(link) { return link.id; })
        .attr("viewBox", "0 -5 10 10") //How much to show
        .attr("refX", function(link) {
            var targetNode = graph.nodes.filter(node => node.id === link.target);
            return 10 * targetNode[0].weight;
        }) //Offset from center
        .attr("markerWidth", 8) //Must equal each other
        .attr("markerHeight", 8) //Must equal each other
        .attr("orient", "auto")
        .append("svg:path") //Appends the path
        .attr("d", "M 0, -5 L 10, 0 L 0, 5"); //Specifies the shape

    simulation
        .nodes(graph.nodes) //Take the nodes we made,
        .on("tick", ticked); // and iterate them in the simulation
    simulation
        .force("link") //Take the links we made,
        .links(graph.links); // and iterate them in the simulation

    function ticked() {
        link //For links, that means figuring out start and end points
          .attr("x1", function(link) { return link.source.x; })
          .attr("y1", function(link) { return link.source.y; })
          .attr("x2", function(link) { return link.target.x; })
          .attr("y2", function(link) { return link.target.y; });
        node
          .attr("transform", function(node) {
              return "translate(" + node.x + "," + node.y + ")";
          });
        text
          .attr("x", function(text) { return text.x; })
          .attr("y", function (text) { return text.y - 10; });
    }

  });
}]);
