/**
 * Created by Jiaqi on 16/11/21.
 */


var volumn = [];
var raw_data = [];
var trump_pos = [], trump_negt = [], hillary_pos = [], hillary_negt = [];
var vote = [0, 0, 0, 0];
var svg_w = 1000;
var svg_h = 800;
var svg = d3.select("#map_area")
    .append("svg")
    .attr("id", "map_svg")
    .attr("width", "100%")
    .attr("height", svg_h);

window.onload = data_load;
function data_load() {

    var projection = d3.geoAlbersUsa()
        .translate([svg_w/2, svg_h/2])
        .scale([1000]);
    var location_projection;


        d3.json("Twitter_data/testfile.json", function (error, data) {

            var current_second = -1, count = 0, sum = 0, start = false,
                current_minute = -1;
            data.forEach(function (d, i) {

                //raw_data.push(d);

                var date = new Date(d["created_at"]);
                //console.log(date);
                //var second = date.getSeconds();

                var minute = date.getMinutes();
                //var time = date.get();
                //console.log(second);

                if (minute != current_minute) {

                    if (i != 0) {
                        volumn.push(count);
                    }
                    current_minute = minute;

                    count = 1;
                } else {
                    count += 1;
                }

                //if (second != current_second){
                //
                //    if(i != 0){
                //        volumn.push(count);
                //    }
                //    current_second = second;
                //
                //    count = 1;
                //} else {
                //    count += 1;
                //}
                //
                //
                //if  (second % 60 != 0) {
                //    //console.log(date);
                //    sum += 1;
                //    if ((second % 60 == 1) & start){
                //        volumn.push(sum);
                //        //console.log(sum);
                //        sum = 1;
                //        start = false;
                //    }
                //} else {
                //    sum += 1;
                //    start = true;
                //}

                // get location information
                if (d.geo != null) {
                    location_projection = projection([d.geo.coordinates[1].toString()
                        , d.geo.coordinates[0].toString()]);

                    if (location_projection != null) {
                        raw_data.push(d);
                    }
                }

                // get vote information
                //0 good trump, 1 bad trump
                if (d.trump != 0) {
                    if (d.sent > 0) {
                        vote[0] += parseInt(d.trump * d.sent);
                        trump_pos.push(d);
                    } else {
                        vote[1] += Math.abs(parseInt(d.trump * d.sent));
                        trump_negt.push(d);
                    }
                    //console.log(vote);
                }

                //2 good hillary, 3 bad hillary
                if (d.hillary != 0) {
                    if (d.sent > 0) {
                        vote[2] += parseInt(d.hillary * d.sent);
                        hillary_pos.push(d);
                    } else {
                        vote[3] += Math.abs(parseInt(d.hillary * d.sent));
                        hillary_negt.push(d);
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
            //console.log(volumn);
            //console.log(vote);


            //draw_map();
            draw_bars();
            draw_points_onmap();
            draw_vote_distribution();
        });

}

draw_map();
draw_character();

//draw_bars();

function draw_bars(){
    var width_svg = 700,
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
        .padding(0.2);

    var hScale = d3.scaleLinear()
        .domain([d3.min(volumn), d3.max(volumn)])
        .range([10, height_svg - padding]);



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
            //return 2;
            return xScale.bandwidth();
            //return xScale.rangeBand();
        })
        .attr("height", function(d){
            return hScale(d);
        })
        .style("fill", "rgb(255, 230, 66)");

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

    var color = d3.scaleQuantize()
        //.domain([0,100])
        .range(["rgb(237,248,233)", "rgb(186,228,179)",
            "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);

    var path = d3.geoPath ()
        .projection(projection);

    var color_Clinton = d3.scaleQuantize()
        //.range(["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"]);
        //.range(["#de2d26","#fc9272","#fee0d2","#deebf7","#9ecae1","#3182bd"]);
        .range(["#de2d26","#3182bd"]);
    //var color = ["#de2d26","#3182bd"];
    var color = ["rgb(172,42,56 )","#3182bd"];
    //var color = ["#0571b0","#ca0020"];



    d3.csv("Twitter_data/election_data.csv", function(data) {
        //console.log(election_data);
        color_Clinton.domain([
            d3.min(data, function(d){return d.Clinton;}),
            d3.max(data, function(d){return d.Clinton;})
        ]);

        d3.json("Twitter_data/us-states.json", function(json){

            for(var i = 0; i < data.length; i ++){
                var dataState = data[i].state;


                var trump_current = parseFloat(data[i].Trump);
                var hillary_current = parseFloat(data[i].Clinton);

                for (var j = 0; j < json.features.length;j++){
                    var jsonState = json.features[j].properties.name;

                    if (dataState == jsonState){
                        json.features[j].properties.trump = trump_current;
                        json.features[j].properties.hillary = hillary_current;
                        break;
                    }
                }
            }


            map_group
                .attr("transform", "translate(-130,-100)")
                .selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                //.style("stroke", "rgb(74, 74, 112)")
                .style("stroke", "#bdbdbd")
                .style("stroke-size", 2)
                .style("fill", function(d){
                    var value_hillary = d.properties.hillary;
                    var value_trump = d.properties.trump;
                        if (value_hillary>value_trump){
                            return color[1]
                        } else {
                            return color[0]
                        }
                })
                .style("opacity", 1)
                .on("mouseover", function(){

                    d3.select(this)
                        .style("opacity", 0.6);

                    var state_data = d3.select(this).data();
                    console.log(state_data[0].properties);

                    var coordinates = d3.mouse(this);
                    var x = coordinates[0];
                    var y = coordinates[1];

                    d3.select("#trump_value")
                        .text(state_data[0].properties.trump);

                    d3.select("#hillary_value")
                        .text(state_data[0].properties.hillary);

                    d3.select("#state_name")
                        .text(state_data[0].properties.name);

                    d3.select("#tooldiv")
                        .style("left", x-100 + "px")
                        .style("top", y-100 + "px")
                        .style("opacity", 0.8);




                    d3.select("#tooldiv").classed("hidden", false);


                })
                .on("mouseout", function(){
                    d3.select(this)
                        .style("opacity", 1);
                    d3.select("#tooldiv").classed("hidden", true);
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
                .attr("transform", "translate(-130,-100)")
                .attr("cx", function(){
                    return projection(["-118.22517559", "33.97980036"])[0];
                })
                .attr("cy", function(){
                    return projection(["-118.22517559", "33.97980036"])[1];
                })
                .attr("r", Math.sqrt(10))
                .style("fill", "orange");
        });
    });




}

function draw_character(){

    var img_group = svg.append("g")
        .attr("id", "character")
        .attr("width", 150)
        .attr("height", 400)
        //.attr("transform", "translate(1000,53)");

    img_group.append("g")
        .append("image")
        .attr("id", "trump")
        .attr("xlink:href", "https://www.washingtonpost.com/graphics/politics/2016-election/election-remix/img/mug-trump.png")
        //.attr("src", "img/trump.png")
        .attr("width", 150)
        .attr("height", 150)
        //.attr("x", "68%")
        .attr("x", 770)
        .attr("y",200);

    img_group.append("image")
        .attr("id", "hillary")
        .attr("xlink:href", "https://www.washingtonpost.com/graphics/politics/2016-election/election-remix/img/mug-clinton.png")
        //.attr("src", "img/trump.png")
        .attr("width", 150)
        .attr("height", 150)
        .attr("x", 1050)
        .attr("y",200);

}

function draw_points_onmap(){

    var projection = d3.geoAlbersUsa()
        .translate([svg_w/2, svg_h/2])
        .scale([1000]);

    var map_point = svg.append("g")
        .attr("id", "map_point");

    map_point.attr("transform", "translate(-130,-100)")
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
        .attr("r", Math.sqrt(30))
        .attr("r", Math.sqrt(300))
        .style('opacity', 0)
        .remove();

}

function draw_vote_distribution(){
    var svg_pie = svg;
    var pie_group = svg.append("g")
        .attr("id", "pie_group");

    var height = 400, width = 400;
    var initial_pie = [0,0];

    var trump = [vote[0], vote[1]];
    var hillary = [vote[2], vote[3]];


    var trump_pie = pie_group.append("g")
        .attr("id", "trump_pie");

    var pie = d3.pie()
            .value(function(d){return d})(trump),

        partialW = width * 0.8,
        outerR = partialW / 2,
        labeler = outerR - 50;

        outerR = 120;

    var frequency = [1527,1580,1760,828,466,1595];

    var cScale = d3.scaleLinear()
        .domain([d3.min(frequency), d3.max(frequency)])
        .range([0, 1]);

    var arc = d3.arc()
        .outerRadius(outerR)
        .innerRadius(90);

    var arc_over = d3.arc()
        .outerRadius(outerR + 10)
        .innerRadius(90);

    var arcs = trump_pie.selectAll("arc")
        .data(pie)
        .enter();



    //var color = ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"];
    var color = ["#ca0020","#bdbdbd"];

    var path = arcs.append("path")
        .attr("d", arc)
        .attr("transform", "translate(" + 840 + "," + 270+ ")")
        .style("fill", function(d, i){
            return color[i];
        })
        .style("stroke", "white")
        .on("mouseover", function(){
            d3.select(this)
                .transition()
                .attr("d", arc_over);
        })
        .on("mouseout", function(){
            d3.select(this)
                .transition()
                .duration(100)
                .attr("d", arc)
        })
        .on("click", pupopen);



    var hillary_pie = pie_group.append("g")
        .attr("id", "hillary_pie");
    var h_pie = d3.pie()
            .value(function(d){return d})(hillary);

    var h_arcs = hillary_pie.selectAll("h_arc")
        .data(h_pie)
        .enter();

    var h_color = ["#0571b0","#bdbdbd"];

    var h_path = h_arcs.append("path")
        .attr("d", arc)
        .attr("transform", "translate(" + 1120 + "," + 270+ ")")
        .style("fill", function(d, i){
            return h_color[i];
        })
        .style("stroke", "white")
        .on("mouseover", function(){
            d3.select(this)
                .transition()
                .attr("d", arc_over);
        })
        .on("mouseout", function(){
            d3.select(this)
                .transition()
                .duration(100)
                .attr("d", arc);

        });
}

function pupopen(){
    document.getElementById("bg").style.display="block";
    document.getElementById("popbox").style.display="block" ;
}
function pupclose(){
    document.getElementById("bg").style.display="none";
    document.getElementById("popbox").style.display="none" ;
}

