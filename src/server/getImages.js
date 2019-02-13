const mps = require('../assets/allMembers.json')

const http = require('http');
const fs = require('fs');

// const file = fs.createWriteStream("file.jpg");
// const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function (response) {
//   response.pipe(file);
// });


// mps.forEach(mp => {
//   fetch(`http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${mp.id}`)
//     // .then(res => res.body.pipe(fs.createWriteStream(`./mpPortraits/${mp.id}.jpeg`)))
//     .then(res => console.log(res.body))
//     .catch(e => console.log(e))
// });

var download = function (url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close();  // close() is async, call cb after close completes.
    });
  }).on('error', function (err) { // Handle errors
    console.log(cb)
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    // if (cb) cb(err.message);
  });
};


mps.forEach(mp => {
  // const file = fs.createWriteStream(`../assets/mpPortraits/${mp.id}.jpeg`);
  // http.get(`http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${mp.id}`, function (response) {
  //   response.pipe(file);
  // }).catch(e => console.log(e, 'LOGGED'))

  // download(`http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${mp.id}/`, `./src/assets/temptemp/${mp.id}.jpeg`, mp.id)


  fs.readFileSync(`./src/assets/mpPortraits/${mp.id}.jpeg`)



})

// download(`http://data.parliament.uk/membersdataplatform/services/images/MemberPhoto/${18}/`, `./src/assets/mpPortraits/${18}.jpeg`)