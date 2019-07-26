function View3(Observer) {
    var view3 = {};


    var url = 'https://api.mapbox.com/styles/v1/iteapoy/cjw4lc8a509l41cobv8thjx3o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaXRlYXBveSIsImEiOiJjanc0bGIxM2YwcTdmNGJvM3ozZnMwd2JiIn0.Me_7fZJysfm09TGQQf9Rjg';	//var url = 'https://api.mapbox.com/styles/v1/iteapoy/cjwhifsfi05pa1cmt0xx4yx19/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaXRlYXBveSIsImEiOiJjanc0bGIxM2YwcTdmNGJvM3ozZnMwd2JiIn0.Me_7fZJysfm09TGQQf9Rjg';
    //初始化 地图
    var mymap = L.map('mapid').setView([30.457, 104.027], 12); // 热力图[30.465520, 104.014870], 13  // 散点图[30.555520, 104.024870], 11
    //将图层加载到地图上，并设置最大的聚焦还有map样式
    L.tileLayer(url, {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(mymap);


    var circleData = [];

    var carID = ' ';
    var range = 1525125722;

    //d3.csv("./data/gps-20180501-WGS84-header.csv", function (data0) {
    d3.json("./data/Gps/Gps/1525125722.json", function (data0) {

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
        var svg = d3.select(mymap.getPanes().overlayPane).append("svg"),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");
        var jsonCircles = new Array();

        function drawCircle() {

            circleData.forEach(function (d) {
                jsonCircles.push({
                    "x_axis": d.lat,
                    "y_axis": d.lng,
                    "radius": 2.5,
                    "color": "#1380FF",
                    "id": d.id
                });
            });
            var t = g.selectAll("circle")
                .data(jsonCircles);

            var circleAttributes =
                    t.enter()
                        .append("circle")
                        .attr("cx", function (d) {
                            return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x;
                        })
                        .attr("cy", function (d) {

                            //console.log(L.latLng(d.x_axis, d.y_axis));
                            return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y;
                        })
                        .attr("r", function (d) {
                            return d.radius*0.0002*Math.pow(2, mymap.getZoom());
                        })
                        .style("fill", function (d) {
                            return d.color;
                        })
                        .style('opacity',0.8)
                /*
                .on("mouseover", function(d, i)
                {
                    d3.select(this)
                        .transition()
                        .style("fill", function (d) {
                            if (d.id == carID)
                            {
                                return "#C7DE72";
                            }
                            return d.color;
                        })
                        .attr("r", function (d) {
                            return 3*0.0002*Math.pow(2, mymap.getZoom());
                        })
                        .style('opacity',1);
                    //return tooltip.style('visibility', 'visible').text(d.startDate);
                })
                .on("click", function(d, i)
                {

                    carID = d.id;
                    drawSamecar();

                })
                .on("mouseout", function(d, i)
                {
                    d3.select(this)
                        .transition()
                        .attr("r", function (d) {
                            if (d.id == carID)
                            {
                                return 1.5*0.0002*Math.pow(2, mymap.getZoom());
                            }
                            return d.radius*0.0002*Math.pow(2, mymap.getZoom());
                        })
                        .style("fill", function (d) {
                            if (d.id == carID)
                            {
                                return "#C7DE72";
                            }
                            return d.color;
                        })
                        .style('opacity', function (d) {
                            if (d.id == carID)
                            {
                                return 0.3;
                            }
                            return 0.1;
                        });

                })*/
            ;

        }
        //调整圆的大小，在onMapZoom中调用
        function adjustCircle() {

            g.selectAll("circle")
                .attr('cx', function (o) {
                    //console.log(mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).x)
                    return mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).x;
                })
                .attr('cy', function (o) {
                    return mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).y;
                })
                .attr('r', function(o) {
                    if (o.id == carID)
                    {
                        return 1.5*0.0002*Math.pow(2, mymap.getZoom());
                    }

                    return o.radius*0.0002*Math.pow(2, mymap.getZoom());
                });
        }


        function drawSamecar() {
            var t = g.selectAll("circle");
            //.data(jsonCircles);

            t.transition()
                .attr("r", function (d) {
                    if (d.id == carID)
                    {
                        return 1.5*0.0002*Math.pow(2, mymap.getZoom());
                    }
                    return d.radius*0.0002*Math.pow(2, mymap.getZoom());
                })
                .style("fill", function (d) {
                    if (d.id == carID)
                    {
                        return "#C7DE72";
                    }
                    return d.color;
                })
                .style('opacity', function (d) {
                    if (d.id == carID)
                    {
                        return 0.3;
                    }
                    return 0.1;
                });
        }

        function update() {
            //range += 3;
            if (range < 1525129318) {
                range += 3;
                d3.json("./data/Gps/Gps/" + range.toString() + ".json", function (data1) {


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

                            "color": "#1380FF",
                            "id": d.id
                        });
                    });
                    /*var t = g.selectAll("circle")
                        .data(jsonCircles);

                    t//.transition()
                        //.duration(1000)

                        .attr("cx", function (d) {
                            return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x;
                        })
                        .attr("cy", function (d) {

                            //console.log(L.latLng(d.x_axis, d.y_axis));
                            return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y;
                        })
                        .attr("r", function (d) {
                            return d.radius * 0.0002 * Math.pow(2, mymap.getZoom());
                        })
                        .style("fill", function (d) {
                            return d.color;
                        })
                        .style('opacity', 0.5);

                    t.enter().append("circle")
                        //.transition()
                        //.duration(1000)

                        .attr("cx", function (d) {
                            return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x;
                        })
                        .attr("cy", function (d) {

                            //console.log(L.latLng(d.x_axis, d.y_axis));
                            return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y;
                        })
                        .attr("r", function (d) {
                            return d.radius * 0.0002 * Math.pow(2, mymap.getZoom());
                        })
                        .style("fill", function (d) {
                            return d.color;
                        })
                        .style('opacity', 0.5)

                        ;


                    t.exit().remove();*/

                    g.selectAll("circle")
                        .data(jsonCircles).exit().remove();
                    g.selectAll("circle")
                        .data(jsonCircles).enter().append("circle");
                    g.selectAll("circle")
                        .attr("cx", function (d) {
                            return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x;
                        })
                        .attr("cy", function (d) {

                            //console.log(L.latLng(d.x_axis, d.y_axis));
                            return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y;
                        })
                        .attr("r", function (d) {
                            return d.radius * 0.0002 * Math.pow(2, mymap.getZoom());
                        })
                        .style("fill", function (d) {
                            return d.color;
                        })
                        .style('opacity', 0.8);
                });
                //console.log(range);
            }
        }


