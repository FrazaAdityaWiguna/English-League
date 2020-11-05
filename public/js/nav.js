document.addEventListener("DOMContentLoaded", function() {
    // Active Sidebar nav
    let elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    var typeSaved = "";

    loadNav();

    function loadNav() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status != 200) return;

                // Memuat daftar tautan menu
                document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                // daftarkan event listener untuk setiap tautan menu
                document
                    .querySelectorAll(".sidenav a, .topnav a")
                    .forEach(function(elm) {
                        elm.addEventListener("click", function(event) {
                            // Tutup sidenav
                            let sidenav = document.querySelector(".sidenav");
                            M.Sidenav.getInstance(sidenav).close();

                            // Memuat konten halaman yang dipanggil
                            page = event.target.getAttribute("href").substr(1);
                            loadPage(setupPage(page));
                        });
                    });
            }
        };
        xhttp.open("GET", "nav.html");
        xhttp.send();
    }

    // Load page Content
    var page = window.location.hash.substr(1);
    if (page === "" || page === "home");
    loadPage(setupPage(page));

    function setupPage(page) {
        if (page === "" || page === "#") {
            page = "home";
        } else if (page === "favorite" || page === "team_saved") {
            page = "favorite";
            typeSaved = "team";
        } else {
            typeSaved = "";
        }
        return page;
    }

    function loadPage(page) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                let content = document.querySelector("#body-content");

                if (this.status === 200) {
                    content.innerHTML = xhttp.responseText;

                    // ---

                    if (page === "home") {
                        getAllTeams();
                    } else if (page === "league_standings") {
                        getStandings();
                    } else if (page === "favorite") {
                        setSavedToHTML(typeSaved);
                    }
                } else if (this.status === 404) {
                    content.innerHTML = "<p>Halaman tidak dapat ditemukan</p>";
                } else {
                    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses</p>";
                }
            }
        };
        xhttp.open("GET", "pages/" + page + ".html");
        xhttp.send();
    }
});