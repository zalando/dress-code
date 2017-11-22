const fs = require("fs");
const path = require("path");
const { fork, exec } = require("child_process");

const globals = require("./globals");
const MODES = globals.MODES;
const MESSAGES = globals.MESSAGES;

let mode,
  rebase = false;

switch (process.argv[2]) {
  case "--demo":
    mode = MODES.DEMO;
    break;
  case "--release":
    mode = MODES.RELEASE;
    break;
  case "--rebase":
    mode = MODES.RELEASE;
    rebase = true;
    break;
  default:
    mode = MODES.DEMO;
}

const PORT = process.argv[3] || 3100;

const server = path.join(__dirname, "server.js");
const parameters = [PORT, mode.ARTIFACT_NAME, mode.ARTIFACT_LOCATION];
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
