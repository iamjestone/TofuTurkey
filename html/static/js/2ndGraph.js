

    var svgWidth = 1080;
    var svgHeight = 1000;
    
    var chartMargin = {
        top:70,
        right: 70,
        bottom: 70,
        left: 70
    }
  
    
    var chartWidth = svgWidth - chartMargin.left -chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
    
    var svg = d3.select("#scatter")
                .append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth);
    var chartGroup = svg.append("g")
                        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

 

function makeResponsive(){   
    d3.csv('../js/nutritionData.csv').then(function(Data){
        console.log(Data);
        Data.forEach(function(d){
            d.Food_ID= +d.Food_ID;
            d.energy= +d.energy;
            d.fat= +d.fat;
            d.carbohydrates= +d.carbohydrates;
            d.fiber= +d.fiber;
            d.protein= +d.protein;
            d.sugar= +d.sugar;
        });
        
        var yScale = d3.scaleLinear()
                        .domain([chartHeight,0])
                        .range([0,chartHeight]);
        var xScale = d3.scaleLinear()
                        .domain([0, 99])
                        .range([0,chartWidth/2]);
        var vegScale = d3.scaleLinear()
                        .domain([0, 99])
                        .range([400,chartWidth]);                
        var rScale = d3.scaleLinear()
                        .domain([d3.min(Data, d=>d.energy), d3.max(Data, d=>d.energy)])
                        .range([10,50]);

        var toolTip = d3.tip()
                        .attr("class", "tooltip")
                        .offset([50, -100])
                        .html(function(d) {
                          return "<strong>Name:</strong> <span>" + d.Name + "</span><br><strong>Calories:</strong> <span>" + d.energy+"</span><br><strong>Fat:</strong> <span>"+d.fat+"</span><br><strong>Protein:</strong>"+d.protein +"</span><br><strong>Carbohydrates:</strong> <span>" + d.carbohydrates+ "</span><br><strong>Fiber:</strong> <span>" +d.fiber+ "</span><br><strong>Sugar:</strong> <span>"+d.sugar+"</span>";
                        });

        chartGroup.call(toolTip);

      function meatPlot(){
        var meatGroup = chartGroup.selectAll("circle")
                    .data(Data)
                    .enter()
                  
              meatGroup.exit().remove();
            var meatEnter= meatGroup.append("circle")
                    .filter(d => d.type == "m")
                    .attr("class", d=> d.group)
                    .attr("cx", d => xScale(d.Food_ID+Math.floor(Math.random() * 5)))
                    .attr("cy", d=> yScale(d.Food_ID+Math.floor(Math.random() * 800)))
                    .attr("r", d=> rScale(d.energy))
                    .attr("fill", "red")
                    .attr("opacity", ".5")
                    .on("mouseover", function(d) {
                        toolTip.show(d, this)
                      })
                    .on("click", function(d){    
                        d3.selectAll("circle").style("stroke", "#e3e3e3").style("stroke-width", "0"); 
                        d3.selectAll(`.${d.group}`).style("stroke", "#fac32a").style("stroke-width", "7");
                      })
                    .on("mouseout", function(d) {
                        toolTip.hide(d);
                      });
        meatGroup=meatGroup.merge(meatEnter);
        meatGroup.exit().remove();
                      var simulation = d3.forceSimulation(Data)
                      .force('charge', d3.forceManyBody().strength(5))
                      .force('x', d3.forceX().x(d => xScale(d.Food_ID)))
                      .force('y', d3.forceY().y(chartHeight/2))
                      .force('collision', d3.forceCollide().radius(d=> rScale(d.energy)))
                      .on('tick', ticked1);
                      
                      function ticked1(){
                        meatEnter.attr("cx", d => d.x).attr("cy", d => d.y)
                        }
                    };
                    meatPlot();


        function vegPlot(){            
        var vegGroup = chartGroup.selectAll("circle2")
                    .data(Data)
                    .enter()
                    
            vegGroup.exit().remove();
        var vegEnter = vegGroup.append("circle")
                    .filter(d => d.type == "v")
                    .attr("class", d=> d.group)
                    .attr("cx", d => vegScale(d.Food_ID+Math.floor(Math.random() * 5)))
                    .attr("cy", d=> yScale(d.Food_ID + Math.floor(Math.random() * 800)))
                    .attr("r", d=> rScale(d.energy))
                    .attr("fill", "green")
                    .attr("opacity", ".5")
                    .on("mouseover", function(d) {
                      toolTip.show(d, this)
                    })
                  .on("click", function(d){    
                      d3.selectAll("circle").style("stroke", "#e3e3e3").style("stroke-width", "0"); 
                      d3.selectAll(`.${d.group}`).style("stroke", "#fac32a").style("stroke-width", "7");
                    })
                  .on("mouseout", function(d) {
                      toolTip.hide(d);
                    });
          vegGroup=vegGroup.merge(vegEnter);

          var simulation = d3.forceSimulation(Data)
          .force('charge', d3.forceManyBody().strength(5))
          .force('x', d3.forceX().x(d => vegScale(d.Food_ID+Math.floor(Math.random() * 5))))
          .force('y', d3.forceY().y(chartHeight/2))
          .force('collision', d3.forceCollide().radius(d=> rScale(d.energy)))
          .on('tick', ticked2);
          
          function ticked2(){
            vegEnter.attr("cx", d => d.x).attr("cy", d => d.y)
            }
        };
          vegPlot();        
 
  
          // var simulation = d3.forceSimulation(Data)
          // .force('charge', d3.forceManyBody().strength(5))
          // .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
          // .force('collision', d3.forceCollide().radius(25))
          // .on('tick', ticked);

// function ticked(){
// meatGroup.attr("cx", d => d.x).attr("cy", d => d.y)
// }
    });
    };

    makeResponsive();
