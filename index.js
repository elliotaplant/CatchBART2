function createCORSRequest(method, url) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);

  if ("withCredentials" in xhr) {
    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // Otherwise, CORS is not supported by the browser.
    throw new Error('Your browser does not support CORS. Try using Chrome, Safari, or Firefox');
  }

  xhr.onload = xhr.onerror = function() {
    console.log('There was an error!');
  };

  return {
    send: () => {
      return new Promise((resolve, reject) => {
        xhr.onload = () => {
          resolve(JSON.parse(xhr.responseText));
        };

        xhr.onerror = () => {
          reject(xhr);
        };

        xhr.send();
      });
    }
  };
}

const northboundUrl = 'https://api.bart.gov/api/etd.aspx?cmd=etd&orig=12th&key=MW9S-E7SL-26DU-VV8V&dir=n&json=y'
const southboundUrl = 'https://api.bart.gov/api/etd.aspx?cmd=etd&orig=12th&key=MW9S-E7SL-26DU-VV8V&dir=s&json=y'
const xhrNorth = createCORSRequest('GET', northboundUrl);
const xhrSouth = createCORSRequest('GET', southboundUrl);

function handleResponse(responseJson) {
  const station = responseJson.root.station[0];
  document.getElementById('station-name').textContent = station.name;
  station.etd.forEach(destination => {
    const myDiv = document.createElement('div');
    myDiv.textContent = destination.destination + ' ' + destination.estimate.map(estimate => estimate.minutes).join(', ');
    myDiv.style['background-color'] = destination.estimate[0].color.toLowerCase();
    document.body.append(myDiv);
  });
};

xhrNorth.send().then(handleResponse).catch(console.error);

xhrSouth.send().then(handleResponse).catch(console.error);

navigator.geolocation.getCurrentPosition(function(position) {
  console.log('got position')
  console.log(position.coords.latitude, position.coords.longitude);
  const userLocation = [position.coords.latitude, position.coords.longitude];
  const {closestStation, absoluteDistance} = findClosest(userLocation);
  console.log('closestStation', closestStation);
  console.log('absoluteDistance', absoluteDistance);
});

function findClosest(userLocation) {
  let absoluteDistance = Infinity;
  let closestStation = null;
  for (station in stationCoords) {
    const stationDist = getDistBetween(userLocation, stationCoords[station]);
    if (stationDist < absoluteDistance) {
      absoluteDistance = stationDist;
      closestStation = station;
    }
  }
  return {closestStation, absoluteDistance};
}

function getDistBetween(coord1, coord2) {
  const R = 3959; // miles
  const φ1 = coord1[0].toRadians();
  const φ2 = coord2[0].toRadians();
  const Δφ = (coord2[0] - coord1[0]).toRadians();
  const Δλ = (coord2[1] - coord1[1]).toRadians();

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const stationCoords = {
  '12TH': [
    37.803768, -122.271450
  ],
  '16TH': [
    37.765062, -122.419694
  ],
  '19TH': [
    37.808350, -122.268602
  ],
  '24TH': [
    37.752470, -122.418143
  ],
  'ASHB': [
    37.852803, -122.270062
  ],
  'BALB': [
    37.721585, -122.447506
  ],
  'BAYF': [
    37.696924, -122.126514
  ],
  'CAST': [
    37.690746, -122.075602
  ],
  'CIVC': [
    37.779732, -122.414123
  ],
  'COLS': [
    37.753661, -122.196869
  ],
  'COLM': [
    37.684638, -122.466233
  ],
  'CONC': [
    37.973737, -122.029095
  ],
  'DALY': [
    37.706121, -122.469081
  ],
  'DBRK': [
    37.870104, -122.268133
  ],
  'DELN': [
    37.925086, -122.316794
  ],
  'DUBL': [
    37.701687, -121.899179
  ],
  'EMBR': [
    37.792874, -122.397020
  ],
  'FRMT': [
    37.557465, -121.976608
  ],
  'FTVL': [
    37.774836, -122.224175
  ],
  'GLEN': [
    37.733064, -122.433817
  ],
  'HAYW': [
    37.669723, -122.087018
  ],
  'LAFY': [
    37.893176, -122.124630
  ],
  'LAKE': [
    37.797027, -122.265180
  ],
  'MCAR': [
    37.829065, -122.267040
  ],
  'MLBR': [
    37.600271, -122.386702
  ],
  'MONT': [
    37.789405, -122.401066
  ],
  'NBRK': [
    37.873967, -122.283440
  ],
  'NCON': [
    38.003193, -122.024653
  ],
  'OAKL': [
    37.713238, -122.212191
  ],
  'ORIN': [
    37.878361, -122.183791
  ],
  'PHIL': [
    37.928468, -122.056012
  ],
  'PITT': [
    38.018914, -121.945154
  ],
  'PLZA': [
    37.902632, -122.298904
  ],
  'POWL': [
    37.784471, -122.407974
  ],
  'RICH': [
    37.936853, -122.353099
  ],
  'ROCK': [
    37.844702, -122.251371
  ],
  'SANL': [
    37.721947, -122.160844
  ],
  'SBRN': [
    37.637761, -122.416287
  ],
  'SFIA': [
    37.615966, -122.392409
  ],
  'SHAY': [
    37.634375, -122.057189
  ],
  'SSAN': [
    37.664245, -122.443960
  ],
  'UCTY': [
    37.590630, -122.017388
  ],
  'WARM': [
    37.502171, -121.939313
  ],
  'WCRK': [
    37.905522, -122.067527
  ],
  'WDUB': [
    37.699756, -121.928240
  ],
  'WOAK': [37.804872, -122.295140]
}

// Math
/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRadians) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }
}
