function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
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

var northboundUrl = 'https://api.bart.gov/api/etd.aspx?cmd=etd&orig=12th&key=MW9S-E7SL-26DU-VV8V&dir=n&json=y'
var southboundUrl = 'https://api.bart.gov/api/etd.aspx?cmd=etd&orig=12th&key=MW9S-E7SL-26DU-VV8V&dir=s&json=y'
var xhrNorth = createCORSRequest('GET', northboundUrl);
var xhrSouth = createCORSRequest('GET', southboundUrl);

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

xhrSouth.send().then(handleResponse).catch(console.error);;
