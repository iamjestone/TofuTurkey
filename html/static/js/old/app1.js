// Set up our chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
	top: 60,
	right: 40,
	bottom: 100,
	left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3
	.select('.chart')
	.append("svg")
	.attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "chart")
    .append("g");

// Append group element
var chart = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body")
.append("div")
//.attr("class", "tooltip")
.style("opacity", 1)

// Import data from the data.csv file, call the function healthData
d3.csv("clean_environment_data2.csv").then(function(enviData) {
	//if (error) throw error;
    console.log(enviData);
enviData.forEach(function(data) {
    data.NutrUnits = +data.NutrUnits;
    data.LandUse = +data.LandUse;
    data.CO2Emissions = +data.CO2Emissions;
    data.SO2Emissions = +data.SO2Emissions;
    data.PO4Emissions= +data.PO4Emissions;
    data.FreshwaterWithdrawals = +data.FreshwaterWithdrawals;
});

// Create the scales for the chart
var xBandScale = d3.scaleBand()
.domain(enviData.map(data => data.Product))
.range([0, chartWidth])
.padding(0.1);

var yLinearScale = d3.scaleLinear()
.domain([0, d3.max(enviData, data => data.NutrUnits)])
.range([chartHeight, 0]);

// Create two new functions passing our scales in as arguments
// These will be used to create the chart's axes
var bottomAxis = d3.axisBottom(xBandScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append two SVG group elements to the chartGroup area,
// and create the bottom and left axes inside of them
chart.append("g")
.call(leftAxis);

chart.append("g")
.attr("transform", `translate(0, ${chartHeight})`)
.call(bottomAxis);

// Defining the circles on the chart
chart.selectAll("circle")
.data(enviData)
.enter().append("circle")
    .attr("cx", function(data, index){
        //console.log(data.poverty);
        return xBandScale(data.Product);
    })
    .attr("cy", function(data, index){
        //console.log(data.healthcare);
        return yLinearScale(data.NutrUnits);
    })
    .attr('r', "10")
    .attr("fill", "blue")
    .style("opacity", 0.5);
    //.on("click", function(data){
    //    toolTip.show(data);

// Text for y-axis
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// We add a second label group, this time for the axis left of the chart.
svg.append("g").attr("class", "yText");

// yText will allows us to select the group without excess code.
var yText = d3.select(".yText");

// Like before, we nest the group's transform attr in a function
// to make changing it on window change an easy operation.
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// Now we append the text.
// 1. Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// 2. Smokes
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// 3. Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");


// chart.append("text")
// .attr("transform", "rotate(-90)")
// .attr("y", 0 - margin.left + 40)
// .attr("x", 0 - (chartHeight))
// .attr("dy", "1em")
// .attr("class", "axisText")
// //.style("text-anchor", "margintop")
// .text("Nutrition Units")

// Text for x-axis
chart.append("text")
    .attr("transform", "translate(" + (chartWidth/2) + ", " + (chartHeight + margin.top + 20) + ")")
    .attr("class", "axisText")
    //.style("text-anchor", "middle")
    .text("Product");

// Text for title
 chart.append("text")
    //.style("text-anchor", "center")
    .attr("class", "axisText")
    .text("ENvironmental impact of Different Food Products");
    });



