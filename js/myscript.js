var map = L.map('map').setView([-34.92866, 138.59863], 13);

function style(feature) {
    return {
        fillColor: 'green', //TODO
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: 'white',  
        dashArray: '3'
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 14,
    id: 'examples.map-i875mjb7'
}).addTo(map);

geojson = L.geoJson(lga, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


file = "http://127.0.0.1:62741/res/Adelaide.csv";

Papa.parse(file, {
    download: true,
    complete: function (results){
        console.log(results.data[2]);
    }
});

//Controls
var info = L.control();

info.onAdd = function (map) {
    this.div = L.DomUtil.create('div', 'info');
    this.div.innerHTML =
        '<h4>Select Offence Type</h4>' +
        '<input type ="checkbox" id="assault">Assault<br>'+
        '<input type ="checkbox" id="robbery">Robbery<br>'+
        '<input type ="checkbox" id="drugs">Drug related';
    return this.div;
};


info.addTo(map);


















