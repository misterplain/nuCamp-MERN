const express = require("express");

const morgan = require("morgan");

const hostName = "localhost";
const port = 3000;

const app = express();
app.use(morgan("dev"));

app.use(express.statis(__dirname + "/public"));

app.use((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is an express server</h1></body></html>");
});

app.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}`);
});
