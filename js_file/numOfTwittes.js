/**
 * Created by Jiaqi on 16/11/21.
 */


var volumn = [];
var raw_data = [];
var svg_w = 1000;
var svg_h = 800;
var svg = d3.select("#map_area")
    .append("svg")
    .attr("id", "map_svg")
    .attr("width", "100%")
    .attr("height", svg_h);

window.onload = data_load;
function data_load() {
    //d3.json("Twitter_data/data_tenLine.json", function (error, data) {
    //d3.json("Twitter_data/sampleJsonData.json", function (error, data) {
    var projection = d3.geoAlbersUsa()
        .translate([svg_w/2, svg_h/2])
        .scale([1000]);
    var location_projection;

    d3.json("Twitter_data/data1.json", function (error, data) {
        //console.log(data);

        var current_second = -1, count = 0, sum = 0, start = false;
        data.forEach(function (d, i) {

            //raw_data.push(d);



            var date = new Date(d["created_at"]);
            var second = date.getSeconds();
            //var time = date.get();
            //console.log(second);

            if  (second % 60 != 0) {
                sum += 1;
                if ((second % 60 == 1) & start){
                    volumn.push(sum);
                    //console.log(sum);
                    sum = 1;
                    start = false;
                }

            } else {
                sum += 1;
                start = true;
            }

            if (d.geo != null){
                location_projection = projection([d.geo.coordinates[1].toString()
                    ,d.geo.coordinates[0].toString()]);

                if (location_projection != null){
                    raw_data.push(d);
                }
            }


            //if (second != current_second) {
            //
            //    if (i != 0) {
            //        volumn.push(count);
            //    }
            //    current_second = second;
            //
            //    count = 1;
            //} else {
            //    count += 1;
            //    if (i == data.length - 1) {
            //        volumn.push(count);
            //    }
            //}

        });
        console.log(raw_data);



        //draw_map();
        draw_bars();
        draw_points_onmap();
    });

}

draw_map();
//draw_bars();

function draw_bars(){
    var width_svg = 400,
        height_svg = 200,
        padding = 30;

    //var svg = d3.select("#num_twitter")
    ////var svg = d3.select("#bars_volumn")
    //    .append("svg")
    //    .attr("id", "num_T_id")
    //    .attr("width", width_svg)
    //    .attr("height", height_svg);

//console.log(volumn);

    var xScale = d3.scaleBand()
        .domain(d3.range(volumn.length))
        .rangeRound([padding, width_svg - padding])
        .paddingInner(0.1);

    var hScale = d3.scaleLinear()
        .domain([d3.min(volumn), d3.max(volumn)])
        .range([padding, height_svg - padding]);



    var bars_group = svg.append("g")
        .attr("id", "bars_group");

    var bars = bars_group.attr("transform", "translate(0,520)")
        .selectAll("rect")
        .data(volumn)
        .enter()
        .append("rect");


    bars.attr("x", function (d, i) {
        //console.log(i);
        //return xScale(i);
        //return width_svg - xScale(i);
        return 0 - xScale(i);
    })
        .attr("y", function(d){
            return height_svg - hScale(d);
        })
        .attr("width", function(d){
            return 10;
            //return xScale.rangeBand();
        })
        .attr("height", function(d){
            return hScale(d);
        })
        .style("fill", "rgb(255, 230, 66)");
    console.log("hi");

    bars.transition()
        .duration(1000)
        .style("transition-timing-function", "linear")
        .attr("x", function(d, i){
            return width_svg - xScale(i);
        })



}

function draw_map(){
    //var svg_w = 1000;
    //var svg_h = 500;
    //
    //var svg = d3.select("#map_area")
    //    .append("svg")
    //    .attr("id", "map_svg")
    //    .attr("width", "100%")
    //    .attr("height", svg_h);

    //console.log(raw_data[1027]);

    var projection = d3.geoAlbersUsa()
        .translate([svg_w/2, svg_h/2])
        .scale([1000]);

    var map_group = svg.append("g")
                        .attr("id", "map_group");

    //var map_point = svg.append("g")
    //                    .attr("id", "map_point");

    var path = d3.geoPath ()
        .projection(projection);

    var color = d3.scaleQuantize()
        .range(["rgb(237,248,233)", "rgb(186,228,179)",
            "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);

    d3.json("Twitter_data/us-states.json", function(json){

        map_group
            .attr("transform", "translate(-50,-100)")
            .selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "rgb(74, 74, 112)")
            .style("stroke-size", 2)
            .style("fill", function(d){
                //var value = d.properties.value;
                var value = false;

                if(value){
                    //return color(value);
                    return "green";
                }else{
                    return "rgb(44, 44, 67)";
                }
            });

        var location_projection;

        //map_point.attr("transform", "translate(-50,-100)")
        //    .selectAll("circle")
        //    .data(raw_data)
        //    .enter()
        //    .append("circle")
        //    .attr("cx", function(d){
        //        if (d.geo == null){
        //            console.log("hi");
        //            return 0;
        //        } else {
        //            location_projection = projection([d.geo.coordinates[1].toString()
        //                ,d.geo.coordinates[0].toString()]);
        //
        //            console.log(location_projection);
        //
        //            if (location_projection != null){
        //                return projection([d.geo.coordinates[1].toString()
        //                    ,d.geo.coordinates[0].toString()])[0];
        //            } else{
        //                return 0;
        //            }
        //        }
        //    })
        //    .attr("cy", function(d){
        //        if (d.geo == null){
        //            return 0;
        //        } else {
        //            location_projection = projection([d.geo.coordinates[1].toString()
        //                ,d.geo.coordinates[0].toString()]);
        //
        //            if (location_projection != null){
        //                return projection([d.geo.coordinates[1].toString()
        //                    ,d.geo.coordinates[0].toString()])[1];
        //            } else{
        //                return 0;
        //            }
        //        }
        //    })
        //    .attr("r", 0)
        //    .style("fill", "blue");
        //
        //map_point.selectAll("circle")
        //    .transition()
        //    .duration(1000)
        //    .attr("r", Math.sqrt(50));


        svg .append("circle")
            .attr("transform", "translate(-50,-100)")
            .attr("cx", function(){
                return projection(["-118.22517559", "33.97980036"])[0];
            })
            .attr("cy", function(){
                return projection(["-118.22517559", "33.97980036"])[1];
            })
            .attr("r", Math.sqrt(10))
            .style("fill", "orange");
    });


}

function draw_points_onmap(){

    var projection = d3.geoAlbersUsa()
        .translate([svg_w/2, svg_h/2])
        .scale([1000]);

    var map_point = svg.append("g")
        .attr("id", "map_point");

    map_point.attr("transform", "translate(-50,-100)")
        .selectAll("circle")
        .data(raw_data)
        .enter()
        .append("circle")
        .attr("cx", function(d){
            return projection([d.geo.coordinates[1].toString()
                ,d.geo.coordinates[0].toString()])[0];

        })
        .attr("cy", function(d){
            return projection([d.geo.coordinates[1].toString()
                ,d.geo.coordinates[0].toString()])[1];
        })
        .attr("r", 0)
        .style("fill", "rgb(80,245,64");

    map_point.selectAll("circle")
        .transition()
        .duration(1000)
        .delay(function(d, i){ return i * 100})
        .attr("r", Math.sqrt(300))
        .style('opacity', 0)
        .remove();

}







