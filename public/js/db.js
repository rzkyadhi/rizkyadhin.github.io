var dbPromised = idb.open("premiere", 1, function(upgradeDb){
    var articlesObjectStore = upgradeDb.createObjectStore("articles", {
        keyPath: "id"
    });
    articlesObjectStore.createIndex("team_id", "id", { unique: false });
});

function saveForLater(data) {
    dbPromised
        .then(function(db) {
            var tx = db.transaction("articles", "readwrite");
            var store = tx.objectStore("articles");
            console.log(data);
            store.add(data);
            return tx.complete;
        })
        .then(function() {
            console.log("Artikel berhasil di simpan.");
        })
}

function getAll() {
    return new Promise(function(resolve, reject) {
        dbPromised
            .then(function(db) {
                var tx = db.transaction("articles", "readonly");
                var store = tx.objectStore("articles");
                return store.getAll();
            })
            .then(function(data) {
                resolve(data);
            });
    });
}

function getById(id) {
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(function(db) {
          var tx = db.transaction("articles", "readonly");
          var store = tx.objectStore("articles");
          return store.get(id);
        })
        .then(function(data) {
          resolve(data);
        });
    });
  }

  var deleteTeam = (teamId) => {
    dbPromised.then(db => {
      var tx = db.transaction("articles", "readwrite");
      var store = tx.objectStore("articles");
      store.delete(teamId);
      return tx.complete;
    }).then(() => {
      console.log("Team berhasil di hapus.");
      getSavedTeams
    }).catch(err => {
      console.error('Error: ', err);
    });
  }