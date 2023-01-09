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

const distributions = async (req, res, next) => {
  try {
    const arrivalTimes = data.map((d) => d?.["Arrival Time(minute)"]);
    const serviceTimes = data.map((d) => d?.["Service Time(minute)"]);

    // const chiSqTestAT = Dist.rchisq(...arrivalTimes);
    // const chiSqTestST = Dist.rchisq(...serviceTimes);

    const gammaAT = Dist.rgamma(...arrivalTimes);
    const gammaST = Dist.rgamma(...serviceTimes);
    res.json({
      gammaAT,
      gammaST,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.distributions = distributions;
