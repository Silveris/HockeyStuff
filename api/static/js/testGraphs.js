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
var svg = d3.select("#graph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);


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

    f_age_data.forEach(function(d) {
        d.Age = +d.Age;
        d["Avg PTS/60min"] = +d["Avg PTS/60min"];
        d["Avg HIT/60min"] = +d["Avg HIT/60min"];
        d["Avg BLK/60min"] = +d["Avg BLK/60min"];
        d["Med PIM/60min"] = +d["Med PIM/60min"];
      });
    
      d_age_data.forEach(function(d) {
        d.Age = +d.Age;
        d["Avg PTS/60min"] = +d["Avg PTS/60min"];
        d["Avg HIT/60min"] = +d["Avg HIT/60min"];
        d["Avg BLK/60min"] = +d["Avg BLK/60min"];
        d["Med PIM/60min"] = +d["Med PIM/60min"];
      });
    
    f_season_data.forEach(function(d) {
      d.Age = +d.Age;
      d["Avg PTS/60min"] = +d["Avg PTS/60min"];
      d["Avg HIT/60min"] = +d["Avg HIT/60min"];
      d["Avg BLK/60min"] = +d["Avg BLK/60min"];
      d["Med PIM/60min"] = +d["Med PIM/60min"];
      d.Season_group = d.Season_group;
    });
    
    d_season_data.forEach(function(d) {
        d.Age = +d.Age;
        d["Avg PTS/60min"] = +d["Avg PTS/60min"];
        d["Avg HIT/60min"] = +d["Avg HIT/60min"];
        d["Avg BLK/60min"] = +d["Avg BLK/60min"];
        d["Med PIM/60min"] = +d["Med PIM/60min"];
        d.Season_group = d.Season_group;
      });

    var dropdown1 = d3.select("#position-sel");
    var dropdown2 = d3.select("#metric-sel");
    var dropdown3 = d3.select("#grouping-sel");

    function init() {
        getDropDown;
    }

    // Finds the dropdown values to make a graph with
    function getDropDown() {
        var position = d3.select("#position-sel").property("value");
        var metric = d3.select("#metric-sel").property("value");
        var grouping = d3.select("#grouping-sel").property("value");

        console.log(`${position} ${metric} ${grouping}`);
        // Passes the dropdown values
        chooseData(position, metric, grouping)
    }

    // Selects the correct data set based on the dropdown values
    function chooseData(pos, metric, group) {
        if (pos === 'Forward') {
            if (group === 'All Data') {
                makePlot(f_age_data, metric, group);
            }
            else {
                makePlot(f_season_data, metric, group);
            }
        }
        else {
            if (group === "All Data") {
                makePlot(d_age_data, metric, group);
            }
            else {
                makePlot(d_season_data, metric, group)
            }
        }
    }

    // Creates a plot based on the dataset and metric
    function makePlot(data, metric, group) {
        // Clears the old visual each time a new one is created
        graph = d3.select("svg");
        graph.html("");
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        if (metric === "Points") {
            col_name = "Avg PTS/60min";
        }
        else if (metric === "Hits") {
            col_name = "Avg HIT/60min";
        }
        else if (metric === "Blocks") {
            col_name = "Avg BLK/60min";
        }
        else {
            col_name = "Med PIM/60min"
        }



        var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Age))
        .range([0, chartWidth]);

        // Configure a linear scale with a range between the chartHeight and 0
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[col_name]), d3.max(data, d => d[col_name])])
            .range([chartHeight, 0]);

        // Create two new functions passing the scales in as arguments
        // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Configure a line function which will plot the x and y coordinates using our scales
        var drawLine = d3.line()
            .x(d => xLinearScale(d.Age))
            .y(d => yLinearScale(d[col_name]));

        if (group === "Year Groups") {
            var early = data.filter(data => data.Season_group === "2004-06");
            var mid = data.filter(data => data.Season_group === "2009-11");
            var late = data.filter(data => data.Season_group === "2016-18");
            console.log(early);

            chartGroup.append("path")
                .attr("d", drawLine(early))
                .classed("line1", true);
            chartGroup.append("path")
                .attr("d", drawLine(mid))
                .classed("line2", true);
            chartGroup.append("path")
                .attr("d", drawLine(late))
                .classed("line3", true);
        }
        else {
            // Append an SVG path and plot its points using the line function
            chartGroup.append("path")
                // The drawLine function returns the instructions for creating the line for forceData
                .attr("d", drawLine(data))
                .classed("line", true);
        }

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

        // Add the text label for the X axis
        svg.append("text")
        .attr("x", (chartWidth / 2))
        .attr("y", chartHeight + (margin.bottom * 1.8))
        .style("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Age");

        // Add the text label for the Y axis
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", margin.top - (chartHeight / 2.1))
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size", "24px")
        .text(`${metric} per 60 min`);

        // Add the title
        svg.append("text")
            .attr("x", (chartWidth / 2))     
            .attr("y", 0 + margin.top)
            .attr("text-anchor", "middle")
            .style("font-size", "32px")
            .text(`Average ${metric} per 60 Minutes`);




    }


    init;
    dropdown1.on("change", getDropDown);
    dropdown2.on("change", getDropDown);
    dropdown3.on("change", getDropDown);
})
