function View2(Observer) {
	var view2 = {};
	// set the dimensions and sankey_margins of the graph
	var sankey_margin = {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10
	},
	width = $("#sankey").width() - sankey_margin.left - sankey_margin.right - 10,
	height = $("#sankey").height() - sankey_margin.top - sankey_margin.bottom;

	// append the sankey_svg object to the body of the page
	var sankey_svg = d3.select("#sankey").append("svg")
		.attr("width", width + sankey_margin.left + sankey_margin.right)
		.attr("height", height + sankey_margin.top + sankey_margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + sankey_margin.left + "," + sankey_margin.top + ")");

	// Color scale used
	var color = d3.scaleOrdinal(d3.schemeOranges[9]);

	// load the data
	d3.json("./data/sankey.json", function (graph) {
		// Constructs a new Sankey generator with the default settings.
		//console.log(graph.nodes)
		var sankey = d3.sankey()
			.nodeWidth(10)
			.nodePadding(5)
			.size([width, height])
			.nodes(graph.nodes)
			.links(graph.links)
			.layout(3);

		// add in the links
		var link = sankey_svg.append("g")
			.selectAll(".sankey_link")
			.data(graph.links)
			.enter()
			.append("path")
			.attr("class", "sankey_link")
			.attr("d", sankey.link())
			.style("stroke-width", function (d) {
				return Math.max(1, d.dy);
			})
			.sort(function (a, b) {
				return b.dy - a.dy;
			})
			.append("title")
			.text(function (d) {
				return d.value;
			});

		// add in the nodes
		var node = sankey_svg.append("g")
			.selectAll(".sankey_node")
			.data(graph.nodes)
			.enter().append("g")
			.attr("class", "sankey_node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			.call(d3.drag()
				.subject(function (d) {
					return d;
				})
				.on("start", function () {
					this.parentNode.appendChild(this);
				})
				.on("drag", dragmove));

		// add the rectangles for the nodes
		node
		.append("rect")
		.attr("height", function (d) {
			return d.dy;
		})
		.attr("width", sankey.nodeWidth())
		.style("fill", function (d) {

			return d.color = color(d.name.replace(/ .*/, ""));
		})
		.style("opacity", 0.7)
		// Add hover text
		.append("title")
		.text(function (d) {
			return d.name + ":" + d.value;
		});

		node.on("mouseover", function (d) {
			//console.log(d.coor);
			Observer.fireEvent("drawSankey",[d.coor],View2);
		});

		// add in the title for the nodes
		node.append("text")
		.attr("x", -6)
		.attr("y", function (d) {
			return d.dy / 2;
		})
		.attr("dy", ".30em")
		.attr("text-anchor", "end")
		.attr("transform", null)
		.attr("font-size", "10")
		.style("fill", "#cab485")
		.text(function (d) {
			return d.name;
		})
		.filter(function (d) {
			return d.x < width / 2;
		})
		.attr("x", 6 + sankey.nodeWidth())
		.attr("text-anchor", "start");

		// the function for moving the nodes
		function dragmove(d) {
			d3.select(this)
			.attr("transform",
				"translate("
				 + d.x + ","
				 + (d.y = Math.max(
							0, Math.min(height - d.dy, d3.event.y))) + ")");
			sankey.relayout();
			link.attr("d", sankey.link());
		}
	});

	Observer.addView(view2);
	return view2;
}
