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

function calculateRates(arrivalTimes, serviceTimes) {
  // Calculate average arrival time
  const averageArrivalTime =
    arrivalTimes.reduce((a, b) => a + b) / arrivalTimes.length;

  // Calculate average service time
  const averageServiceTime =
    serviceTimes.reduce((a, b) => a + b) / serviceTimes.length;

  // Calculate arrival rate (lambda)
  const lambda = 1 / averageArrivalTime;

  // Calculate service rate (mu)
  const mu = 1 / averageServiceTime;

  // Return rates as an object
  return {
    lambda: lambda,
    mu: mu,
  };
}

function calculatePerformanceMeasures(
  arrivalRate,
  serviceRate,
  numServers = 1
) {
  console.log(numServers);
  // Calculate system length (L)
  const L = arrivalRate / (serviceRate - arrivalRate);

  // Calculate system time (W)
  const W = 1 / (serviceRate - arrivalRate);

  // Calculate system idle probability (P0)
  const P0 = 1 - arrivalRate / serviceRate;

  // Calculate system full probability (Pn)
  const Pn =
    (arrivalRate / serviceRate) ** numServers /
    (factorial(numServers) * (1 - arrivalRate / serviceRate));

  // Return performance measures as an object
  return {
    avgNoOfCus: L,
    avgWTCusSpends: W,
    idleSystemProb: P0,
    sysIsFullProb: Pn,
  };
}

// Helper function to calculate factorial of a number
function factorial(n) {
  if (n == 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

const uniformDistributions = async (req, res, next) => {
  const arrivalTimes = data.map((d) => d?.["Arrival Time(minute)"]);
  const serviceTimes = data.map((d) => d?.["Service Time(minute)"]);
  const { lambda, mu } = calculateRates(arrivalTimes, serviceTimes);
  const { avgNoOfCus, avgWTCusSpends, idleSystemProb, sysIsFullProb } =
    calculatePerformanceMeasures(lambda, mu, req?.query?.server);
  res.json({ avgNoOfCus, avgWTCusSpends, idleSystemProb, sysIsFullProb });
};
exports.uniformDistributions = uniformDistributions;
