var map = L.map('map').setView([40.73451, -73.88786], 10);

//OPENSTREETMAP TILE LAYER
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

//END OPENSTREETMAP TILE LAYER
//
//
//
//ZIP CODES

function zipStyle(feature) {
  return {
    fillColor: getColor(feature.properties.n_ALLbyPOP),
    weight: 0,
    opacity: 1,
    color: 'white',
    dashArray: '',
    fillOpacity: 0.7
  };
}

function highlightZip(zipElement) {
  zipElement.setStyle({
    weight: 7,
    color: 'darkgreen',
  });
}

function resetZip(zipElement) {
  zipElement.setStyle({
    weight: 0,
    color: 'white',
  });
}



function getColor(d) {
  return d > 21.7390 ? '#800026' :
    d > 7.4960 ? '#BD0026' :
    d > 2.5340 ? '#E31A1C' :    d > 1.8780  ? '#FC4E2A' :
    d > 1.2610   ? '#FEB24C' :
    d > 0.6230   ? '#FED976' :
    '#FFEDA0' ;
}

var zip = L.geoJson(zipJSON, {style: zipStyle}).addTo(map);

//END ZIP
//
//
//
// CITY COUNCIL DISTRICTS

var cc = L.geoJson(ccJSON, {style: ccStyle, onEachFeature: ccOnEachFeature}).addTo(map);


function ccStyle(feature) {
  return {
    weight: 1,
    color: 'white',
    opacity: 1,
    dashArray: '3',
    fillOpacity: 0,
  };
}

function highlightCc(ccElement) {
  ccElement.setStyle({
    fillOpacity: 0.3,
    color: 'black',
    dashArray: ''
  });
}

function updateInfo(e) {
  cc.resetStyle(cc);
  resetZip(zip);
  var zipElement = leafletPip.pointInLayer(e.latlng, zip)[0];
  var zipProps = zipElement.feature.properties;
  var zipMsg = zipProps.x_ICEall ? 'Zip code: ' + zipProps.ZIP + '<br />' + zipProps.x_ICEall + ' processed by ICE' : 'no ICE data';
  highlightZip(zipElement);

  var ccElement = leafletPip.pointInLayer(e.latlng, cc)[0];
  var ccProps = ccElement.feature.properties;
  var ccMsg = "City Council District " + ccProps.CounDist + " represented by " + ccProps.cc_NAME;
  highlightCc(ccElement);

  info.update(zipMsg + "<br />" + ccMsg);
}

function ccOnEachFeature(feature, layer) {
  layer.on(
    {
      click: updateInfo
    });
}
/// END CC

/// INFO BOX
 var info = L.control();

      info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
          this.update();
          return this._div;
      };

      // method that we will use to update the control based on feature properties passed
      info.update = function (message) {
          this._div.innerHTML = '<h4>XXXXXX</h4>' +  (message ? message : 'click on a District');
      };

      info.addTo(map);
//END INFO


////////
//LEGEND

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
	grades = [0, 0.6230, 1.2610, 1.8780, 2.5340, 7.4960, 21.7390],
	labels = ['<center><strong> ICE Apprehensions by Zip Code </strong></center>'],
	from, to;


  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
	'<i style="background:' + getColor(from + 1) + '"></i> ' +
	  from + (to ? '&ndash;' + to : '+') + "  per 1,000 people");
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);

//END LEGEND
