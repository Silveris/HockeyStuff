// // read in forward and defenseman data
// d3.json("/api/v1.0/forward").then(function(importedFData) {
//     console.log(importedFData);

//     // log a list of names
//     var seasons = importedFData.map(data => data.Seasons);
  
//     // Cast each hours value in tvData as a number using the unary + operator
//     importedFData.forEach(function(data) {
//       data.Season = +data.Season;
//     //   console.log("Season:", data.Season);
//       return d3.mean(data.PTS);
//     //   console.log("Points:", data.PTS);
//     });
//   }).catch(function(error) {
//     console.log(error);
//   });
// ------------------------------------------------------

// Set the dimensions of the canvas / graph
var margin = {top: 60, right: 40, bottom: 60, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// // Define the line
// var valueline = d3.svg.line()
//     .x(function(d) { return x(d.Age); })
//     .y(function(d) { return y(d.PTS); });
    
// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// function for the x grid lines
function make_x_axis() {
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5)
}

// function for the y grid lines
function make_y_axis() {
  return d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
}

// Get the data
d3.json("/api/v1.0/forward", function(error, data) {
    data.forEach(function(d) {
        d.Season = +d.Season;
        d.Age = +d.Age;
        d.PTS = +d.PTS;
    });

    // Scale the range of the data
    x.domain([16, d3.max(data, function(d) { return d.Age; }) + 1]);
    y.domain([0, d3.max(data, function(d) { return d.PTS; })]);

    // Draw the x Grid lines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    // Draw the y Grid lines
    svg.append("g")            
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    // // Add the valueline path.
    // svg.append("path")
    //     .attr("class", "line")
    //     .attr("d", valueline(data));

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
      .filter(function(d) { return d.Season === 2011 })
        .style("fill", "red")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.Age); })
        .attr("cy", function(d) { return y(d.PTS); });


    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

     // Add the text label for the X axis
     svg.append("text")
     .attr("transform",
           "translate(" + (width/2) + " ," + 
                          (height+50) + ")")
     .style("text-anchor", "middle")
     .style("font-size", "24px")
     .text("Age");

     // Add the text label for the Y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", margin.top - (height / 2.1))
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("font-size", "24px")
    .text("Points");

    // Add the title
    svg.append("text")
        .attr("x", (width / 2))     
        .attr("y", 0 - (margin.top / 6))
        .attr("text-anchor", "middle")
        .style("font-size", "32px")
        .text("Points Scored by Age");
});