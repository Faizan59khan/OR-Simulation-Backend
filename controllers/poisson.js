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

function mm1ATnSTRate(arrivalTimes, serviceTimes) {
  const lambda = 1 / arrivalTimes;
  const mu = 1 / serviceTimes;

  // Return the arrival and service rates as an object
  return { lambda, mu };
}

function mm1Measures(lambda, mu) {
  // Calculate average number of customers in the system (L)
  const L = lambda / (mu - lambda);

  // Calculate average number of customers in the queue (Lq)
  const Lq = (lambda * lambda) / (mu * (mu - lambda));

  // Calculate average waiting time in the queue (Wq)
  const Wq = Lq / lambda;

  // Calculate average time in the system (W)
  const W = Wq + 1 / mu;

  // Return the performance measures as an object
  return { L, Lq, Wq, W };
}
// Helper function to calculate factorial of a number
function factorial(n) {
  if (n == 0) {
    return 1;
  }
  return n * factorial(n - 1);
}
function mmcRates(arrivalTimes, serviceTimes, serverCount) {
  const lambda = 1 / arrivalTimes;
  const mu = 1 / serviceTimes;
  const CP = lambda / mu;
  const rho = lambda / (serverCount * mu);
  let rhoNot = 0;
  for (let i = 0; i <= serverCount; i++) {
    if (i === serverCount) {
      rhoNot += Math.pow(CP, i) / (factorial(i) * (1 - rho));
    } else {
      rhoNot += Math.pow(CP, i) / factorial(i);
    }
  }
  rhoNot = 1 / rhoNot;

  // Return the arrival and service rates as an object
  return { lambda, mu, rho, rhoNot };
}
function mmcMeasures(lambda, mu, rho1, rhoNot, serverCount) {
  let lqNominator = rhoNot * (lambda / mu) * (lambda / mu) * rho1;
  let lqDenominator = factorial(serverCount) * Math.pow(1 - rho1, 2);
  const Lq = lqNominator / lqDenominator;
  const Wq = Lq / lambda;
  const W = lambda + 1 / mu;
  const L = lambda * W;

  // Return the performance measures as an object
  return { L, Lq, Wq, W };
}

function mg1LamMuVar(arrivalTimes, max, min) {
  const lambda = 1 / arrivalTimes;
  const muLownUpp = (min + max) / 2;
  const mu = 1 / muLownUpp;
  const variance = ((max - min) * (max - min)) / 12;
  const rho = lambda / mu;

  return { lambda, mu, variance, rho };
}
function mg1Measures(lambda, mu, variance, rho) {
  const Lq =
    (Math.pow(lambda, 2) * Math.pow(variance, 2) + Math.pow(rho, 2)) /
    (2 * (1 - rho));

  const Wq = Lq / lambda;
  const W = Wq + 1 / mu;
  const L = lambda * W;
  const idleServer = 1 - rho;

  // Return the performance measures as an object
  return { L, Lq, Wq, W, idleServer };
}

function mgcExtras(arrivalTimes, max, min, serverCount) {
  const lambda = 1 / arrivalTimes;
  const muLownUpp = (min + max) / 2;
  const mu = 1 / muLownUpp;
  const varianceSt = ((max - min) * (max - min)) / 12;
  const varianceAt = 1 / Math.pow(lambda, 2);
  const CA = varianceAt / varianceAt;
  const CS = varianceSt / ((1 / mu) * (1 / mu));
  const CP = lambda / mu;
  const rho = lambda / (serverCount * mu);
  let rhoNot = 0;
  for (let i = 0; i <= serverCount; i++) {
    if (i === serverCount) {
      rhoNot += Math.pow(CP, i) / (factorial(i) * (1 - rho));
    } else {
      rhoNot += Math.pow(CP, i) / factorial(i);
    }
  }
  rhoNot = 1 / rhoNot;

  // Return the arrival and service rates as an object
  return { lambda, mu, rho, rhoNot, CA, CS };
}
function mgcMeasures(lambda, mu, rho1, rhoNot, CA, CS, serverCount) {
  console.log(lambda, mu, rho1, rhoNot, CA, CS);
  let lqNominator = rhoNot * (lambda / mu) * (lambda / mu) * rho1;
  let lqDenominator = factorial(serverCount) * Math.pow(1 - rho1, 2);
  console.log(lqNominator, lqDenominator);
  const Lq = lqNominator / lqDenominator;
  const Wq = Lq / lambda;
  const WqGGC = (Wq * (CA + CS)) / 2;
  const LqGGC = WqGGC * lambda;
  const WGGC = WqGGC + 1 / mu;
  const W = lambda + 1 / mu;
  const L = lambda * W;

  // Return the performance measures as an object
  return { L, Lq, Wq, WGGC, WqGGC, LqGGC, W };
}

function gg1Extras(lambda, mu, variance, rho) {
  const Lq =
    (Math.pow(lambda, 2) * Math.pow(variance, 2) + Math.pow(rho, 2)) /
    (2 * (1 - rho));

  const Wq = Lq / lambda;
  const W = Wq + 1 / mu;
  const L = lambda * W;
  const idleServer = 1 - rho;

  // Return the performance measures as an object
  return { L, Lq, Wq, W, idleServer };
}