/////
        function adjustSVG() {
            var SVGparent = d3.select(mymap.getPanes().mapPane);
            var moveXY = SVGparent._groups[0][0]._leaflet_pos;

            svg.style("left", -moveXY.x + "px")
                .style("top", -moveXY.y + "px");

            g.attr("transform", "translate(" + moveXY.x + "," + moveXY.y + ")");
        }

        //鼠标缩放操作
        function onMapZoom() {
            adjustCircle();
        }
        function initial() {
            svg.attr("width", 1920)
                .attr("height", 1080);
            drawCircle();
        }

        //初始化画图的函数
        initial();
        //事件响应
        mymap.on('zoom', onMapZoom);
        mymap.on('mouseup', adjustSVG);

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
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

        var commonTime_ = new Date(range*1000).Format("yyyy-MM-dd hh:mm:ss");
        document.getElementById("time").innerHTML = commonTime_;
        console.log(commonTime_);

        var bt_st = document.querySelector("#btn_st");
        var t = '';
        bt_st.onclick = function() {
            range = 1525125722;


            if (t == '')
            {
                t = d3.timer(function(elapsed){
                    update();

                    var commonTime = new Date(range*1000).Format("yyyy-MM-dd hh:mm:ss");
                    document.getElementById("time").innerHTML = commonTime;

                }, 40);
            }
            else
            {
                t.restart(function(elapsed){
                    update();

                    var commonTime = new Date(range*1000).Format("yyyy-MM-dd hh:mm:ss");
                    document.getElementById("time").innerHTML = commonTime;

                });
            }


            var bt_sp = document.querySelector("#btn_sp");
            bt_sp.onclick = function() {
                t.stop();
            }

            var bt_co = document.querySelector("#btn_co");
            bt_co.onclick = function() {
                t.restart(function(elapsed){
                    update();

                    var commonTime = new Date(range*1000).Format("yyyy-MM-dd hh:mm:ss");
                    document.getElementById("time").innerHTML = commonTime;



                });
            }

        };

    })



    Observer.addView(view3);
    return view3;
}


