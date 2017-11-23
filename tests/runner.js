const fs = require("fs");
const path = require("path");
const { fork, exec } = require("child_process");

const globals = require("./globals");
const MESSAGES = globals.MESSAGES;
const DEFAULT_PORT = globals.DEFAULT_PORT;

let useMinifiedVersion = false,
  rebase = false;

switch (process.argv[2]) {
  case "--unminified":
    useMinifiedVersion = false;
    break;
  case "--minified":
    useMinifiedVersion = true;
    break;
  case "--rebase":
    useMinifiedVersion = false;
    rebase = true;
    break;
  default:
    useMinifiedVersion = false;
}

const PORT = process.argv[3] || DEFAULT_PORT;

const server = path.join(__dirname, "server.js");
const parameters = [PORT, useMinifiedVersion];
const options = {
  stdio: ["pipe", "pipe", "pipe", "ipc"]
};

let serverChild = fork(server, parameters, options);

serverChild.on("message", message => {
  if (message === MESSAGES.READY) {
    serverChild.send(MESSAGES.START);
  } else if (message === MESSAGES.RUNNING) {
    runTests();
  } else if (message === MESSAGES.CLOSED) {
    console.log("Tests are finished");
    process.exit();
  } else if (message === MESSAGES.ABORTED) {
    console.log("Tests could not be finished. An error occured");
    process.exit();
  }
});

serverChild.on("error", error => {
  serverChild.send(MESSAGES.ERROR);
});

const runTests = () => {
  let testsChild = exec(
    `casperjs test tests/suites.js --port=${PORT} ${rebase ? "--rebase" : ""}`,
    (err, stdout, stderr) => {
      console.log(stdout);
    }
  );

  testsChild.on("close", code => {
    serverChild.send(MESSAGES.SHUTDOWN);
  });

  testsChild.on("error", error => {
    serverChild.send(MESSAGES.ERROR);
  });
};
