/**
 * Created by Jiaqi on 16/11/21.
 */


var volumn = [];
window.onload = data_load;
function data_load() {
    d3.json("Twitter_data/data_tenLine.json", function (error, data) {


        var current_second = -1, count = 0;
        data.forEach(function (d, i) {
            var date = new Date(d["created_at"]);
            var second = date.getSeconds();
            if (second != current_second) {

                if (i != 0) {
                    volumn.push(count);
                }
                current_second = second;

                count = 1;
            } else {
                count += 1;
                if (i == data.length - 1) {
                    volumn.push(count);
                }
            }

        });
        console.log(volumn);
        draw_bars();
    });

}



function draw_bars(){
    var width_svg = 500,
        height_svg = 300,
        padding = 30;

    var svg = d3.select("#num_twitter")
        .append("svg")
        .attr("id", "num_T_id")
        .attr("width", width_svg)
        .attr("height", height_svg);

//console.log(volumn);

    var xScale = d3.scaleBand()
        .domain(d3.range(volumn.length))
        .rangeRound([padding, width_svg - padding])
        .paddingInner(0.1);

    var hScale = d3.scaleLinear()
        .domain([0, d3.max(volumn)])
        .range([padding, height_svg - padding]);



    var bars_group = svg.append("g")
        .attr("id", "bars_group");

    var bars = bars_group.selectAll("rect")
        .data(volumn)
        .enter()
        .append("rect");


    bars.attr("x", function (d, i) {
        return xScale(i);
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
        .style("fill", "orange");
    console.log("hi");
}







