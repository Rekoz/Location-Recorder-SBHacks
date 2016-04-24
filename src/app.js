/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Accel = require('ui/accel');
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

var flag = false;

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

// Accel.on('tap', function(e) {
//   console.log('Tap event on axis: ' + e.axis + ' and direction: ' + e.direction);
// });

// main.on('click', 'up', function(e) {
  
//   var menu = new UI.Menu({
//     sections: [{
//       items: [{
//         title: 'Pebble.js',
//         icon: 'images/menu_icon.png',
//         subtitle: 'Can do Menus'
//       }, {
//         title: 'Second Item',
//         subtitle: 'Subtitle Text'
//       }]
//     }]
//   });
//   menu.on('select', function(e) {
//     console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
//     console.log('The item is titled "' + e.item.title + '"');
//   });
//   menu.show();
// });

main.on('click', 'select', function(e) {
  navigator.geolocation.getCurrentPosition(success, error, options);
  var card = new UI.Card();
  card.title('Current Location Recorded');
  card.show();
});

main.on('click', 'down', function(e) {
  var menuItems = [];
  var idx = cur;
  for (var i = 0; i < 3; i++) {
    if (idx < 0) idx += 3;
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
        title: 'Location',
        body: String(content[0]) + ',\n' + String(content[1])
      });
    detailCard.show();
  });
  resultsMenu.show();
  
//   var card = new UI.Card();
//   navigator.geolocation.getCurrentPosition(success, error, options);
//   card.title('Location Recorded');
//   card.subtitle('Latitude : ' + lat+ ' Longitude: '+ long);
//   card.body();
//   card.show();
});