function standings(data) {
    var tableStandings = "";

    data.standings.forEach(function(dataSandings) {
        if (dataSandings.type === "TOTAL") {
            dataSandings.table.forEach(function(team) {
                // Replace HTTP to HTTPS
                team = JSON.parse(JSON.stringify(team).replace(/http:/g, "https:"));

                tableStandings += `
                <div class="row">
    <div class="col s12 l12">
        <div class="card grey lighten-5">
            <div class="card-content black-text">
                <table class="highlight responsive-table centered">
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Team</th>
                            <th>Played</th>
                            <th>Lost</th>
                            <th>Draw</th>
                            <th>Won</th>
                            <th>Points</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td id="position">${team.position}</td>
                            <td id="team">
                            <a href="/info_teams.html?id=${team.team.id}">
                                <p>
                                    <img src="${team.team.crestUrl}" alt="Logo Team" class="show-on-medium-and-up show-on-medium-and-down" style="float:left;width:22px;height:22px;margin-right:20px;cursor: pointer;">${team.team.name}
                                </p>
                            </a>
                            </td>
                            <td id="played">${team.playedGames}</td>
                            <td id="lost">${team.lost}</td>
                            <td id="draw">${team.draw}</td>
                            <td id="won">${team.won}</td>
                            <td id="points">${team.points}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
                `;
            });
        }
    });
    // sisipkan komponen card ke dalam elemen dengan id standings_table
    document.getElementById("standings_table").innerHTML = tableStandings;
}