function gg1Measure(lambda, mu, rho, CA, CS) {
  let lqNominator = Math.pow(rho, 2) * (1 + CS) * (CA + Math.pow(rho, 2) * CS);
  let lqDenominator = 2 * (1 - rho) * (1 + Math.pow(rho, 2) * CS);
  const Lq = lqNominator / lqDenominator;
  const Wq = Lq / lambda;
  const W = Wq + 1 / mu;
  const L = lambda * W;
  const idleServer = 1 - rho;

  // Return the performance measures as an object
  return { L, Lq, Wq, W, idleServer };
}

function ggCExtras(arrivalTimes, serviceTimes) {
  // Calculate the total number of customers arriving in the given time period
  const totalArrivals = arrivalTimes.length;

  // Calculate the total interarrival time for all customers
  const totalInterarrivalTime = arrivalTimes.reduce(
    (sum, t, i) => sum + (i > 0 ? t - arrivalTimes[i - 1] : 0),
    0
  );

  // Calculate the total service time for all customers
  const totalServiceTime = serviceTimes.reduce((sum, t) => sum + t, 0);

  // Calculate the length of the time period
  const timePeriod = arrivalTimes[arrivalTimes.length - 1] - arrivalTimes[0];

  // Calculate arrival rate (lambda)
  const lambda = totalArrivals / timePeriod;

  // Calculate mean of the interarrival time distribution (meanArrival)
  const meanArrival = totalInterarrivalTime / totalArrivals;

  // Calculate variance of the interarrival time distribution (varianceArrival)
  const varianceArrival =
    arrivalTimes.reduce(
      (sum, t, i) =>
        sum + (i > 0 ? (t - arrivalTimes[i - 1] - meanArrival) ** 2 : 0),
      0
    ) / totalArrivals;

  // Calculate mean of the service time distribution (meanService)
  const meanService = totalServiceTime / totalArrivals;

  // Calculate variance of the service time distribution (varianceService)
  const varianceService =
    serviceTimes.reduce((sum, t) => sum + (t - meanService) ** 2, 0) /
    serviceTimes.length;

  // Return lambda, meanArrival, varianceArrival, meanService, and varianceService as an object
  return { lambda, meanArrival, varianceArrival, meanService, varianceService };
}

function ggcMeasures(
  lambda,
  meanArrival,
  varianceArrival,
  meanService,
  varianceService,
  serverCount
) {
  // Calculate average number of customers in the system (L)
  const L = (lambda * meanService) / (serverCount - lambda * meanService);

  // Calculate average number of customers in the queue (Lq)
  const Lq =
    (lambda * lambda * varianceService) /
    (2 *
      serverCount *
      meanService *
      (meanService - lambda * (serverCount - 1)));

  // Calculate average waiting time in the queue (Wq)
  const Wq = Lq / lambda;

  // Calculate average time in the system (W)
  const W = Wq + meanService;

  // Return the performance measures as an object
  return { L, Lq, Wq, W };
}

const poissonDistributions = async (req, res, next) => {
  // const arrivalTimes = data.map((d) => d?.["Arrival Time(minute)"]);
  // const serviceTimes = data.map((d) => d?.["Service Time(minute)"]);
  console.log(typeof Number(req?.query?.server), typeof Number(req?.query?.at));
  const arrivalTimes = Number(req?.query?.at);
  const serviceTimes = Number(req?.query?.st);

  // arrivalTimes.sort((a, b) => a - b);
  // serviceTimes.sort((a, b) => a - b);
  const { lambda, mu } = mm1ATnSTRate(arrivalTimes, serviceTimes);
  const {
    lambda: l6,
    mu: m6,
    rho: rho2,
    rhoNot: rhoNot1,
  } = mmcRates(arrivalTimes, serviceTimes, Number(req?.query?.server));
  const {
    lambda: l3,
    mu: m3,
    variance,
    rho,
  } = mg1LamMuVar(
    arrivalTimes,
    Number(req?.query?.maxST),
    Number(req?.query?.minST)
  );
  const {
    lambda: l2,
    mu: m2,
    rho: rho1,
    rhoNot,
    CA,
    CS,
  } = mgcExtras(
    arrivalTimes,
    Number(req?.query?.maxST),
    Number(req?.query?.minST),
    Number(req?.query?.server)
  );
  // const {
  //   lambda: l5,
  //   meanArrival,
  //   varianceArrival,
  //   meanService,
  //   varianceService,
  // } = gg1Extras(arrivalTimes, serviceTimes);
  // const {
  //   lambda: l6,
  //   meanArrival: mA2,
  //   varianceArrival: vA2,
  //   meanService: mS2,
  //   varianceService: vS2,
  // } = ggCExtras(arrivalTimes, serviceTimes);
  const MM1 = mm1Measures(lambda, mu);
  const MMC = mmcMeasures(
    lambda,
    mu,
    rho2,
    rhoNot1,
    Number(req?.query?.server)
  );
  const MG1 = mg1Measures(l3, m3, variance, rho);
  const MGC = mgcMeasures(
    l2,
    m2,
    rho1,
    rhoNot,
    CA,
    CS,
    Number(req?.query?.server)
  );
  const GG1 = gg1Measure(l3, m3, rho, CA, CS);
  // const GGC = ggcMeasures(l6, mA2, vA2, mS2, vS2, Number(req?.query?.server));
  res.json({
    MM1: { ...MM1 },
    MMC: { ...MMC },
    MG1: { ...MG1 },
    MGC: { ...MGC },
    GG1: { ...GG1 },
    GGC: { ...MGC },
  });
};
exports.poissonDistributions = poissonDistributions;
