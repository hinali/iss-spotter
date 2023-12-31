const request = require('request');

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback("Error retrieving IP address: " + error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Failed to fetch IP address. Status Code: ${response.statusCode}`), null);
      return;
    }

    const myIP = JSON.parse(body).ip;
    callback(null, myIP);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) return callback("Error retrieving coordinates: " + error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Failed to fetch coordinates. Status Code: ${response.statusCode}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body).data;
    const coords = {
      lat: latitude,
      lon: longitude
    };
    callback(null, coords);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.lon}`, (error, response, body) => {
    if (error) return callback("Error retrieving flyover times: " + error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Failed to fetch flyover times. Status Code: ${response.statusCode}`), null);
      return;
    }

    const flyover = JSON.parse(body).response;
    callback(null, flyover);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, flyover) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, flyover);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
