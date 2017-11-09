var svg = d3.select("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

var width = +svg.attr("width");
var height = +svg.attr("height");
 
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.name; }).strength(1).distance(200))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2));

graph = JSON.parse(myjson);

var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return 5; });

var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("image")
    .data(graph.nodes)
    .enter().append("image")
    .attr("height", "50px")
    .attr("width", "50px")
    .attr("href", function(d)
    {
        if (d.kind == "Host")
        {
            return 'media/computer.png';
        }
        else if (d.kind == "Switch")
        {
            return 'media/switch.png';
        }
        else if (d.kind == "Router")
        {
            return 'media/router.png'
        }
    })
    .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));



var lables = node.append("text")
    .text(function(d) {
        return d.name;
    })
    .attr('x', 6)
    .attr('y', 3);

//node.append("title")
//    .text(function(d) { return d.id; });

simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph.links);

function ticked()
{
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
    node
        .attr("x", function(d) { return d.x - 25; })
        .attr("y", function(d) { return d.y - 25; });
}

function dragstarted(d)
{
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d)
{
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d)
{
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}