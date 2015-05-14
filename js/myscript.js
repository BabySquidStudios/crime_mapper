var map = L.map('map').setView([-34.92866, 138.59863], 10);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 14,
    id: 'examples.map-i875mjb7'
}).addTo(map);

var files = [
"res/Adelaide Hills.csv",
"res/Adelaide.csv",
"res/Burnside.csv",
"res/Campbelltown.csv",
"res/Charles Sturt.csv",
"res/Gawler.csv",
"res/Holdfast Bay.csv",
"res/Marion.csv",
"res/Mitcham.csv",
"res/Norwood Payneham St Peters.csv",
"res/Onkaparinga.csv",
"res/Playford.csv",
"res/Port Adelaide Enfield.csv",
"res/Prospect.csv",
"res/Salisbury.csv",
"res/Tea Tree Gully.csv",
"res/Unley.csv",
"res/Walkerville.csv",
"res/West Torrens.csv"];

var offenceTypes = [
    'All offences against the person, excl sexual',
    'All sexual offences',
    'All robbery and extortion offences',
    'All offences against property',
    'All offences against good order',
    'All drug offences',
    'All driving offences',
    'Total offences'
];

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

var selected = 1;

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML =
        '<h3> Select Offence Type </h3>' +
        '<select id = "offence" onChange = "setSelection()">' +
        '<option value="1">' + offenceTypes[0] + '</option>' +
        '<option value="6">' + offenceTypes[1] + '</option>' +
        '<option value="11">' + offenceTypes[2] + '</option>' +
        '<option value="15">' + offenceTypes[3] + '</option>' +
        '<option value="25">' + offenceTypes[4] + '</option>' +
        '<option value="26">' + offenceTypes[5] + '</option>' +
        '<option value="32">' + offenceTypes[6] + '</option>' +
        '<option value="40">' + offenceTypes[7] + '</option>' +
        '< /select>';
};

info.addTo(map);

//[LGA][OFFENCE TYPE][YEAR]
var lgaData = [];
var count = 0;
var geojson;

function setSelection() {
    var e = document.getElementById("offence");
    selected = e.value;
    map.removeLayer(geojson);
    addLGAs(lgaData)
}

for (var i = 0; i < files.length; i++) {
    Papa.parse(files[i], {
        download: true,
        complete: function (results) {
            lgaData.push(results.data);
            count++;
            if (count == files.length) {
                addLGAs(lgaData);
                console.log(lgaData);
            }
        }
    });
}

function addLGAs(data) {
    lgaData = data;
    values = [];

    for (var i = 0; i < files.length; i++) {
        values.push(lgaData[i][selected][5]);
    }

    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);

    function getColor(name) {
        for (var i = 0; i < files.length; i++) {
            if (lgaData[i][0][0] == name) {
                return nameToColor(lgaData[i][selected][5]);
            }
        }
    }

    function nameToColor(d) {
        return d >= max ? '#5a040f' :
            d > min + max / 2 - 1 ? '#67000d' :
            d > min + max / 3 - 1 ? '#a50f15' :
            d > min + max / 4 - 1 ? '#cb181d' :
            d > min + max / 5 - 1 ? '#ef3b2c' :
            d > min + max / 6 - 1 ? '#fb6a4a' :
            d > min + max / 7 - 1 ? '#fc9272' :
            d > min + max / 8 - 1 ? '#fcbba1' :
            d > min + max / 9 - 1 ? '#fee0d2' :
            d <= min  ? '#fff5f0' :
            '#ffffff';
    }


    function style(feature) {
        return {
            fillColor: getColor(feature.properties.ABBNAME),
            fillOpacity: 0.7,
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3'
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 4,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.8
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    }

    geojson = L.geoJson(lga, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

}