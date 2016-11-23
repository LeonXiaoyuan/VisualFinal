/**
 * Created by Jiaqi on 16/11/21.
 */
var map = new google.maps.Map(d3.select('#map_area').node(), {
    center: {lat: 40.16980759587142, lng: -95.91001562500004},
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    zoom: 2
});

var data = [{"geo":{"coordinates": [-71.80832914733891,42.274436019895894]}},
    {"geo":{"coordinates": [-121.92,37.37]}}];
drawpoint(data);



PUBNUB.init({
    subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
//                subscribe_key: 'sub-c-e546deca-a047-11e6-96cb-02ee2ddab7fe'
}).subscribe({
    channel : 'pubnub-twitter',
//                message:drawpoint(msg)
    message : function(msg){
        if (msg["geo"] != null){
            var mas = msg["user"]["location"];
            var location = msg["geo"]["coordinates"];
//                        console.log(msg);
            var list = document.getElementById('content');
            var mas = msg["geo"];
            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(location));
            list.appendChild(entry);
            drawpoint(msg);
        }
    }
//                callback: drawpoint(message)
//
});



//

function drawpoint(message){

    var overlay = new google.maps.OverlayView();
    overlay.onAdd = function(){
        console.log(message);


        var layer = d3.select(this.getPanes().overlayLayer).append("div")
            .attr("class", "twitters");


        overlay.draw = function(){
            var projection = this.getProjection();
            var padding = 10;


            var marker = layer.selectAll("svg")
                .data(message)
                .each(transform)
                .enter()
                .append("svg")
                .each(transform)
                .attr("class", "marker");

            marker.append("circle")
                .attr({
                    "r": 5,
                    "cx": padding,
                    "cy": padding
                });
//                console.log(message);

            function transform(d){
                console.log(message);

//                    console.log(d);
                d = new google.maps.LatLng(d["geo"]["coordinates"][1], d["geo"]["coordinates"][0]);
                d = projection.fromLatLngToDivPixel(d);
//                    console.log(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            }
        }
    };
    overlay.setMap(map);
}