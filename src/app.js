/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Accel = require('ui/accel');
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

var cur = localStorage.getItem('cur');
function success(pos) {
  var crd = pos.coords;
  cur = localStorage.getItem('cur');
  if (cur === null) cur = 0;
  cur = (cur + 1) % 3;
  localStorage.setItem('cur', cur);
  var p = [crd.latitude, crd.longitude, pos.timestamp];
  console.log(p);
  localStorage.setItem('loc'+cur, JSON.stringify(p));
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

var main = new UI.Card({
  title: 'Parking',
  icon: 'images/menu_icon.png',
  subtitle: 'Record your location',
  body: 'By Press the SELECT button',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'select', function(e) {
  navigator.geolocation.getCurrentPosition(success, error, options);
});

main.on('click', 'down', function(e) {
  var menuItems = [];
  var idx = cur;
  for (var i = 0; i < 3; i++) {
    if (idx < 0) idx += 3;
    console.log(idx);
    var item = JSON.parse(localStorage.getItem('loc'+idx)); 
    console.log(item);
    var date = new Date(item[2]);
    menuItems.push({
      title: date.toLocaleTimeString(),
      subtitle: date.toLocaleDateString()
    });
    idx--;
  }
  var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Location Records',
        items: menuItems
      }]
  });
  resultsMenu.on('select', function(e) {
    var id = (idx+3-e.itemIndex) % 3;
    var content = JSON.parse(localStorage.getItem('loc'+id));
    var detailCard = new UI.Card({
        //title: 'Location',
        //body: String(content[0]) + ',\n' + String(content[1])
        title: 'Instruction',
        subtitle: '374 ft, 1 min',
        body: 'Turn toward Arliss st'
      });
    detailCard.show();
    var curLoc;
    navigator.geolocation.getCurrentPosition(function(pos){
      curLoc = pos.coords.latitude + ',' + pos.coords.longitutde;
    }, error, options);
    var googleDirectionsURL = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + curLoc + '&destination=' + content[0] + ',' + content[1] + 'Montreal&key=AIzaSyCDcSqU7Jpa737K7Ioa93bFF9lWpvsPPXw';
    var directions = null;
    ajax({
        url: googleDirectionsURL,
        type: 'json',
        success: function(data) {
          directions = data;
          console.log(directions.status);
        },
        error: error,
        async: false
      });
    console.log(directions.routes);
    var steps = directions.routes[0].legs[0].steps;
    var stepi = 0;
    detailCard.body('distance'+steps[0].distance.text+'\n'+steps[0].html_instructions);
   // detailCard.show();
    function updateLoc() {
      var curLocX, curLocY;
      navigator.geolocation.getCurrentPosition(function(pos){
        curLocX = pos.coords.latitude;
        curLocY = pos.coords.longtitude;
      }, error, options);
    }
  });
  resultsMenu.show();
});