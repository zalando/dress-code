const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
let server;

const globals = require("./globals");
const MESSAGES = globals.MESSAGES;
const DEFAULT_PORT = globals.DEFAULT_PORT;
const TEMPLATE_DIRECTORIES = globals.TEMPLATE_DIRECTORIES;

const port = process.argv[2] || DEFAULT_PORT;
const useMinifiedVersion = process.argv[3] || false;

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

  if (templates && templates.length) {
    const cssDistPath = path.join(__dirname, `../dist/css`);
    const fontsPath = path.join(__dirname, `../dist/fonts`);

    const htmlHead = `<head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,500,300italic|Ubuntu+Mono" rel="stylesheet" type="text/css">
        <link rel="stylesheet" type="text/css" href="./dress-code${useMinifiedVersion ? ".min": ""}.css" />
        <style type="text/css">
          body { padding: 40px; }
        </style>
      </head>`;

    app.use(express.static(cssDistPath));
    app.use("/fonts", express.static(fontsPath));

    templates.forEach((templateName, index) => {
      app.get(`/${templateName}`, (request, response) => {
        fs.readFile(templatesPaths[index], "utf8", (error, data) => {
          response.write(htmlHead);
          if (data) {
            // Remove fabricator comments
            response.write(data.replace(/-{3}([\s\S]*)-{3}/, ""));
          }
          response.end();
        });
      });
    });

    server = app.listen(port, () => {
        console.log(`server serving test templates for screenshots is running at http://localhost:${port}`);
    });
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
