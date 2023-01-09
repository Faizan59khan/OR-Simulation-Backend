const express = require("express");
const cors = require("cors");
const app = express();
const gammaRoutes = require("./routes/gamma");
const disRoutes = require("./routes/distributionFit");
const port = 5000;

// Requiring the module
const reader = require("xlsx");

app.use(cors());

// Reading our test file
const file = reader.readFile("./File/queueAnalysis.xlsx");

let data = [];

const sheets = file.SheetNames;

for (let i = 0; i < sheets.length; i++) {
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
  temp.forEach((res) => {
    data.push(res);
  });
}

// Printing data
console.log(data);

app.use("/", gammaRoutes);
app.use("/", disRoutes);

app.get("/", async (req, res, next) => {
  res.send(data);
});

app.listen(process.env.PORT || port);
