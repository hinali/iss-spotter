const { nextISSTimesForMyLocation } = require('./iss.js');

const printPassTimes = function(flyoverTimes) {
  for (const pass of flyoverTimes.response) {
    const formattedDateTime = new Date(0);
    formattedDateTime.setUTCSeconds(pass.risetime);
    const formattedDuration = pass.duration;

    console.log(`Next pass at ${formattedDateTime.toLocaleString()} for ${formattedDuration} seconds.`);
  }
};

nextISSTimesForMyLocation((error, flyoverTimes) => {
  if (error) {
    console.log("An error occurred:", error);
    return;
  }

  printPassTimes(flyoverTimes);
});
