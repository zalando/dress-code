const fs = require("fs");
const path = require("path");
const { fork, exec } = require("child_process");

const PORT = 3711;

const server = path.join(__dirname, "server.js");
const parameters = [PORT];
const options = {
  stdio: ["pipe", "pipe", "pipe", "ipc"]
};

let serverChild = fork(server, parameters, options);

serverChild.on("message", message => {
  if (message === "READY") {
    serverChild.send("START");
  } else if (message === "RUNNING") {
    runTests();
  } else if (message === "CLOSED") {
    console.log("Tests are finished");
    process.exit();
  }
});

const runTests = () => {
  let testsChild = exec(
    `casperjs test tests/suites.js --port=${PORT}`,
    (err, stdout, stderr) => {
      console.log(stdout);
    }
  );

  testsChild.on("close", code => {
    serverChild.send("SHUTDOWN");
  });
};
