var map = L.map('map').setView([40.73451, -73.88786], 10);

//OPENSTREETMAP TILE LAYER
var popupP = L.popup();

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

//END OPENSTREETMAP TILE LAYER


//ZIP CODES

function getColor(d) {
  return d > 261 ? '#800026' :
         d > 150 ? '#BD0026' :
         d > 100 ? '#E31A1C' :
         d > 40  ? '#FC4E2A' :
         d > 15  ? '#FD8D3C' :
         d > 5   ? '#FEB24C' :
         d > 1   ? '#FED976' :
                   '#FFEDA0' ;
}

function zipStyle(feature) {
  return {
    fillColor: getColor(feature.properties.x_ICEall),
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function zipOnEachFeature(feature, layer) {
  layer.on('click', function(e) {
    var ccP = leafletPip.pointInLayer(e.latlng, cc)[0].feature.properties
    var ccMsg = "City Council District " + ccP.CounDist + " represented by " + ccP.cc_NAME;
    var zipMsg = 'Zip code: ' + feature.properties.ZIP + '<br />' + feature.properties.x_ICEall + ' processed by ICE';
    popupP
      .setLatLng(e.latlng)
      .setContent(zipMsg + "<br />" + ccMsg)
      .openOn(map);
  });
}

var zip = L.geoJson(zipJSON, {style: zipStyle, onEachFeature: zipOnEachFeature}).addTo(map);

//END ZIP CODES


//CITY COUNCIL DISTRICTS

function ccStyle(feature) {
  return {
    weight: 1,
    opacity: 1,
    fillOpacity: 0,
    color: 'blue',
    dashArray: '3'
  };
}

function ccOnEachFeature(feature, layer) {
  layer.on('click', function(e) {
    var zipP = leafletPip.pointInLayer(e.latlng, zip)[0].feature.properties
    var ccMsg = "City Council District " + feature.properties.CounDist + " represented by " + feature.properties.cc_NAME;
    var zipMsg = 'Zip code: ' + zipP.ZIP + '<br />' + zipP.x_ICEall + ' processed by ICE';
    popupP
      .setLatLng(e.latlng)
      .setContent(zipMsg + "<br />" + ccMsg)
      .openOn(map);
  });
}
cc = L.geoJson(ccJSON, {style: ccStyle, onEachFeature: ccOnEachFeature}).addTo(map);

//END CITY COUNCIL DISTRICTS


//LEGEND

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
	grades = [0, 1, 5, 15, 40, 100, 200, 150, 261],
	labels = [],
	from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
	'<i style="background:' + getColor(from + 1) + '"></i> ' +
	  from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);

//END LEGEND
