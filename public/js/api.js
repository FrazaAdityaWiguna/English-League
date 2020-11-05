let base_url = "https://api.football-data.org";
let token = "a894a59cf94449aaada1d0ba340f3e0d";
let id_league = "2021";

let endpoint_all_team = `${base_url}/v2/competitions/${id_league}/teams`;
let endpoint_league_standings = `${base_url}/v2/competitions/${id_league}/standings`;
let endpoint_team_information = `${base_url}/v2/teams`;
let endpoint_match_schedule = `${base_url}/v2/competitions/${id_league}/matches`;

var fetchApi = (url) => {
    return fetch(url, {
        headers: {
            "X-Auth-Token": token,
        },
    });
};

// Blok kode yang akan di panggil juka fettch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log(`Error: ${response.status}`);
        //Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode intik memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log(`Error: ${error}`);
}

function getAllTeams() {
    if ("caches" in window) {
        caches.match(endpoint_all_team).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    let teamsHTML = "";
                    data.teams.forEach(function(team) {
                        teamsHTML += `
                        <div class="col s12 m8 offset-m2 l12 ">
                        <div class="card-panel grey lighten-5 z-depth-1">
                            <div class="row valign-wrapper">
                                <div class="col s4">
                                    <img src="${team.crestUrl}" alt="Logo" class="circle responsive-img">
                                </div>
                                <div class="col s10">
                                    <a href="./info_teams.html?id=${team.id}">
                                        <h5>${team.name}</h5>
                                    </a>
                                    <div class="card-content">
                                        <p>address: ${team.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("teams").innerHTML = teamsHTML;
                });
            }
        });
    }

    fetchApi(endpoint_all_team)
        .then(status)
        .then(json)
        .then(function(data) {
            // Objek/array JavaScript dari response.json() masuk lewat data.
            // merubah link yg http ke https
            data = JSON.parse(JSON.stringify(data).replace(/http:/g, "https:"));
            // Menyusun komponen card artikel secara dinamis
            let teamsHTML = "";
            data.teams.forEach(function(team) {
                teamsHTML += `
            <div class="col s12 m8 offset-m2 l12">
                <div class="card-panel grey lighten-5 z-depth-1">
                    <div class="row valign-wrapper">
                        <div class="col s4">
                            <img src="${team.crestUrl}" alt="Logo" class="circle responsive-img" width="200px" height=""200px>
                        </div>
                        <div class="col s8">
                            <a href="./info_teams.html?id=${team.id}">
                                <h5>${team.name}</h5>
                            </a>
                            <div class="card-content">
                                <p>address: ${team.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("teams").innerHTML = teamsHTML;
        })
        .catch(error);
}

function getTeamById() {
    return new Promise(function(resolve, reject) {
        // Ambil nilai query parameter (?id=)
        var urlParams = new URLSearchParams(window.location.search);
        var idParam = urlParams.get("id");

        var squadsHTML = "";

        if ("caches" in window) {
            caches
                .match(endpoint_team_information + "/" + idParam)
                .then(function(response) {
                    if (response) {
                        response.json().then(function(data) {
                            data = JSON.parse(
                                JSON.stringify(data).replace(/http:/g, "https:")
                            );

                            document.getElementById("club_logo").src = data.crestUrl;
                            document.getElementById("name").innerHTML = data.name;
                            document.getElementById("shortName").innerHTML = data.shortName;
                            document.getElementById("address").innerHTML = data.address;
                            document.getElementById("phone").innerHTML = data.phone;
                            document.getElementById("website").innerHTML = data.website;
                            document.getElementById("email").innerHTML = data.email;
                            document.getElementById("clubColors").innerHTML = data.clubColors;
                            document.getElementById("tla").innerHTML = data.tla;
                            document.getElementById("founded").innerHTML = data.founded;
                            document.getElementById("areaID").innerHTML = data.area.id;
                            document.getElementById("areaName").innerHTML = data.area.name;

                            data.squad.forEach(function(squad) {
                                // Menyusun komponen card artikel secara dinamis
                                squadsHTML += `
                          <div class="card z-depth-2">
                              <div class="card-content">
                              <h5>Player Info</h5>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>ID:</td>
                                                <td id="id">${squad.id}</td>
                                            </tr>
                                            <tr>
                                                <td>Name:</td>
                                                <td id="plyName">${squad.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Date Of Birth:</td>
                                                <td id="dateOfBirth">${squad.dateOfBirth}</td>
                                            </tr>
                                            <tr>
                                                <td>Nationality:</td>
                                                <td id="nationality">${squad.nationality}</td>
                                            </tr>
                                            <tr>
                                                <td>Position:</td>
                                                <td id="position">${squad.position}</td>
                                            </tr>
                                            <tr>
                                                <td>Role:</td>
                                                <td id="role">${squad.role}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                              </div>
                          </div>
                          `;
                            });

                            // Sisipkan komponen card ke dalam elemen dengan id #content
                            document.getElementById("list-player").innerHTML = squadsHTML;

                            // kirim object hasil parsing json agar bisa disimpan ke indexed db
                            resolve(data);
                        });
                    }
                });
        }

        fetchApi(endpoint_team_information + "/" + idParam)
            .then(status)
            .then(json)
            .then(function(data) {
                // Objek JaceScript dari response.json() masuk lewat variabel data.
                // merubah link yg http ke https
                data = JSON.parse(JSON.stringify(data).replace(/http:/g, "https:"));
                // Menyusun komponen card artikel secara dinamis
                document.getElementById("club_logo").src = data.crestUrl;
                document.getElementById("name").innerHTML = data.name;
                document.getElementById("shortName").innerHTML = data.shortName;
                document.getElementById("address").innerHTML = data.address;
                document.getElementById("phone").innerHTML = data.phone;
                document.getElementById("website").innerHTML = data.website;
                document.getElementById("email").innerHTML = data.email;
                document.getElementById("clubColors").innerHTML = data.clubColors;
                document.getElementById("tla").innerHTML = data.tla;
                document.getElementById("founded").innerHTML = data.founded;
                document.getElementById("areaID").innerHTML = data.area.id;
                document.getElementById("areaName").innerHTML = data.area.name;

                data.squad.forEach(function(squad) {
                    // Menyusun komponen card artikel secara dinamis
                    squadsHTML += `
              <div class="card z-depth-2">
                  <div class="card-content">
                  <h5>Player Info</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td>ID:</td>
                                    <td id="id">${squad.id}</td>
                                </tr>
                                <tr>
                                    <td>Name:</td>
                                    <td id="plyName">${squad.name}</td>
                                </tr>
                                <tr>
                                    <td>Date Of Birth:</td>
                                    <td id="dateOfBirth">${squad.dateOfBirth}</td>
                                </tr>
                                <tr>
                                    <td>Nationality:</td>
                                    <td id="nationality">${squad.nationality}</td>
                                </tr>
                                <tr>
                                    <td>Position:</td>
                                    <td id="position">${squad.position}</td>
                                </tr>
                                <tr>
                                    <td>Role:</td>
                                    <td id="role">${squad.role}</td>
                                </tr>
                            </tbody>
                        </table>
                  </div>
              </div>
              `;
                });

                // Sisipkan komponen card ke dalam elemen dengan id #content
                document.getElementById("list-player").innerHTML = squadsHTML;

                // kirim object hasil parsing json agar bisa disimpan ke indexed db
                resolve(data);
            })
            .catch(error);
    });
}

// siap data untuk standings
function getStandings() {
    if ("caches" in window) {
        caches.match(endpoint_league_standings).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    standings(data);
                });
            }
        });
    }

    fetchApi(endpoint_league_standings)
        .then(status)
        .then(json)
        .then(function(data) {
            standings(data);
        })
        .catch(error);
}