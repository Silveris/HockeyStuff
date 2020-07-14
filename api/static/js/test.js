// read in forward and defenseman data
d3.json("/api/v1.0/forward").then((importedFData) => {
    var Forwards = importedFData;
    console.log("Forwards", Forwards);
})

d3.json("/api/v1.0/d").then((importedDData) => {
    var Defensemen = importedDData;
    console.log("Defensemen", Defensemen);
})

console.log('space');
//console.log("years", d3.extent(importedFData.Season));

// Initializes the page with a default plot
function init() {
    data = [{
      x: [0],
      y: [0] }];
  
    Plotly.newPlot("plot", data);
  }
  
  // Call updatePlotly() when a change takes place to the DOM
  d3.selectAll("#selDataset").on("change", updatePlotly);
  
  // This function is called when a dropdown menu item is selected
  function updatePlotly() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
  
    // Initialize x and y arrays
    var x = [];
    var y = [];
  
    if (dataset === 'Forwards') {
      x = [1, 2, 3, 4, 5];
      y = [1, 2, 4, 8, 16];
    }
  
    if (dataset === 'Defensemen') {
      x = [10, 20, 30, 40, 50];
      y = [1, 10, 100, 1000, 10000];
    }
  
    // Note the extra brackets around 'x' and 'y'
    Plotly.restyle("plot", "x", [x]);
    Plotly.restyle("plot", "y", [y]);
  }
  
  init();
  