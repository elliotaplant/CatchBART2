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
    xhr = null;

  }

  xhr.onload = function() {
   var responseText = xhr.responseText;
   const response = JSON.parse(responseText);
   // process the response.
   console.log('response',response);
   response.root.station[0].etd.forEach(destination => {
     const myDiv = document.createElement('div');
     myDiv.textContent = destination.destination + ' ' + destination.estimate.map(estimate => estimate.minutes).join(', ');
     myDiv.style['background-color'] = destination.estimate[0].color.toLowerCase();
     document.body.append(myDiv);
   });
  };

  xhr.onerror = function() {
    console.log('There was an error!');
  };

  return xhr;
}

var northboundUrl = 'https://api.bart.gov/api/etd.aspx?cmd=etd&orig=12th&key=MW9S-E7SL-26DU-VV8V&dir=n&json=y'
var southboundUrl = 'https://api.bart.gov/api/etd.aspx?cmd=etd&orig=12th&key=MW9S-E7SL-26DU-VV8V&dir=s&json=y'
var xhrNorth = createCORSRequest('GET', northboundUrl);
var xhrSouth = createCORSRequest('GET', southboundUrl);

xhrNorth.send();
xhrSouth.send();
