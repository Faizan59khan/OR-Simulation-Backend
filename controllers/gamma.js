// Requiring the module
const reader = require("xlsx");

// Reading our test file
const file = reader.readFile("./File/queueAnalysis.xlsx");

const Dist = require("probability-distributions");
let data = [];

const sheets = file.SheetNames;

for (let i = 0; i < sheets.length; i++) {
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
  temp.forEach((res) => {
    data.push(res);
  });
}

// Calculate arrival rate (lambda) from arrival times and service times
function arrivalRate(arrivalTimes, serviceTimes) {
  const n = arrivalTimes.length;
  const totalTime = serviceTimes[n - 1] - arrivalTimes[0];
  return n / totalTime;
}

// Calculate service rate (mu) from arrival times and service times
function serviceRate(arrivalTimes, serviceTimes) {
  const n = arrivalTimes.length;
  const totalServiceTime = serviceTimes.reduce((a, b) => a + b);
  return n / totalServiceTime;
}

// Calculate mean service time (S) from arrival times and service times
function meanServiceTime(arrivalTimes, serviceTimes) {
  const n = arrivalTimes.length;
  const totalServiceTime = serviceTimes.reduce((a, b) => a + b);

  return totalServiceTime / n;
}

// Calculate performance measures for M/M/1 queue
function mm1(arrivalRate, serviceRate, meanServiceTime) {
  const L = (arrivalRate * meanServiceTime) / (serviceRate - arrivalRate);
  const W = meanServiceTime / (serviceRate - arrivalRate);
  const P0 = (serviceRate - arrivalRate) / serviceRate;
  const Lq =
    (arrivalRate ** 2 * meanServiceTime) /
    (serviceRate * (serviceRate - arrivalRate));
  const Wq = Lq / arrivalRate;
  const utilization = arrivalRate / serviceRate;

  return { L, W, P0, Lq, Wq, utilization };
}

// Calculate performance measures for M/M/s queue
function mms(arrivalRate, serviceRate, meanServiceTime, numServers) {
  const L =
    (arrivalRate * meanServiceTime) /
    (serviceRate * (numServers - arrivalRate));
  const W = meanServiceTime / (serviceRate - arrivalRate);
  const P0 = ((serviceRate - arrivalRate) / serviceRate) ** numServers;
  const Lq =
    ((numServers - 1) * arrivalRate ** 2 * meanServiceTime) /
    (serviceRate * (numServers - arrivalRate));
  const Wq = Lq / arrivalRate;
  const utilization = arrivalRate / (serviceRate * numServers);

  return { L, W, P0, Lq, Wq, utilization };
}

const gammaDistributions = async (req, res, next) => {
  const arrivalTimes = data.map((d) => d?.["Arrival Time(minute)"]);
  const serviceTimes = data.map((d) => d?.["Service Time(minute)"]);
  const arrRate = arrivalRate(arrivalTimes, serviceTimes);
  const serRate = serviceRate(arrivalTimes, serviceTimes);
  const meanSerTime = meanServiceTime(arrivalTimes, serviceTimes);
  console.log(arrRate, serRate, meanSerTime);
  let MMS, MM1;
  if (req?.query?.server > 1) {
    MMS = mms(arrRate, serRate, meanSerTime, req?.query?.server);
  } else {
    MM1 = mm1(arrRate, serRate, meanSerTime);
  }
  res.json({ MM1: { ...MM1 }, MMS: { ...MMS } });
};
exports.gammaDistributions = gammaDistributions;
