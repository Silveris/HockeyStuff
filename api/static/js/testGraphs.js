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
    
    console.log(f_age_data);
    console.log(d_age_data);
    console.log(f_season_data);
    console.log(d_season_data);

})