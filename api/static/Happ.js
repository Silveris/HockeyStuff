d3.json("http://127.0.0.1:5000/api/v1.0/forward").then((importedFData) => {
    var fData = importedFData;
    console.log(fData);
})