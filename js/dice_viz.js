var data={};
var resultArr=[];
var x;
var y;
var xAxis;
var yAxis;

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

clearGraph();

function dataHash2Arr(h) {
    console.log("hash:",h);
    resultArr=[];
    var keysArr=Object.keys(h).sort();
    for (var i in keysArr) {
      resultArr.push({"name":keysArr[i], "value":h[keysArr[i]]});
    };
    console.log(resultArr);
    return (resultArr);
};

function updateGraph() {
  var dataArr=dataHash2Arr(data);
  y.domain([0, d3.max(dataArr, function(d) { return d["value"]; })]);

  chart.select(".x.axis").remove();
  chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

  chart.select(".y.axis").remove();
  chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("#Rolls");
  console.log("dataArr:",dataArr);
  var bar = chart.selectAll(".bar").data(dataArr, function(d) {return d["name"]; });
    // new data:
  bar.enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d) { return x(d["name"]); })
       .attr("y", function(d) { return y(d["value"]); })
       .attr("height", function(d) { return height - y(d["value"]); })
       .attr("width", x.rangeBand(function(d) { return x(d["name"]); }));
    // removed data:
  bar.exit().remove();
    // updated data:
  bar.transition().duration(750)
       .attr("y", function(d) { return y(d["value"]); })
       .attr("height", function(d) { return height - y(d["value"]); });
       // "x" and "width" will already be set from when the data was
       // first added from "enter()".
  };

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
function getRandomDie() {
  return getRandomInt(1,6);
};

function rollDice() {
  dice = document.getElementById("diceInput").value;
  times = document.getElementById("rollsInput").value;
  for (i=0; i<times; i++) {
    dieResult = 0;
    for (j=0; j<dice; j++) {
      dieResult += getRandomDie();
    }
    if (dieResult in data) {
      data[dieResult]++;
    } else {
      data[dieResult]=1;
    }
  }
  updateGraph();
}

function clearGraph() {
  data={};
  dice = document.getElementById("diceInput").value;
  //Array.apply(null, Array(dice)).map(function (_, i) {return i;});

  x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  y = d3.scale.linear()
      .range([height, 0]);

  var domain = [];
  for (var i = dice; i <= dice*6; i++) {
      domain.push(i);
  }

  x.domain(domain);

  xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");


  updateGraph();
}
