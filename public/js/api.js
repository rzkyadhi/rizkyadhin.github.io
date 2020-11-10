let base_url = "https://api.football-data.org/v2/";
let API_TOKEN = {
  headers: {
    'X-Auth-Token': '3db3d0d2eae54f52bd7d3a32250a4489'
  }
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
let getTeams = "competitions/2021/teams";
function getAllTeams() {
  if ("caches" in window) {
    caches.match(base_url + getTeams, API_TOKEN).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var teamListHTML = "";
          data.teams.forEach(function(data) {
            teamListHTML += `
                  <div class="card-panel">
                    <a href="./article.html?id=${data.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img class="circle responsive-img" src="${data.crestUrl}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate"><b>${data.name}</b></span>
                      <p>Short Name: ${data.shortName}</p>
                      <p>Founded: ${data.founded}</p>
                      <p>Venue: ${data.venue}</p>
                    </div>
                  </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("teamList").innerHTML = teamListHTML;
        });
      }
    });
  }

  fetch(base_url + getTeams, API_TOKEN)
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var teamListHTML = "";
      data.teams.forEach(function(data) {
        teamListHTML += `
              <div class="card-panel">
                <a href="./article.html?id=${data.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img class="circle responsive-img" src="${data.crestUrl}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${data.name}</span>
                  <p>Short Name: ${data.shortName}</p>
                  <p>Founded: ${data.founded}</p>
                  <p>Venue: ${data.venue}</p>
                </div>
              </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("teamList").innerHTML = teamListHTML;
    })
    .catch(error);
}

function getTeamListById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam, API_TOKEN).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            var teamListByIdHTML = `
            <div class="card">
              <a href="./article.html?id=${data.id}">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${data.crestUrl}" />
                </div>
              </a>
              <div class="card-content dark purple-4">
                <span class="card-title truncate">${data.name}</span>
                <p>Short Name: ${data.shortName}</p>
                <p>Founded: ${data.founded}</p>
                <p>Venue: ${data.venue}</p>
              </div>
            </div>
            `;
            
            document.getElementById("body-content").innerHTML = teamListByIdHTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }
    fetch(base_url + "teams/" + idParam, API_TOKEN)
      .then(status)
      .then(json)
      .then(function(data) {
        // ... kode lain disembunyikan agar lebih ringkas 
        var fetchTeamListByIdHTML = `
            <div class="card">
              <a href="./article.html?id=${data.id}">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${data.crestUrl}" />
                </div>
              </a>
              <div class="card-content dark purple-4">
                <span class="card-title truncate">${data.name}</span>
                <p>Short Name: ${data.shortName}</p>
                <p>Founded: ${data.founded}</p>
                <p>Venue: ${data.venue}</p>
              </div>
            </div>
            `;
        
        document.getElementById("body-content").innerHTML = fetchTeamListByIdHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedTeams() {
  getAll().then(function(data) {
    console.log(data);
    // Menyusun komponen card artikel secara dinamis
    var savedTeamHTML = "";
    data.forEach(function(data) {
      savedTeamHTML += `
      <div class="card">
        <a href="./article.html?id=${data.id}">
          <div class="card-image waves-effect waves-block waves-light">
            <img src="${data.crestUrl}" />
          </div>
        </a>
        <div class="card-content dark purple-4">
          <span class="card-title truncate">${data.name}</span>
          <p>Short Name: ${data.shortName}</p>
          <p>Founded: ${data.founded}</p>
          <p>Venue: ${data.venue}</p>
        </div>
      </div>
      <div class="card-action right-align">
                <a class="waves-effect waves-light btn-small green" onclick="deleteTeamListener(${data.id})">DELETE TEAMS</a>
      </div>
        `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = savedTeamHTML;
  });
}

var deleteTeamListener = teamId => {
  deleteTeam(teamId);
}


function getSavedTeamsById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  
  getById(parseInt(idParam)).then(function(data) {
    savedTeamByIdHTML = '';
    var savedTeamByIdHTML = `
      <div class="card">
              <a href="./article.html?id=${data.id}">
                <div class="card-image waves-effect waves-block waves-light">
                  <img class="circle responsive-img" src="${data.crestUrl}" />
                </div>
              </a>
              <div class="card-content dark purple-4">
                <span class="card-title truncate">${data.name}</span>
                <p>Short Name: ${data.shortName}</p>
                <p>Founded: ${data.founded}</p>
                <p>Venue: ${data.venue}</p>
              </div>
      </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = savedTeamByIdHTML;
  });
}

let getScorers = "competitions/2021/scorers/";
function getAllScorers() {
  if ('caches' in window) {
    caches.match(base_url + getScorers, API_TOKEN).then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var scorerHTML = "";
          data.scorers.forEach(function(score) {
            scorerHTML += `
            <tr>
              <td>${score.player.name}</td>
              <td>${score.team.name}</td>
              <td>${score.player.position}</td>
              <td>${score.numberOfGoals}</td>
            </tr>
            `;
          });
          document.getElementById("scorerList").innerHTML = scorerHTML;
        })
      }
    }) 
  }

  fetch(base_url + getScorers, API_TOKEN)
    .then(status)
    .then(json)
    .then(function(data) {
      var scorerHTML = "";
      data.scorers.forEach(function(score) {
        scorerHTML += `
            <tr>
              <td>${score.player.name}</td>
              <td>${score.team.name}</td>
              <td>${score.player.position}</td>
              <td>${score.numberOfGoals}</td>
            </tr>
        `;
      });
      document.getElementById("scorerList").innerHTML = scorerHTML;
    }) 
    .catch(error);
}