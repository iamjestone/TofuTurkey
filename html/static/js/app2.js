// Grab the width of the containing box
var width = parseInt(d3.select(".chart").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 100;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 20;
var tPadLeft = 20;

// Create the actual canvas for the graph
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart1");

// Set the radius for each dot that will appear in the graph.
var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// The Labels for our Axes

// A) Bottom Axis
// ==============

// We create a group element to nest our bottom axes labels.
svg.append("g").attr("class", "xText");
// xText will allows us to select the group without excess code.
var xText = d3.select(".xText");

// We give xText a transform property that places it at the bottom of the chart.
// By nesting this attribute in a function, we can easily change the location of the label group
// whenever the width of the window changes.
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

// Now we use xText to append three text SVG files, with y coordinates specified to space out the values.
// 1. Product
xText
  .append("text")
  .attr("y", 20)
  .attr("data-name", "Product")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Product");

// B) Left Axis
// ============

// Specifying the variables like this allows us to make our transform attributes more readable.
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
// 1. NutrUnits
yText
  .append("text")
  .attr("y", -90)
  .attr("data-name", "NutrUnits")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("NutrUnits (NU)");

// 2. LandUse
yText
  .append("text")
  .attr("y", -62)
  .attr("data-name", "LandUse")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("LandUse (m2/NU)");

// 3. CO2Emissions
yText
  .append("text")
  .attr("y", -34)
  .attr("data-name", "CO2Emissions")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("CO2Emissions (kg/NU)");

// 4. SO2Emissions
yText
  .append("text")
  .attr("y", -6)
  .attr("data-name", "SO2Emissions")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("SO2Emissions (kg/NU)");

// 5. PO4Emissions
yText
  .append("text")
  .attr("y", 22)
  .attr("data-name", "PO4Emissions")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("PO4Emissions (kg/NU)");

// 6. FreshwaterWithdrawals
yText
  .append("text")
  .attr("y", 50)
  .attr("data-name", "FreshwaterWithdrawals")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("FreshwaterWithdrawals (L/NU)");

// 2. Import our .csv file.
// ========================
// This data file includes environmental impact of various food products

// Import our CSV data with d3's .csv import method.
d3.csv("clean_environment_data4.csv").then(function(data) {
  // Visualize the data
  //console.log(data);
  visualize(data);
});

// 3. Create our visualization function
// ====================================
// We called a "visualize" function on the data obtained with d3's .csv method.
// This function handles the visual manipulation of all elements dependent on the data.
function visualize(theData) {
  // PART 1: Essential Local Variables and Functions
  // =================================
  // curX and curY will determine what data gets represented in each axis.
  // We designate our defaults here, which carry the same names
  // as the headings in their matching .csv data file.
  var curX = "Product";
  var curY = "NutrUnits";

  // We also save empty variables for our the min and max values y.
  // this will allow us to alter the values in functions and remove repetitious code.

  var yMin;
  var yMax;

  // This function allows us to set up tooltip rules (see d3-tip.js).
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {

      // Grab the product name.
      var theProduct = "<div>" + d.Product + "</div>";

      // Snatch the y value's key and value.
      var theY = "<div>" + curY + ": " + d[curY] + "</div>";
    
      // Display what we capture.
      return theProduct + theY;
    });

  // Call the toolTip function.
  svg.call(toolTip);

  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    // .max will grab the largest datum from the selected column.
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }

  // Part 3: Instantiate the Scatter Plot
  // ====================================
  // This will add the first placement of our data and axes to the scatter plot.

  // First grab the min and max values of y.
  
  yMinMax();

  // With the min and max values now defined, we can create our scales.
  // Notice in the range method how we include the margin and word area.
  // This tells d3 to place our circles in an area starting after the margin and word area.
  var xScale = d3
    .scaleBand()
    .domain(theData.map(d => d.Product))
    .range([margin + labelArea, width - margin]);

  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin - labelArea, margin]);

  // We pass the scales into the axis methods to create the axes.
  // Note: D3 4.0 made this a lot less cumbersome then before. Kudos to mbostock.
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Determine x and y tick counts.
  
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  // We append the axes in group elements. By calling them, we include
  // all of the numbers, borders and ticks.
  // The transform attribute specifies where to place the axes.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")")
    .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // We append the circles for each row of data (or each food product, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
     return yScale(d[curY]);})
    .attr("r", circRadius)
    .attr("fill", function(d) {
      if (d.Type === "v")
      {return "green";}
      else {return "red";}
    })
    .attr("class", function(d) {
      return "productCircle" + d.Type;
    })
    // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // With the circles on our graph, we need matching labels.
  // Let's grab the food type from our data -meat(m) or vegan/vegetarian(v)
  // and place them in the center of our dots.
  theCircles
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.Type;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "foodtypeText");

  // Part 4: Make the Graph Dynamic
  // ==========================
  // This section will allow the user to click on any label
  // and display the data it references.

  // Select all axis text and add this d3 click event.
  d3.selectAll(".aText").on("click", function() {
    // Make sure we save a selection of the clicked text,
    // so we can reference it without typing out the invoker each time.
    var self = d3.select(this);

    // We only want to run this on inactive labels.
    // It's a waste of the processor to execute the function
    // if the data is already displayed on the graph.
    if (self.classed("inactive")) {
      // Grab the name and axis saved in label.
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      if (axis === "y") {
        curY = name;

        // Change the min and max of the y-axis.
        yMinMax();

        // Update the domain of y.
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // With the axis changed, let's update the location of the food product circles.
        d3.selectAll("circle").each(function() {
          // Each food product circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        // We need change the location of the food type texts, too.
        d3.selectAll(".foodtypeText").each(function() {
          // We give each product text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
    }
  });
}
