function View1(Observer) {
	var view1 = {};

	var url = 'https://api.mapbox.com/styles/v1/iteapoy/cjwhifsfi05pa1cmt0xx4yx19/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaXRlYXBveSIsImEiOiJjanc0bGIxM2YwcTdmNGJvM3ozZnMwd2JiIn0.Me_7fZJysfm09TGQQf9Rjg';
	//初始化 地图
	var leafletMap = L.map('mapid').setView([30.457, 104.027], 12); // 热力图[30.465520, 104.014870], 13  // 散点图[30.555520, 104.024870], 11
	//将图层加载到地图上，并设置最大的聚焦还有map样式
	L.tileLayer(url, {
		maxZoom: 18,
		id: 'mapbox.streets'
	}).addTo(leafletMap);

	var num = 1;
	var tt = '';
	var ty = "start";
	var current_h = 1;
	var time_reflect = {
		"1":1525104122, "2":1525107722, "3":1525111322, "4":1525114922, "5":1525118522, "6":1525122122, "7":1525125722,
		"8":1525129322, "9":1525132922, "10":1525136522, "11":1525140122, "12":1525143722, "13":1525147322, "14":1525150922,
		"15":1525154522, "16":1525158122, "17":1525161722, "18":1525165322, "19":1525168922, "20":1525172522, "21":1525176122,
		"22":1525179722, "23":1525183322, "24":1525186922, "25":1525190522
	};

	var cfg = {
		"radius": 0.001,
		"maxOpacity": 0.6, //设置每一个热力点的半径
		"scaleRadius": true,
		"useLocalExtrema": false,
		/*"gradient":{
			0.1:'rgb(70, 122, 255)',
			0.3:'rgb(34, 174, 255)',
			0.5:'rgb(245, 51, 87)',
			0.8:'rgb(245, 101, 51)',
			0.9:'rgb(250, 179, 34)',
			1.0:'rgb(255, 217, 100)',
		},*/
		latField: 'latitude',
		lngField: 'longitude',
		valueField: 'value', //热力点的值
	};
	var heatmapLayer = new HeatmapOverlay(cfg);
	var gradient = {
		0.2:'rgb(255, 255, 255)',
		0.5:'rgb(255, 110, 0)',
		0.8:'rgb(255, 0, 0)',
	};
	/*heatmapLayer.setOptions({
		"gradient":gradient
	});*/
	leafletMap.addLayer(heatmapLayer);

	var svg = d3.select(leafletMap.getPanes().overlayPane).append("svg").style('z-index', '4'),
	g = svg.append("g").attr("class", "leaflet-zoom-hide")
		.attr("id", "top-point")
		.attr("color", '#cab485');

	var svg_map = d3.select(leafletMap.getPanes().overlayPane).append("svg").style('z-index','1')
		.attr("width", 900)
		.attr("height", 900),
	g_map = svg_map.append("g").attr("class", "leaflet-zoom-hide").attr('id', 'sankey-g');

	var svg_map2 = d3.select(leafletMap.getPanes().overlayPane).append("svg").style('z-index','2')
			.attr("width", 900)
			.attr("height", 900),
		g_map2 = svg_map2.append("g").attr("class", "leaflet-zoom-hide").attr('id', 'heat1');

	var svg_map3 = d3.select(leafletMap.getPanes().overlayPane).append("svg").style('z-index','3')
			.attr("width", 900)
			.attr("height", 900),
		g_map3 = svg_map3.append("g").attr("class", "leaflet-zoom-hide").attr('id', 'heat2');

	var svg3 = d3.select(leafletMap.getPanes().overlayPane).append("svg").style('z-index', '10'),
	g3 = svg3.append("g").attr("class", "leaflet-zoom-hide").attr('id', 'myPoints');

	var width3 = 270;
	var height3 = 200;
	var padding3 = {
		top: 30,
		right: 30,
		bottom: 30,
		left: 30
	};

	var speedSVG = d3.select("#linechart")
		.append("svg")
		.attr("width", width3)
		.attr("height", height3);

	var xScale3 = d3.scaleLinear()
		.domain([0, 100])
		.range([0, width3 - padding3.left - padding3.right]);

	var yScale3 = d3.scaleLinear()
		.domain([0, 100])
		.range([height3 - padding3.bottom - padding3.top, 0]);

	speedSVG.append("path")
	.attr('id', 'speedPath')
	.attr('fill', 'none')
	.attr("transform", "translate(" + padding3.left + "," + padding3.top + ")")
	.attr("stroke-width", 1.5)
	.attr('stroke', '#E38279');

	var line3 = d3.line()
		.x(function (d) {
			return xScale3(d.time);
		})
		.y(function (d) {
			return yScale3(d.speed);
		});

	var xAxis3 = d3.axisBottom()
		.scale(xScale3)
		.ticks(5);
	//.tickFormat(d3.format("d"))
	//.orient("bottom");

	var yAxis3 = d3.axisLeft()
		.scale(yScale3);

	speedSVG.append("g")
	.attr("class", "X Axis")
	.attr("id", "xaxis")
	.attr("transform", "translate(" + padding3.left + "," + (height3 - padding3.top) + ")")
	.call(xAxis3)
	.selectAll("text")
	.style("fill", "#a99175");

	speedSVG.append("g")
	.attr("class", "Y Axis")
	.attr("id", "yaxis")
	.attr("transform", "translate(" + padding3.left + "," + padding3.top + ")")
	.call(yAxis3)
	.selectAll("text")
	.style("fill", "#a99175");

	Date.prototype.Format = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};


	//热力图
	function drawHeatmap() {
		var file = "./data/GPS_HEAT_BY_HOUR/frequency_";
		file += num.toString();
		file += ".json";
		//console.log(file);

		d3.json(file, function (data) {
			data = {
				'max': 600,
				'data': data
			};

			heatmapLayer.setData(data);
		})
	}

	var opt = "heatmap";

	/*
	** heat map
	 */
	drawHeatmap();
	document.getElementById('button_s').style.display = 'none';
	document.getElementById('button_r').style.display = 'none';

	/*
	** timeaxis
	 */
	function timeaxis() {

		d3.json("data/car_num_by_hour.json", function (error, data) {
			if (error) {
				throw error;
			}

			var timeaxis = $("#timeaxis");
			var w = timeaxis.width() - 10;
			var h = timeaxis.height() - 10;

			var margin2 = {
				top: 9,
				right: 7,
				bottom: 18,
				left: 7
			},
			width2 = w - margin2.left - margin2.right,
			height2 = h - margin2.top - margin2.bottom;

			var svg2;
			svg2 = d3.select("#timeaxis")
				.append("svg")
				.attr("width", width2 + margin2.left + margin2.right)
				.attr("height", height2 + margin2.top + margin2.bottom)
				.append("g")
				.attr("transform",
					"translate(" + margin2.left + "," + margin2.top + ")");

			var xScale = d3.scaleBand()
				.domain(data.map(function (d) {
						return d.hour;
					}))
				.padding(0.4)
				.range([0, width2]);
			var yScale = d3.scaleLinear().range([height2, 0])
				.domain([d3.min(data, function (d) {
							return d.value;
						}), d3.max(data, function (d) {
							return d.value;
						})]);

			var xAxis = d3.axisBottom(xScale);

			svg2.append("g")
			.attr("transform", "translate(0," + height2 + ")")
			.attr("class", "x axis")
			.style("fill", "#1380FF")
			.style("font-size", 10)
			//.attr("stroke", "#4682B4")
			//.attr("stroke-width", 1)
			.call(xAxis)
			.selectAll("text")
			.style("fill", "#1380FF")
			.attr("transform", "translate(0,2)rotate(0)")
			.style("text-anchor", "middle");

			// Add the points
			svg2.append("g")
			.selectAll("dot")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", function (d) {
				return xScale(d.hour) + xScale.bandwidth() / 2
			})
			.attr("cy", height2)
			.attr("r", 2.5)
			.attr("fill", "#222222")
			.attr("stroke", "#1E90FF")
			.attr("stroke-width", 2)
			.on("mouseover", function (d, i) {
				d3.select(this)
				.transition()
				.attr("stroke", "#AABBEE")
				.attr("stroke-width", 2.5);
				if (opt == "heatmap") {
					tooltip
					.style("opacity", 1);

					num = d.hour;
					drawHeatmap();
					heatmapUpdate(num);
					co_occ_Update(num);
					stackbarUpdate(num);
					CircleUpdate1(num);
				} else if (opt == "routing") {
					tooltip
					.style("opacity", 1);

					num = d.hour;
					drawBeginEnd();
					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				} else {
					tooltip
					.style("opacity", 1);

					num = d.hour;
					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				}
				//return tooltip.style('visibility', 'visible').text(d.startDate);
			})
			.on("click", function (d, i) {
				if (opt == "heatmap") {
					tooltip
					.style("opacity", 1);

					num = d.hour;
					drawHeatmap();
					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				} else if (opt == "routing") {
					tooltip
					.style("opacity", 1);

					num = d.hour;
					drawBeginEnd();
					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				} else {
					tooltip
					.style("opacity", 1);

					num = d.hour;

					current_h = num;
					range = time_reflect[current_h.toString()];
					var commonTime = new Date(range * 1000).Format("yyyy-MM-dd hh:mm:ss");
					document.getElementById("time").innerHTML = commonTime;

					//realTimeMap();
					if (tt != '')
						tt.stop();

					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				}
			})
			.on("mouseout", function (d, i) {
				d3.select(this)
				.transition()
				.attr("stroke", "#1E90FF")
				.attr("stroke-width", 2);

			});

			// create a tooltip
			var tooltip = d3.select("#timeaxis")
				.append("div")
				.style("opacity", 0)
				.attr("class", "tooltip");

			// Three function that change the tooltip when user hover / move / leave a cell
			var mouseover1 = function (d) {
				if (opt == "heatmap") {
					tooltip
					.style("opacity", 1);
					d3.select(this)
					.style("stroke", "black")
					.style("opacity", 1);
					num = d.hour;
					drawHeatmap();
					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				} else if (opt == "routing") {
					tooltip
					.style("opacity", 1);
					d3.select(this)
					.style("stroke", "black")
					.style("opacity", 1);
					num = d.hour;
					drawBeginEnd();
					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				} else {
					tooltip
					.style("opacity", 1);
					d3.select(this)
					.style("stroke", "black")
					.style("opacity", 1);
					num = d.hour;

					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				}
			};

			var click1 = function (d) {
				if (opt == "heatmap") {
					tooltip
						.style("opacity", 1);
					d3.select(this)
						.style("stroke", "black")
						.style("opacity", 1);
					num = d.hour;
					drawHeatmap();
					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				} else if (opt == "routing") {
					tooltip
						.style("opacity", 1);
					d3.select(this)
						.style("stroke", "black")
						.style("opacity", 1);
					num = d.hour;
					drawBeginEnd();
					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				} else {
					tooltip
						.style("opacity", 1);
					d3.select(this)
						.style("stroke", "black")
						.style("opacity", 1);
					num = d.hour;

					//console.log(num);
					current_h = num;
					range = time_reflect[current_h.toString()];
					var commonTime = new Date(range * 1000).Format("yyyy-MM-dd hh:mm:ss");
					document.getElementById("time").innerHTML = commonTime;


					//realTimeMap();
					if (tt != '')
						tt.stop();

					heatmapUpdate(num);
					co_occ_Update(num);
					CircleUpdate1(num);
					stackbarUpdate(num);
				}
			};


			var mousemove1 = function (d) {

				tooltip
				.html(d.hour - 1 + ":00 - " + d.hour + ":00 : " + d.value)
				.style("left", (d3.mouse(this)[0] + 70) + "px")
				.style("top", (d3.mouse(this)[1]) + "px")

			};
			var mouseleave1 = function (d) {

				tooltip
				.style("opacity", 0);
				d3.select(this)
				.style("stroke", "none")
				.style("opacity", 0.5);

			};

			// bars
			svg2.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function (d) {
				return xScale(d.hour);
			})
			.attr("y", function (d) {
				return yScale(d.value);
			})
			.attr("width", xScale.bandwidth())
			.attr("height", function (d) {
				return height2 - yScale(d.value);
			})
			.on("click", click1)
			.on("mouseover", mouseover1)
			.on("mousemove", mousemove1)
			.on("mouseleave", mouseleave1);
		});

	}

	timeaxis();

	/*
	** heatmap(squares)
 	*/
	function heatmap() {
		var heatmap = $("#heatmap");
		var w = heatmap.width();
		var h = heatmap.height()+10;

		// set the dimensions and margins of the graph
		var margin = {
			top: 20,
			right: 15,
			bottom: 30,
			left: 45
		},
		width = w - margin.left - margin.right,
		height = h - margin.top - margin.bottom;

		// append the svg object to the body of the page
		var svg = d3.select("#heatmap")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");

		//Read the data
		d3.json("data/FREQUENCY_ORDER/frequency_10_1.json", function (data) {

			// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
			var Hours = d3.map(data, function (d) {
					return d.hour;
				}).keys();
			var Locations = d3.map(data, function (d) {
					return d.location;
				}).keys();

			// Build X scales and axis:
			var x = d3.scaleBand()
				.range([0, width])
				.domain(Hours)
				.padding(0.05);
			svg.append("g")
			.style("font-size", 10)
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).tickSize(0))

				.selectAll("text")
				.style("fill", "#cab485")
				.attr("transform", "translate(0,1)rotate(0)")
				.style("text-anchor", "middle")

			.select(".domain").remove();

			// Build Y scales and axis:
			var y = d3.scaleBand()
				.range([0, height])
				.domain(Locations)
				.padding(0.05);
			svg.append("g")
			.style("font-size", 11)
			.call(d3.axisLeft(y).tickSize(0))

				.selectAll("text")
				.style("fill", "#cab485")
				.attr("transform", "translate(0,0)rotate(0)")
				.style("text-anchor", "end")
			.select(".domain").remove();

			// Build color scale
			var myColor = d3.scaleSequential()
				.interpolator(d3.interpolateInferno)
				.domain([600, 0]);

			// create a tooltip
			var tooltip = d3.select("#heatmap")
				.append("div")
				.style("opacity", 0)
				.attr("class", "tooltip");

			// Three function that change the tooltip when user hover / move / leave a cell
			var mouseover = function (d) {
				tooltip
				.style("opacity", 1);
				d3.select(this)
				.style("stroke", "black")
				.style("opacity", 1);
				d3.select("#top-point").select("#" + d.location)
				.style("opacity", "1")
				.style("stroke", "black");

				var ps = [{"longitude":d.longitude, "latitude":d.latitude}];

				svg_map2.attr("height",900).attr("width",900);

				g_map2.selectAll(".heat1-circle")
					.data(ps)
					.enter()
					.append("circle")
					.attr("class", "heat1-circle");
				g_map2.selectAll(".heat1-circle")
					.transition()
					.attr('cx', function (d1) {
						//console.log(d[0]);

						return leafletMap.latLngToLayerPoint(L.latLng(d1.latitude, d1.longitude)).x;
					})
					.attr('cy', function (d1) {
						return leafletMap.latLngToLayerPoint(L.latLng(d1.latitude, d1.longitude)).y;
					})
					.attr('r', function (d1) {
						return 5 * 0.0002 * Math.pow(2, leafletMap.getZoom());
					})
					.attr("stroke-width", function (d1) {
						return 2.1 * 0.0002 * Math.pow(2, leafletMap.getZoom());
					})
					.style("stroke", "#a1d2ea")
					.attr("fill", "#51629a")
					.attr("opacity",0.9);

				function adjustSVG() {
					var SVGparent = d3.select(leafletMap.getPanes().mapPane);
					var moveXY = SVGparent._groups[0][0]._leaflet_pos;

					svg_map2.style("left", -moveXY.x + "px")
						.style("top", -moveXY.y + "px");

					g_map2.attr("transform", "translate(" + moveXY.x + "," + moveXY.y + ")");
				}

				function adjustCircle() {
					g_map2.selectAll("circle")
						.attr('cx', function (d1) {
							return leafletMap.latLngToLayerPoint(L.latLng(d1.latitude, d1.longitude)).x;
						})
						.attr('cy', function (d1) {
							return leafletMap.latLngToLayerPoint(L.latLng(d1.latitude, d1.longitude)).y;
						})
						.attr('r', function (d1) {
							return 5 * 0.0002 * Math.pow(2, leafletMap.getZoom());
						})
						.attr("stroke-width", function (d1) {
							return 1.5 * 0.0002 * Math.pow(2, leafletMap.getZoom());
						});
				}

				//鼠标缩放操作
				function onMapZoom() {
					adjustCircle();
				}
				leafletMap.on('mouseup', adjustSVG);
				leafletMap.on('zoom', onMapZoom);

			};

			var mousemove = function (d) {
				tooltip
				.html("(" + d.longitude + " , " + d.latitude + "): " + d.value)
				.style("left", (d3.mouse(this)[0] + 70) + "px")
				.style("top", (d3.mouse(this)[1]) + "px")
			};
			var mouseleave = function (d) {
				tooltip
				.style("opacity", 0);
				d3.select(this)
				.style("stroke", "none")
				.style("opacity", 0.8);
				d3.select("#top-point").select("#" + d.location)
				.style("opacity", "0.5")
				.style("stroke", "#FFcE88");


				g_map2.selectAll(".heat1-circle")
					.transition()
					.attr("stroke-width", function (d1) {
						return 1.5 * 0.0002 * Math.pow(2, leafletMap.getZoom());
					})
					.attr("fill", "none")
					.style("stroke", "#98b8cf");
			};

			// add the squares
			svg.selectAll()
			.data(data, function (d) {
				return d.hour + ':' + d.location;
			})
			.enter()
			.append("rect")
			.attr("class", "square")
			.attr("x", function (d) {
				return x(d.hour)
			})
			.attr("y", function (d) {
				return y(d.location)
			})
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("width", x.bandwidth())
			.attr("height", y.bandwidth())
			.style("fill", function (d) {
				return myColor(d.value)
			})
			.style("stroke-width", 4)
			.style("stroke", "none")
			.style("opacity", 0.8)
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
		});

		// // Add title to graph
		// svg.append("text")
		//     .attr("x", 0)
		//     .attr("y", -50)
		//     .attr("text-anchor", "left")
		//     .style("font-size", "22px")
		//     .text("A d3.js heatmap");
		//
		// // Add subtitle to graph
		// svg.append("text")
		//     .attr("x", 0)
		//     .attr("y", -20)
		//     .attr("text-anchor", "left")
		//     .style("font-size", "14px")
		//     .style("fill", "grey")
		//     .style("max-width", 400)
		//     .text("A short description of the take-away message of this chart.");

	}

	function heatmapUpdate(hour) {

		var file = "data/FREQUENCY_ORDER/frequency_10_";
		file += hour.toString();
		file += ".json";

		d3.json(file, function (data) {
			// Build color scale
			var myColor = d3.scaleSequential()
				.interpolator(d3.interpolateInferno)
				.domain([600, 0]);

			d3.select('#heatmap').selectAll('.square')
			.data(data, function (d) {
				return d.hour + ':' + d.location;
			})
			.transition()
			.style("fill", function (d) {
				return myColor(d.value)
			})

		});

	}

	heatmap();

	/*
	** heatmap2(squares)
 	*/
	function co_occ() {
		var heatmap = $("#co_occ");
		var w = heatmap.width();
		var h = heatmap.height();
		// set the dimensions and margins of the graph
		var margin = {
			top: 25,
			right: 15,
			bottom: 25,
			left: 45
		},
		width = w - margin.left - margin.right,
		height = h - margin.top - margin.bottom;

		// append the svg object to the body of the page
		var svg = d3.select("#co_occ")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");

		//Read the data
		d3.json("data/CO_OCCURRENCE/co_occurrence_1.json", function (data) {

			// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
			var Hours = d3.map(data, function (d) {
					return d.s1;
				}).keys();
			var Locations = d3.map(data, function (d) {
					return d.s2;
				}).keys();

			// Build X scales and axis:
			var x = d3.scaleBand()
				.range([0, width])
				.domain(Hours)
				.padding(0.05);
			svg.append("g")
			.style("font-size", 10)
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).tickSize(0))
				.selectAll("text")
				.style("fill", "#cab485")
				.attr("transform", "translate(0,4)rotate(23)")
				.style("text-anchor", "middle")
			.select(".domain").remove();

			// Build Y scales and axis:
			var y = d3.scaleBand()
				.range([0, height])
				.domain(Locations)
				.padding(0.05);
			svg.append("g")
			.style("font-size", 11)
			.call(d3.axisLeft(y).tickSize(0))
				.selectAll("text")
				.style("fill", "#cab485")
				.attr("transform", "translate(0,0)rotate(0)")
				.style("text-anchor", "end")
			.select(".domain").remove();

			// Build color scale
			var myColor = d3.scaleSequential()
				.interpolator(d3.interpolateMagma)
				.domain([15, 0]);

			// create a tooltip
			var tooltip = d3.select("#co_occ")
				.append("div")
				.style("opacity", 0)
				.attr("class", "tooltip");

			// Three function that change the tooltip when user hover / move / leave a cell
			var mouseover = function (d) {
				tooltip
				.style("opacity", 1);
				d3.select(this)
				.style("stroke", "black")
				.style("opacity", 1);

				//console.log(d);
				var points = [{"latitude":d.s1_latitude, "longitude":d.s1_longitude, "name":"s1"}, {"latitude":d.s2_latitude, "longitude":d.s2_longitude, "name":"s2"}];

				svg_map3.attr("height",900).attr("width",900);

				g_map3.selectAll(".heat2-circle")
					.data(points)
					.enter()
					.append("circle")
					.attr("class", "heat2-circle");
				g_map3.selectAll(".heat2-circle")
					.transition()
					.attr('cx', function (d1) {
						//console.log(d[0]);

						return leafletMap.latLngToLayerPoint(L.latLng(d1.latitude, d1.longitude)).x;
					})
					.attr('cy', function (d1) {
						return leafletMap.latLngToLayerPoint(L.latLng(d1.latitude, d1.longitude)).y;
					})
					.attr('r', function (d1) {
						return 6 * 0.0002 * Math.pow(2, leafletMap.getZoom());
					})
					.attr("stroke-width", function (d1) {
						return 2.1 * 0.0002 * Math.pow(2, leafletMap.getZoom());
					})
					.style("stroke", "#ecb2da")
					.attr("fill", "#5c627a")
					.attr("opacity",0.9);

				function adjustSVG() {
					var SVGparent = d3.select(leafletMap.getPanes().mapPane);
					var moveXY = SVGparent._groups[0][0]._leaflet_pos;

					svg_map3.style("left", -moveXY.x + "px")
						.style("top", -moveXY.y + "px");

					g_map3.attr("transform", "translate(" + moveXY.x + "," + moveXY.y + ")");
				}

				function adjustCircle() {
					g_map3.selectAll("circle")
						.attr('cx', function (d1) {
							return leafletMap.latLngToLayerPoint(L.latLng(d1.latitude, d1.longitude)).x;
						})
						.attr('cy', function (d1) {
							return leafletMap.latLngToLayerPoint(L.latLng(d1.latitude, d1.longitude)).y;
						})
						.attr('r', function (d1) {
							return 6 * 0.0002 * Math.pow(2, leafletMap.getZoom());
						})
						.attr("stroke-width", function (d1) {
							return 1.5 * 0.0002 * Math.pow(2, leafletMap.getZoom());
						});
				}

				//鼠标缩放操作
				function onMapZoom() {
					adjustCircle();
				}
				leafletMap.on('mouseup', adjustSVG);
				leafletMap.on('zoom', onMapZoom);
			};

			var mousemove = function (d) {
				tooltip
				.html(d.value)
				.style("left", (d3.mouse(this)[0] + 70) + "px")
				.style("top", (d3.mouse(this)[1]) + "px")
			};
			var mouseleave = function (d) {
				tooltip
				.style("opacity", 0);
				d3.select(this)
				.style("stroke", "none")
				.style("opacity", 0.8);

				g_map3.selectAll(".heat2-circle")
					.transition()
					.attr("stroke-width", function (d1) {
						return 1.5 * 0.0002 * Math.pow(2, leafletMap.getZoom());
					})
					.attr("fill", "none")
					.style("stroke", "#cca2ca");
			};

			// add the squares
			svg.selectAll()
			.data(data, function (d) {
				return d.s1 + ':' + d.s2;
			})
			.enter()
			.append("rect")
			.attr("class", "square")
			.attr("x", function (d) {
				return x(d.s1)
			})
			.attr("y", function (d) {
				return y(d.s2)
			})
			.attr("rx", 1)
			.attr("ry", 1)
			.attr("width", x.bandwidth())
			.attr("height", y.bandwidth())
			.style("fill", function (d) {
				return myColor(d.value)
			})
			.style("stroke-width", 4)
			.style("stroke", "none")
			.style("opacity", 0.8)
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
		});

		// // Add title to graph
		// svg.append("text")
		//     .attr("x", 0)
		//     .attr("y", -50)
		//     .attr("text-anchor", "left")
		//     .style("font-size", "22px")
		//     .text("A d3.js heatmap");
		//
		// // Add subtitle to graph
		// svg.append("text")
		//     .attr("x", 0)
		//     .attr("y", -20)
		//     .attr("text-anchor", "left")
		//     .style("font-size", "14px")
		//     .style("fill", "grey")
		//     .style("max-width", 400)
		//     .text("A short description of the take-away message of this chart.");

	}

	function co_occ_Update(hour) {
		var file = "data/CO_OCCURRENCE/co_occurrence_";
		file += hour.toString();
		file += ".json";

		d3.json(file, function (data) {
			// Build color scale
			var myColor = d3.scaleSequential()
				.interpolator(d3.interpolateMagma)
				.domain([15, 0]);

			d3.select('#co_occ').selectAll('.square')
			.data(data, function (d) {
				return d.s1 + ':' + d.s2;
			})
			.transition()
			.style("fill", function (d) {
				//console.log(d.value);
				return myColor(d.value)
			})

		});
	}

	co_occ();


	/*
	** stack chart
	 */
	function stackbar() {
		var heatmap = $("#stack");
		var w = heatmap.width();
		var h = heatmap.height();
		// create the svg
		var margin = {
			top: 15,
			right: 48,
			bottom: 22,
			left: 42
		};

		var width = w - margin.left - margin.right,
		height = h - margin.top - margin.bottom;

		var svg3 = d3.select("#stack")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// load the csv and create the chart
		d3.json("data/FREQUENCY_ORDER/around/1.json", function (error, data) {
			if (error)
				throw error;

			// Transpose the data into layers
			var dataset = d3.layout.stack()(["Point1", "Point2", "Point3", "Point4", "Point5", "Point6", "Point7", "Point8", "Point9", "Point10"]
					.map(function (point) {
						return data.map(function (d) {
							return {
								x: d.name,
								y: +d[point],
								z: point
							};
						});
					}));
			//console.log(dataset);
			var Hours = d3.map(data, function (d) {
					return d.name;
				}).keys();
			var x = d3.scaleBand()
				.range([0, width])
				.domain(Hours)
				.padding(0.08);
			var y = d3.scaleLinear()
				.domain([0, d3.max(dataset, function (d) {
							return d3.max(d, function (d) {
								return d.y0 + d.y;
							});
						})])
				.range([height, 0]);

			var colors = ["#4288B5", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#F0704A", "#D13C4B"];

			// Define and draw axes
			var yAxis = d3.axisLeft(y)
				.ticks(5)
				.tickFormat(function (d) {
					return d
				});

			var xAxis = d3.axisBottom(x);

			svg3.append("g")
			.attr("class", "y Axis")
			.call(yAxis)
				.style("font-size", 10)
				.selectAll("text")
				.style("fill", "#cab485")
				.attr("transform", "translate(0,2)rotate(0)")
				.style("text-anchor", "end")
			.selectAll(".domain").remove();

			svg3.append("g")
			.attr("class", "x Axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
				.style("font-size", 9)
				.selectAll("text")
				.style("fill", "#cab485")

				.attr("transform", "translate(0,-0.5)rotate(0)")
				.style("text-anchor", "middle");

			// create a tooltip
			var tooltip = d3.select("#co_occ")
				.append("div")
				.style("opacity", 0)
				.attr("class", "tooltip");

			// Create groups for each series, rects for each segment
			var groups = svg3.selectAll("g.traffic")
				.data(dataset)
				.enter().append("g")
				.attr("class", "traffic")
				.style("fill", function (d, i) {
					return colors[i];
				});

			var rect = groups.selectAll("rect")
				.data(function (d) {

					return d;
				})
				.enter()
				.append("rect")
				.attr("x", function (d) {
					return x(d.x);
				})
				.attr("y", function (d) {
					return y(d.y0 + d.y);
				})
				.attr("height", function (d) {
					return y(d.y0) - y(d.y0 + d.y);
				})
				.attr("width", x.bandwidth())
				.on("mouseover", function (d) {
					tooltip.style("opacity", "0.8");
					console.log(d);
				})
				.on("mouseout", function (d) {
					tooltip.style("opacity", "0");
				})
				.on("mousemove", function (d) {
					tooltip
					.html(d.z + " : " + d.y)
				});

			// Draw legend
			var legend = svg3.selectAll(".legend")
				.data(colors)
				.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function (d, i) {
					return "translate(30," + i * 19 + ")";
				});

			legend.append("rect")
			.attr("x", width - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", function (d, i) {
				return colors.slice().reverse()[i];
			})
			.on("mouseover", function (d) {
				tooltip.style("opacity", "0.8");
			})
			.on("mouseout", function (d) {
				tooltip.style("opacity", "0");
			})
			.on("mousemove", function (d, i) {
				tooltip
				.html("Point" + (10 - i).toString())
			});
		});

	}

	function stackbarUpdate(hour) {
		var stack = $("#stack");
		var h = stack.height();
		// create the svg
		var margin = {
			top: 15,
			right: 50,
			bottom: 20,
			left: 50
		};

		var height = h - margin.top - margin.bottom;

		var file = "data/FREQUENCY_ORDER/around/";
		file += hour.toString();
		file += ".json";

		d3.json(file, function (data) {
			// Transpose the data into layers
			var dataset = d3.layout.stack()(["Point1", "Point2", "Point3", "Point4", "Point5", "Point6", "Point7", "Point8", "Point9", "Point10"]
					.map(function (point) {
						return data.map(function (d) {
							return {
								x: d.name,
								y: +d[point],
								z: point
							};
						});
					}));

			var y = d3.scale.linear()
				.domain([0, d3.max(dataset, function (d) {
							return d3.max(d, function (d) {
								return d.y0 + d.y;
							});
						})])
				.range([height, 0]);

			var colors = ["#4288B5", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#F0704A", "#D13C4B"];

			// Define and draw axes
			var yAxis = d3.axisLeft(y)
				.ticks(5)
				.tickFormat(function (d) {
					return d
				});

			var svg3 = d3.select("#stack").select("svg");
			svg3.select(".y axis")
			.transition()
			.call(yAxis);

			// Create groups for each series, rects for each segment
			svg3.selectAll("g.traffic")
			.data(dataset);

			var g = svg3.selectAll("g.traffic");

			g.selectAll("rect")
			.data(function (d, i) {
				return d;
			})
			.transition()
			.attr("y", function (d) {
				return y(d.y0 + d.y);
			})
			.attr("height", function (d) {
				return y(d.y0) - y(d.y0 + d.y);
			});

		});
	}

	stackbar();

	function drawCircle1() {

		d3.json("data/FREQUENCY_ORDER/points/frequency_10point_1.json", function (data) {
			g.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("id", function (d) {
				return d.location
			})
			.attr("cx", function (d) {
				return leafletMap.latLngToLayerPoint(L.latLng(d.latitude, d.longitude)).x;
			})
			.attr("cy", function (d) {

				//console.log(L.latLng(d.x_axis, d.y_axis));
				return leafletMap.latLngToLayerPoint(L.latLng(d.latitude, d.longitude)).y;
			})
			.attr("r", function (d) {
				return (d.value / 70) * 0.0002 * Math.pow(2, leafletMap.getZoom());
			})
			.style("fill", function (d) {
				return '#c56535';
			})
			.style("stroke", "#FFcE88")
			.attr("stroke-width", function (d) {
				return (d.value / 300) * 0.0002 * Math.pow(2, leafletMap.getZoom());
			})
			.style('opacity', 0.5)
			.on("mouseover", function (d, i) {})
			.on("click", function (d, i) {})
			.on("mouseout", function (d, i) {});
			/*
			d3.select("#btn_start")
			.on("click", function () {
			console.log("start");
			})

			d3.select("#btn_end")
			.on("click", function () {
			console.log("end");
			})
			 */
		});
	}

	function CircleUpdate1(hour) {
		var file = "data/FREQUENCY_ORDER/points/frequency_10point_";
		file += hour.toString();
		file += ".json";

		d3.json(file, function (data) {
			g.selectAll("circle")
			.data(data)
			.attr("id", function (d) {
				return d.location
			})
			.attr("cx", function (d) {
				return leafletMap.latLngToLayerPoint(L.latLng(d.latitude, d.longitude)).x;
			})
			.attr("cy", function (d) {

				//console.log(L.latLng(d.x_axis, d.y_axis));
				return leafletMap.latLngToLayerPoint(L.latLng(d.latitude, d.longitude)).y;
			})
			.attr("r", function (d) {
				return (d.value / 90) * 0.0002 * Math.pow(2, leafletMap.getZoom());
			})
			.style("fill", function (d) {
				return '#c56535';
			})
			.style("stroke", "#FFcE88")
			.attr("stroke-width", function (d) {

				return (d.value / 300) * 0.0002 * Math.pow(2, leafletMap.getZoom());
			})
			.style("opacity", "1");
		});
	}

	drawCircle1();

	//调整圆的大小，在onMapZoom中调用
	function adjustCircle1() {

		g.selectAll("circle")
		.attr('cx', function (o) {
			return leafletMap.latLngToLayerPoint([o.latitude, o.longitude]).x;
		})
		.attr('cy', function (o) {
			return leafletMap.latLngToLayerPoint([o.latitude, o.longitude]).y;
		})
		.attr('r', function (o) {
			return (o.value / 90) * 0.0002 * Math.pow(2, leafletMap.getZoom());
		})
		.attr("stroke-width", function (d) {

			return (d.value / 300) * 0.0002 * Math.pow(2, leafletMap.getZoom());
		});
	}

	function adjustSVG1() {
		var SVGparent = d3.select(leafletMap.getPanes().mapPane);
		var moveXY = SVGparent._groups[0][0]._leaflet_pos;

		svg.style("left", -moveXY.x + "px")
		.style("top", -moveXY.y + "px");

		g.attr("transform", "translate(" + moveXY.x + "," + moveXY.y + ")");
	}

	//鼠标缩放操作
	function onMapZoom1() {
		adjustCircle1();
	}

	function initial1() {
		svg.attr("width", 1500)
		.attr("height", 800);
	}

	//初始化画图的函数
	initial1();
	//事件响应
	leafletMap.on('zoom', onMapZoom1);
	leafletMap.on('mouseup', adjustSVG1);

	var circleData = [];

	var carID = ' ';
	var range = 1525104122;

	//d3.csv("./data/gps-20180501-WGS84-header.csv", function (data0) {



	function realTimeMap() {

		var file;

		file = "./data/REALTIME_GPS/";
		file += current_h.toString() + "/" + time_reflect[current_h.toString()].toString() + ".json";


		d3.json(file, function (data0) {

			for (var i = 0; i < data0.length; i++) {
				//for (var i = 0; i < data0.length; i++) {
				circleData.push({
					//"lat": data0[i].end_latitude,
					//"lng": data0[i].end_longitude
					"id": data0[i].order_id,
					"lat": data0[i].latitude,
					"lng": data0[i].longitude
				});
			}
			//console.log(circleData);

			//console.log(circleData);

			var jsonCircles = new Array();

			//function drawCircle() {

			circleData.forEach(function (d) {
				jsonCircles.push({
					"x_axis": d.lat,
					"y_axis": d.lng,
					"radius": 2.5,
					"color": "#cab485",
					"id": d.id
				});
			});

			g3.selectAll("circle").data([]).exit().remove();

			var t = g3.selectAll("circle")
				.data(jsonCircles);



			var circleAttributes =
				t.enter()
				.append("circle")
				.attr("cx", function (d) {
					return leafletMap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x;
				})
				.attr("cy", function (d) {

					//console.log(L.latLng(d.x_axis, d.y_axis));
					return leafletMap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y;
				})
				.attr("r", function (d) {
					return d.radius * 0.0002 * Math.pow(2, leafletMap.getZoom());
				})
				.style("fill", function (d) {
					return d.color;
				})

				.style('opacity', 0.8);
			//console.log(g3.selectAll("circle"));
			/*g3.selectAll("circle").on("click", function (d, i) {
			console.log("RUA!!!");
			});*/

			//console.log("2222");

			//}

			//调整圆的大小，在onMapZoom中调用
			function adjustCircle() {

				g3.selectAll("circle")
				.attr('cx', function (o) {
					//console.log(mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).x)
					return leafletMap.latLngToLayerPoint([o.x_axis, o.y_axis]).x;
				})
				.attr('cy', function (o) {
					return leafletMap.latLngToLayerPoint([o.x_axis, o.y_axis]).y;
				})
				.attr('r', function (o) {
					if (o.id == carID) {
						return 1.5 * 0.0002 * Math.pow(2, leafletMap.getZoom());
					}

					return o.radius * 0.0002 * Math.pow(2, leafletMap.getZoom());
				});
			}

			function update() {
				//range += 3;
				if (range < time_reflect[(current_h+1).toString()] - 4) {
					range += 3;
				}
				else {
					//if (current_h < 11) current_h += 1;
					if (current_h < 24) current_h += 1;
					else return;
					range = time_reflect[(current_h).toString()];
				}
					//var file2 = "./data/REALTIME_GPS/";
					//file += current_h.toString + "/" + time_reflect[current_h.toString] + ".json";
					d3.json("./data/REALTIME_GPS/" + current_h.toString() + "/" + range.toString() + ".json", function (data1) {

						//for (var i = 72000; i < 80000; i++) {
						circleData.splice(0, circleData.length);
						for (var i = 0; i < data1.length; i++) {
							circleData.push({
								//"lat": data0[i].end_latitude,
								//"lng": data0[i].end_longitude
								"id": data1[i].order_id,
								"lat": data1[i].latitude,
								"lng": data1[i].longitude
							});
						}
						jsonCircles.splice(0, jsonCircles.length);
						circleData.forEach(function (d) {
							jsonCircles.push({
								"x_axis": d.lat,
								"y_axis": d.lng,
								"radius": 2.5,

								"color": "#cab485",
								"id": d.id
							});
						});

						g3.selectAll("circle")
						.data(jsonCircles).exit().remove();
						g3.selectAll("circle")
						.data(jsonCircles).enter().append("circle");
						g3.selectAll("circle")
						.attr("cx", function (d) {
							return leafletMap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x;
						})
						.attr("cy", function (d) {

							//console.log(L.latLng(d.x_axis, d.y_axis));
							return leafletMap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y;
						})
						.attr("r", function (d) {
							return d.radius * 0.0002 * Math.pow(2, leafletMap.getZoom());
						})
						.style("fill", function (d) {
							return d.color;
						})
						.style('opacity', 0.8)
						.on("mouseover", function (d, i) {
							console.log("RUA!!!");
						});
					});
					//console.log(range);

			}

			/////
			function adjustSVG() {
				var SVGparent = d3.select(leafletMap.getPanes().mapPane);
				var moveXY = SVGparent._groups[0][0]._leaflet_pos;

				svg3.style("left", -moveXY.x + "px")
				.style("top", -moveXY.y + "px");

				g3.attr("transform", "translate(" + moveXY.x + "," + moveXY.y + ")");

				svg_map.style("left", -moveXY.x + "px")
				.style("top", -moveXY.y + "px");

				g_map.attr("transform", "translate(" + moveXY.x + "," + moveXY.y + ")");
			}

			//鼠标缩放操作
			function onMapZoom() {
				adjustCircle();
			}

			function initial() {
				svg3.attr("width", 1920)
				.attr("height", 1080);
				//drawCircle();
			}

			//初始化画图的函数
			initial();
			//事件响应
			leafletMap.on('zoom', onMapZoom);
			leafletMap.on('mouseup', adjustSVG);



			var commonTime_ = new Date(range * 1000).Format("yyyy-MM-dd hh:mm:ss");
			document.getElementById("time").innerHTML = commonTime_;
			//console.log(commonTime_);

			var bt_st = document.querySelector("#btn_st");

			bt_st.onclick = function () {
				range = time_reflect[current_h.toString()];

				//console.log(opt);
				if (opt != "realtime") {
					document.getElementById("time").innerHTML = '';
					range = time_reflect[current_h.toString()];
					if (tt != '')
						tt.stop();
					return;
				}

				if (tt == '') {
					tt = d3.timer(function (elapsed) {
							update();

							var commonTime = new Date(range * 1000).Format("yyyy-MM-dd hh:mm:ss");
							document.getElementById("time").innerHTML = commonTime;

						}, 40);
				} else {
					tt.restart(function (elapsed) {
						update();

						var commonTime = new Date(range * 1000).Format("yyyy-MM-dd hh:mm:ss");
						document.getElementById("time").innerHTML = commonTime;

					});
				}

				var bt_sp = document.querySelector("#btn_sp");
				bt_sp.onclick = function () {
					//console.log("opt");
					if (opt != "realtime") {
						document.getElementById("time").innerHTML = '';
						range = time_reflect[current_h.toString()];
						if (tt != '')
							tt.stop();
						return;
					}
					tt.stop();
				}

				var bt_co = document.querySelector("#btn_co");
				bt_co.onclick = function () {
					//console.log("opt");
					if (opt != "realtime") {
						document.getElementById("time").innerHTML = '';
						range = time_reflect[current_h.toString()];
						if (tt != '')
							tt.stop();
						return;
					}
					tt.restart(function (elapsed) {
						update();

						var commonTime = new Date(range * 1000).Format("yyyy-MM-dd hh:mm:ss");
						document.getElementById("time").innerHTML = commonTime;

					});
				}

			};

		})

	}

	function getRad(d) {
		var PI = Math.PI;
		return d * PI / 180.0;
	}

	function CoolWPDistance(lng1, lat1, lng2, lat2) {

		var f = getRad((lat1 / 1 + lat2 / 1) / 2) / 1;
		var g = getRad((lat1 - lat2) / 2) / 1;
		var l = getRad((lng1 - lng2) / 2) / 1;

		var sg = Math.sin(g);
		var sl = Math.sin(l);
		var sf = Math.sin(f);
		var s,
		c,
		w,
		r,
		d,
		h1,
		h2;
		var a = 6378137.0; //The Radius of eath in meter.
		var fl = 1 / 298.257;
		sg = sg * sg;
		sl = sl * sl;
		sf = sf * sf;
		s = sg * (1 - sl) + (1 - sf) * sl;
		c = (1 - sg) * (1 - sl) + sf * sl;
		w = Math.atan(Math.sqrt(s / c));
		r = Math.sqrt(s * c) / w;

		d = 2 * w * a;
		h1 = (3 * r - 1) / 2 / c;
		h2 = (3 * r + 1) / 2 / s;
		s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg)) / 1000;

		return s;
	}

	function drawBeginEnd() {
		var file;
		

		if (ty == "start")
			file = "./data/ORDER_BY_HOUR/ORDER_BY_HOUR_START/";
		else
			file = "./data/ORDER_BY_HOUR/ORDER_BY_HOUR_END/";
		file += num.toString();
		file += ".json";

		//d3.json("./data/order-uniq-20180501-WGS84-header.csv", function (data0) {
		d3.json(file, function (data0) {
			var start = 0;
			var interval = 2000;
			var end = start + interval;
			if (end > data0.length)
				end = data0.length;

			var jsonCircles = new Array();
			var trace = new Array();
			if (ty == "start") {
				for (var i = start; i < data0.length; i++) {
					jsonCircles.push({
						"orderId": data0[i].order_id,
						"x_axis": data0[i].s_latitude,
						"y_axis": data0[i].s_longitude,
						"radius": 1.5,
						"color": "#ffeaaa"
					});
				}
			} else {
				for (var i = start; i < data0.length; i++) {
					jsonCircles.push({
						"orderId": data0[i].order_id,
						"x_axis": data0[i].e_latitude,
						"y_axis": data0[i].e_longitude,
						"radius": 1.5,
						"color": "orange"
					});
				}
			}

			/*var colorScale = d3.scaleThreshold()
			.domain(d3.range(0, 1e-7, 1e-7 / 11))
			.range(d3.schemeRdYlGn[11]);*/

			var colorScale1 = d3.scaleThreshold()
				.domain([0, 15, 30, 45, 60, 75, 90])
				.range(['#ffffe0', '#ffd59b', '#ffa474', '#f47461', '#db4551', '#b81b34', '#8b0000']);

			function drawCircle() {
				//console.log('local')
				var t = g3.selectAll("circle")
					.data(jsonCircles);
				t.exit().remove();
				t.enter().append("circle");
				g3.selectAll("circle")
				.transition()
				.duration(1000)
				.attr("cx", function (d) {
					return leafletMap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x;
				})
				.attr("cy", function (d) {
					return leafletMap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y;
				})
				.attr("r", function (d) {
					return d.radius * 0.0002 * Math.pow(2, leafletMap.getZoom());
				})
				.style("fill", function (d) {

					return d.color;

				})

				.style("opacity", 0.5);
				//console.log('test')
				g3.selectAll("circle")

				.on("click", function (d) {
					//console.log(d.orderId);
					var times = 0;
					var speed;
					trace = [];
					var file2 = "./data/GPS_BY_HOUR/";
					file2 += num.toString();
					file2 += ".json";
					d3.json(file2, function (gps) {
						//d3.csv("./data/gps-part-20180501-WGS84-header.csv", function (gps) {
						//var times = 0;
						for (var i = 0; i < gps.length; i++) {
							if (gps[i].order_id == d.orderId) {
								if (times == 0) {
									var basetime = gps[i].time;
									times++;
								}
								trace.push({
									"x_axis": gps[i].latitude,
									"y_axis": gps[i].longitude,
									"radius": 1,
									"color": colorScale1(0),
									"speed": 0,
									"time": 3 * (gps[i].time - basetime)
								});
							}
						}

						for (var i = 0; i < trace.length - 1; i++) {
							speed = CoolWPDistance(trace[i].y_axis, trace[i].x_axis, trace[i + 1].y_axis, trace[i + 1].x_axis) * 1200.0;
							if (isNaN(speed))
								speed = 1;
							if (speed > 180)
								speed = 100;
							//console.log(speed);
							//speed = Math.pow((trace[i].x_axis - trace[i + 1].x_axis), 2) + Math.pow((trace[i].y_axis - trace[i + 1].y_axis), 2);
							trace[i].color = colorScale1(speed);
							trace[i].speed = speed;
							//console.log(speed);
							//console.log(trace[i].time);


						}
						drawTrace();
						drawLine();
					})
				})
			}

			function drawTrace() {
				//console.log('trace');
				var t = g3.selectAll("circle")
					.data(trace);
				t.exit().remove();
				t.enter().append("circle");
				g3.selectAll("circle")
				.transition()
				.duration(1000)
				.attr("cx", function (d) {
					return leafletMap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x;
				})
				.attr("cy", function (d) {
					return leafletMap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y;
				})
				.attr("r", function (d) {
					return d.radius * 0.0002 * Math.pow(2, leafletMap.getZoom());
				})
				.style("fill", function (d) {
					return d.color;
				})
				.style("opacity", 0.5);

				g3.selectAll("circle")
				.on("click", function (d) {
					console.log("click");
				})
				.on("mouseover", function (d) {
					console.log(d.speed);
					powerGauge.update(d.speed);
				})
			}

			// ----------------------更新折线图------------
			function drawLine() {
				xScale3.domain([0, d3.max(trace, function (d) {
							return d.time;
						})]);
				xAxis3.scale(xScale3);

				speedSVG.select('#speedPath')
				.datum(trace)
				.transition()
				.attr("d", line3);

				speedSVG.select('#xaxis').call(xAxis3)
					.selectAll("text")
					.style("fill", "#a99175");

				speedSVG.select('#yaxis').call(yAxis3)
					.selectAll("text")
					.style("fill", "#a99175");



			}

			d3.select("#btn_be")
			.on("click", function () {
				console.log("start");
				var end = start + interval;
				if (end > data0.length)
					end = data0.length;
				jsonCircles = new Array();

				for (var i = start; i < data0.length; i++) {
					jsonCircles.push({
						"orderId": data0[i].order_id,
						"x_axis": data0[i].s_latitude,
						"y_axis": data0[i].s_longitude,
						"radius": 1.5,
						"color": "#ffeaaa"
					});
				}
				ty = "start";
				drawCircle();
			});

			d3.select("#btn_en")
			.on("click", function () {
				console.log("end");
				jsonCircles = new Array();

				var file3 = "./data/ORDER_BY_HOUR/ORDER_BY_HOUR_END/";
				file3 += num.toString();
				file3 += ".json";

				//d3.json("./data/order-uniq-20180501-WGS84-header.csv", function (data0) {
				d3.json(file, function (data1) {
					for (var i = start; i < data1.length; i++) {
						jsonCircles.push({
							"orderId": data1[i].order_id,
							"x_axis": data1[i].e_latitude,
							"y_axis": data1[i].e_longitude,
							"radius": 1.5,
							"color": "orange"
						});
					}
					ty = "end";
					drawCircle();
				})
			});

			//调整圆的大小，在onMapZoom中调用
			function adjustCircle() {
				g3.selectAll("circle")
				.attr('cx', function (o) {
					return leafletMap.latLngToLayerPoint([o.x_axis, o.y_axis]).x;
				})
				.attr('cy', function (o) {
					return leafletMap.latLngToLayerPoint([o.x_axis, o.y_axis]).y;
				})
				.attr('r', function (o) {
					return o.radius * 0.0002 * Math.pow(2, leafletMap.getZoom());
				});
			}

			function adjustSVG() {
				var SVGparent = d3.select(leafletMap.getPanes().mapPane);
				var moveXY = SVGparent._groups[0][0]._leaflet_pos;

				svg3.style("left", -moveXY.x + "px")
				.style("top", -moveXY.y + "px");

				g3.attr("transform", "translate(" + moveXY.x + "," + moveXY.y + ")");
			}

			//鼠标缩放操作
			function onMapZoom() {
				adjustCircle();
			}

			function initial() {
				svg3.attr("width", 1920)
				.attr("height", 1080);
				drawCircle();
			}

			//初始化画图的函数
			initial();
			//事件响应
			leafletMap.on('zoom', onMapZoom);
			leafletMap.on('mouseup', adjustSVG);
		})

	}

	var bt_he = document.querySelector("#btn_he");
	var bt_rt = document.querySelector("#btn_rt");
	var bt_ro = document.querySelector("#btn_ro");

	bt_he.onclick = function () {

		if (opt == "realtime") {
			//d3.select(leafletMap.getPanes().overlayPane).select("svg").remove();

			g3.selectAll("circle").data([]).exit().remove();
			document.getElementById("time").innerHTML = '';
			if (t != '')
				t.stop();
			document.getElementById('button_s').style.display = 'none';

			leafletMap.addLayer(heatmapLayer);
			drawHeatmap();
		}
		if (opt == "routing") {
			g3.selectAll("circle").data([]).exit().remove();
			document.getElementById('button_r').style.display = 'none';
			leafletMap.addLayer(heatmapLayer);
			drawHeatmap();
		}

		opt = "heatmap";

	};

	bt_rt.onclick = function () {

		if (opt != "realtime") {
			document.getElementById('button_s').style.display = 'block';
			document.getElementById('button_r').style.display = 'none';
			/*data = {
			'max': 600,
			'data': []
			};

			heatmapLayer.setData(data);*/
			leafletMap.removeLayer(heatmapLayer);
			realTimeMap();
		}
		opt = "realtime";

	};

	bt_ro.onclick = function () {
		if (opt != "routing") {
			document.getElementById('button_s').style.display = 'none';
			document.getElementById('button_r').style.display = 'block';
			/*data = {
			'max': 600,
			'data': []
			};
			
			heatmapLayer.setData(data);*/
			g3.selectAll("circle").data([]).exit().remove();
			leafletMap.removeLayer(heatmapLayer);

			drawBeginEnd();
		}
		opt = "routing";

	};

	view1.onMessage = function (message, data, from) {
		if (from == View2) {
			if (message == "drawSankey") {
				
			svg_map.attr("height",900).attr("width",900)
				
				g_map.selectAll(".sankey-circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("class", "sankey-circle");
				g_map.selectAll(".sankey-circle")
					.transition()
				.attr('cx', function (d) {
					console.log(d[0]);
					return leafletMap.latLngToLayerPoint(d).x;
				})
				.attr('cy', function (d) {
					return leafletMap.latLngToLayerPoint(d).y;
				})
				.attr('r', function (d) {
					return 20 * 0.0002 * Math.pow(2, leafletMap.getZoom());
				})
				.attr("fill", "red")
				.attr("opacity",0.4);

				function adjustSVG() {
					var SVGparent = d3.select(leafletMap.getPanes().mapPane);
					var moveXY = SVGparent._groups[0][0]._leaflet_pos;

					svg_map.style("left", -moveXY.x + "px")
					.style("top", -moveXY.y + "px");

					g_map.attr("transform", "translate(" + moveXY.x + "," + moveXY.y + ")");
				}

				function adjustCircle() {
					g_map.selectAll("circle")
					.attr('cx', function (d) {
						return leafletMap.latLngToLayerPoint(d).x;
					})
					.attr('cy', function (d) {
						return leafletMap.latLngToLayerPoint(d).y;
					})
					.attr('r', function (d) {
						return 20 * 0.0002 * Math.pow(2, leafletMap.getZoom());
					});
				}

				//鼠标缩放操作
				function onMapZoom() {
					adjustCircle();
				}
				leafletMap.on('mouseup', adjustSVG);
				leafletMap.on('zoom', onMapZoom);
			}

		}
	}

	Observer.addView(view1);

	return view1;
}
