const request = require('request');

const fetchMyIP = function(callback) {
  const ipifyUrl = 'https://api.ipify.org?format=json';
  request(ipifyUrl, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `${response.statusCode} was encountered when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ipAddress = JSON.parse(body).ip;
    callback(null, ipAddress);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const geoLocationUrl = `https://freegeoip.app/json/${ip}`;
  request(geoLocationUrl, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `${response.statusCode} was encountered when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const parsedBody = JSON.parse(body);
    const latLong = { lat: parsedBody.latitude, long: parsedBody.longitude };
    callback(null, latLong);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const flyoverUrl = `http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.long}`;
  request(flyoverUrl, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `${response.statusCode} was encountered when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, JSON.parse(body));
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    fetchCoordsByIP(ip, (error, latLong) => {
      if (error) {
        callback(error, null);
        return;
      }
      fetchISSFlyOverTimes(latLong, (error, flyoverTimes) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, flyoverTimes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
