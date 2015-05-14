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

//[LGA][OFFENCE TYPE][YEAR]

var lgaData = [];
var count = 0;
var geojson;


for (var i = 0; i < files.length; i++) {
    Papa.parse(files[i], {
        download: true,
        complete: function (results) {
            lgaData.push(results.data);
            count++;
            if (count == files.length) {
                console.log(lgaData);
                addLGAs(lgaData);
            }
        }
    });
}

function addLGAs(data) {
    lgaData = data;

    function getColor(name) {
        for (var i = 0; i < files.length; i++) {
            if (lgaData[i][0][0] == name) {
                return nameToColor(lgaData[i][1][5]);
            }
        }
    }

    function nameToColor(d) {
        return d > 60 ? '#990000' :
            d > 20 ? '#d7301f' :
            d > 13 ? '#ef6548' :
            d > 10 ? '#fc8d59' :
            d > 7 ? '#fdbb84' :
            d > 5 ? '#fdd49e' :
            d > 3 ? '#fee8c8' :
            '#fff7ec';
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


