const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
let server;

const globals = require("./globals");
const MESSAGES = globals.MESSAGES;
const TEMPLATE_DIRECTORIES = globals.TEMPLATE_DIRECTORIES;

const PORT = process.argv[2];
const ARTIFACT_NAME = process.argv[3];
const ARTIFACT_LOCATION = process.argv[4];

const start = () => {
  const directoriesPaths = getTemplateDirectoriesPaths(TEMPLATE_DIRECTORIES);

  let templates = [],
    templatesPaths = [];

  directoriesPaths.forEach(directoryPath =>
    walkDirectory(directoryPath, (templateName, templatePath) => {
      templates.push(templateName);
      templatesPaths.push(templatePath);
    })
  );

  const cssDistPath = path.join(__dirname, `../${ARTIFACT_LOCATION}`);

  const styles = `<head>
        <link rel="stylesheet" type="text/css" href="./${ARTIFACT_NAME}" />
        <style type="text/css">
            body { padding: 40px; }
        </style>
    </head>`;

  if (templates && templates.length) {
    app.use(express.static(cssDistPath));

    templates.forEach((templateName, index) => {
      app.get(`/${templateName}`, (request, response) => {
        fs.readFile(templatesPaths[index], "utf8", (error, data) => {
          response.write(styles);
          if (data) {
            // Remove fabricator comments
            response.write(data.replace(/-{3}([\s\S]*)-{3}/, ""));
          }
          response.end();
        });
      });
    });

    server = app.listen(PORT);
  }
};

const shutdown = () => {
  if (server) {
    server.close();
  }
};

const walkDirectory = (currentDirectoryPath, callback) => {
  let filePath, stat;

  fs.readdirSync(currentDirectoryPath).forEach(fileName => {
    filePath = path.join(currentDirectoryPath, fileName);
    stat = fs.statSync(filePath);

    if (stat.isFile()) {
      callback(fileName, filePath);
    } else if (stat.isDirectory()) {
      walkDirectory(filePath, callback);
    }
  });
};

const getTemplateDirectoriesPaths = directories => {
  let paths = [];

  if (directories && directories.length) {
    directories.forEach(directory =>
      paths.push(path.join(__dirname, `../docs/demo/materials/${directory}`))
    );
  }

  return paths;
};

const sendMessageToParent = message => {
  if (process.send) {
    process.send(message);
  }
};

process.on("message", message => {
  if (message === MESSAGES.START) {
    start();
    sendMessageToParent(MESSAGES.RUNNING);
  } else if (message === MESSAGES.SHUTDOWN) {
    shutdown();
    sendMessageToParent(MESSAGES.CLOSED);
  } else if (message === MESSAGES.ERROR) {
    shutdown();
    sendMessageToParent(MESSAGES.ABORTED);
  }
});

sendMessageToParent(MESSAGES.READY);
