const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function(passTimes) {
  passTimes.map(pass => {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  });
};
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It did not  working", error);
  }
  printPassTimes(passTimes);
});