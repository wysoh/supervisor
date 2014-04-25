/**
 * Created with IntelliJ IDEA.
 * User: Percy Zhao
 * Date: 4/7/14
 * Time: 4:25 PM
 * To change this template use File | Settings | File Templates.
 */


var chart;
var chartData = []; //[{key:"APPL", values: [{x:1396948011,y:5}, {x:1396948012, y:5.1}, {x:1396948013, y:5.3}]}];



setupChart(chartId, chartData ,true, true, {forceY:false, height:'350'});



var socket = io.connect('/');
socket.on("update", function (update) {
    if (!(selectedServerGroup == update.sg && selectedServerInstance == update.si)){
        return;
    }

    $.each(chartData, function(i, v){


    });

    console.log(update);

    //prepareData(dataQps, data, "qps");
    //prepareData(dataTimeout, data, "timeout");
    //qpsChart.update();
    //timeoutChart.update();


});


function updateChart(data){
    $.each(data, function(i, v){
       chartData.push(v);
    });
    chart.update();
}


function prepareData(target, tick, field){
    var serverId = tick.serverId;
    var series;

    $.each(target, function(i, v){
        if (v.key == serverId){
            series = v;
        }
    });

    if (!series){
        series = {key: serverId, values:[]};
        target.push(series);
    }
    //line chart
    series.values.push({x:tick.timestamp, y:tick[field]});

    if (series.values.length > 100){
        series.values.shift();
    }

    //stacked area chart
    //series.values.push([[tick.timestamp, tick[field]]]);

}

function setupChart(containerid, data, guideline, useDates, auxOptions) {
    if (auxOptions === undefined) auxOptions = {};
    if (guideline === undefined) guideline = true;

    nv.addGraph(
        function() {
        chart = nv.models.lineChart().interpolate('basis').useInteractiveGuideline(guideline);
        //eval (chartObject + ' = chart');
        //interpolate mode: https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate
        //chart = nv.models.stackedAreaChart().useInteractiveGuideline(guideline);


        chart
            .x(function(d,i) {
                return d.x;
            });

        if (auxOptions.width)
            chart.width(auxOptions.width);

        if (auxOptions.height)
            chart.height(auxOptions.height);

        if (auxOptions.forceY)
            chart.forceY([0]);

        var formatter;
        if (useDates !== undefined) {
            formatter = function(d,i) {
                /*
                var now = (new Date()).getTime() - 86400 * 1000 * 365;
                now = new Date(now + d * 86400 * 1000);
                return d3.time.format('%b %d %Y')(now );
                */
                return d3.time.format('%X')(new Date(d * 1000));
            }
        }
        else {
            formatter = d3.format(",.1f");
        }
        chart.margin({right: 40});
        chart.xAxis // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
            .tickFormat(
                formatter
            );

        chart.yAxis
            .axisLabel('Voltage (v)')
            .tickFormat(d3.format(',d'));


        d3.select('#' + containerid + ' svg')
            .datum(data)
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    }
    );

}

