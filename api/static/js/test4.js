// Promise.all([
//     d3.json("api/v1.0/defense"),
//     d3.json("api/v1.0/forward"),
// ]).then(function(files) {
//     d_data = files[0];
//     f_data = files[1];
//     // files[0] will contain file1.json
//     // files[1] will contain file2.json
//     console.log(d_data);
//     console.log(f_data);


// })

Promise.all([
    d3.json("api/v1.0/age/forward"),
    d3.json("api/v1.0/age/defensemen"),
    d3.json("api/v1.0/ageseason/forward"),
    d3.json("api/v1.0/ageseason/defensemen"),
]).then(function(files) {
    // These two are used normally for the pts, hits, blocks, med pim
    f_age_data = files[0];
    d_age_data = files[1];
    // These two are used for the same, but will have three lines on the graph
    // one for the 3 groups of season (2004-06, 2009-11, 2016-18) 
    f_season_data = files[2];
    d_season_data = files[3];
    
    //console.log(f_age_data);
    //console.log(d_age_data);
    console.log(f_season_data);
    //console.log(d_season_data);

})

// ------------------------------------------------------------------------------

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from API
d3.json("api/v1.0/ageseason/forward").then(function(asfData) {

  // Format the date and cast the force value to a number
  asfData.forEach(function(d) {
    d.Age = +d.Age;
    d["Avg PTS/60min"] = +d["Avg PTS/60min"];
    d.Season_group = d.Seaon_group;
  });

  // d3.extent returns the an array containing the min and max values for the property specified
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(asfData, d => d.Age))
    .range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(asfData, d => d["Avg PTS/60min"])])
    .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Configure a line function which will plot the x and y coordinates using our scales
  var drawLine = d3.line()
    .x(d => xLinearScale(d.Age))
    .y(d => yLinearScale(d["Avg PTS/60min"]));

  // Append an SVG path and plot its points using the line function
  chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for forceData
    .attr("d", drawLine(asfData))
    .classed("line", true);

  // Append an SVG group element to the chartGroup, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

  // Append an SVG group element to the chartGroup, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
}).catch(function(error) {
  console.log(error);
});