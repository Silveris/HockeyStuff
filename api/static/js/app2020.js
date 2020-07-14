d3.json("api/v1.0/nhl2020").then((importedData) => {
    // This is a placeholder and needs to be moved over to the 2020 data set once loaded
    var data = importedData;
    console.log(data);

    // Finds the unique team names
    var teams = [];
    var lookup = {};
    var items = data;
    for (var item, i=0; item = items[i++];) {
        var team = item.Tm;

        if (!(team in lookup)) {
            lookup[team] = 1;
            teams.push(team);
        }
    }
    console.log(teams);

    // Finds the name of each category
    // var keys = Object.entries(data[0]);
    // keyList = [];
    // keys.forEach(key => {
    //     keyList.push(key[0])
    // });
    // console.log(keyList);

    //var keys = Object.entries(data[0]);
    var newData = reorder(data);
    var keys = Object.entries(newData[0]);
    keyList = [];
    keys.forEach(key => {
        keyList.push(key[0])
    });
    console.log(keyList);

    // Populates the dropdown options
    dropdown = d3.select("#selDataset");
    teams.forEach(tm => {
        dropdown.append("option")
            .text(tm);
    })

    function updateTable() {
        var team = dropdown.property("value");
        console.log(team);

        var filteredData = data.filter(player => player.Tm === team)
        console.log(filteredData);

        var tableHeader = d3.select('tr');
        tableHeader.html("");
        keyList.forEach(key => {
            tableHeader.append("th")
                .text(key)
                .classed("table-head", true);
        })
        
        var reorderData = reorder(filteredData);
        var tbody = d3.select("tbody");
        tbody.html("");
        reorderData.forEach(player => {
            var row = tbody.append("tr");
            Object.entries(player).forEach(([key, value]) => row.append("td").text(value));
        });

        reorder(filteredData);
    }

    function reorder(data) {
        var reordered = [];
        
        data.forEach(player => {
            dict = {};
            dict = {
                Player: player.Player,
                Age: player.Age,
                Pos: player.Pos,
                GP: player.GP,
                G: player.G,
                A: player.A,
                Pts: player.PTS,
                PlusMinus: player['+/-'],
                PIM: player.PIM,
                ShootPercent: player['S%'],
                TOI: player.TOI,
                ATOI: player.ATOI,
                Hits: player.HIT,
                Blks: player.BLK

            }
            reordered.push(dict);
        })
        console.log(reordered)
        return reordered;
    }

    updateTable;
    dropdown.on("change", updateTable);
  


    





});
