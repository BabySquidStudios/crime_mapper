var map = L.map('map', {zoomControl: false}).setView([-34.92866, 138.59863], 10);

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

var lgaInfo = L.control({
    position: 'topleft'
});

lgaInfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'lgainfo');
    this.update();
    return this._div;
};

lgaInfo.update = function (props, rate) {
    this._div.innerHTML = '<p> <b>' + props + '</b> </p>' +
        '<p> Offences per 1000 people: <b>' + rate + '</b></p>';
};

lgaInfo.addTo(map);

var legend = L.control({
    position: 'bottomleft'
});

legend.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'legend');
    this.update();
    return this._div;
};

legend.update = function (props, min, max) {
    if (props != undefined) {
        this._div.innerHTML =
            '<p id="legend_title">  Rate per 1000 people </p>' +
            '<i style="background:' + color[0] + '"></i> ' + 0 + " - " + min.toPrecision(3) + '<br>' +
            '<i style="background:' + color[1] + '"></i> ' + min.toPrecision(3) + " - " + props[1].toPrecision(3) + '<br>' +
            '<i style="background:' + color[2] + '"></i> ' + props[1].toPrecision(3) + " - " + props[2].toPrecision(3) + '<br>' +
            '<i style="background:' + color[3] + '"></i> ' + props[2].toPrecision(3) + " - " + props[3].toPrecision(3) + '<br>' +
            '<i style="background:' + color[4] + '"></i> ' + props[3].toPrecision(3) + " - " + props[4].toPrecision(3) + '<br>' +
            '<i style="background:' + color[5] + '"></i> ' + props[4].toPrecision(3) + " - " + props[5].toPrecision(3) + '<br>' +
            '<i style="background:' + color[6] + '"></i> ' + " > " + Math.floor(max) + '<br>';
    }
};

legend.addTo(map);

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

var color = ['#fffbf0', '#f4d5c3', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#b20909'];



function addLGAs(data) {
    lgaData = data;
    values = [];

    for (var i = 0; i < files.length; i++) {
        values.push(lgaData[i][selected][5]);
    }

    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);

    var sorted = values.sort(function (a, b) {
        return a - b
    });

    sorted.splice(sorted.length - 1, 1)

    var sMax = Math.max.apply(null, sorted);

    console.log(sorted);

    var scale = chroma.scale(['#ffffd9', '#0c2c84']).domain([min + 0.001, sMax], 5);

    legend.update(scale.domain(), min, max)

    console.log(scale.domain());

    function getColor(name) {
        for (var i = 0; i < files.length; i++) {
            if (lgaData[i][0][0] == name) {
                return nameToColor(lgaData[i][selected][5]);
            }
        }
    }

    function getRate(name) {
        for (var i = 0; i < files.length; i++) {
            if (lgaData[i][0][0] == name) {
                return lgaData[i][selected][5];
            }
        }
    }

    function nameToColor(d) {
        return d >= max ? color[7] :
            d > scale.domain()[5] ? color[6] :
            d > scale.domain()[4] ? color[5] :
            d > scale.domain()[3] ? color[4] :
            d > scale.domain()[2] ? color[3] :
            d > scale.domain()[1] ? color[2] :
            d > scale.domain()[0] ? color[1] :
            color[0];
    }


    function style(feature) {
        return {
            fillColor: getColor(feature.properties.ABBNAME),
            fillOpacity: 0.8,
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3'
        };
    }

    function highlightFeature(e) {
        lgaInfo.update(e.target.feature.properties.ABBNAME,
            getRate(e.target.feature.properties.ABBNAME));

        var layer = e.target;

        layer.setStyle({
            weight: 4,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.9
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