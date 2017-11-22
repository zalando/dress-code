const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
let server;

const PORT = process.argv[2];

const start = () => {
  const templatesDirectory = path.join(
    __dirname,
    "../docs/demo/materials/03-atoms"
  );

  let templates = [];
  let templatesPaths = [];

  walkDirectory(templatesDirectory, (templateName, templatePath) => {
    templates.push(templateName);
    templatesPaths.push(templatePath);
  });

  const cssDistPath = path.join(__dirname, "../dist");
  const cssDistFileName = "dress-code.min.css";

  const styles = `<head>
        <link rel="stylesheet" type="text/css" href="css/${cssDistFileName}" />
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

const sendMessageToParent = message => {
  if (process.send) {
    process.send(message);
  }
};

process.on("message", message => {
  if (message === "START") {
    start();
    sendMessageToParent("RUNNING");
  } else if (message === "SHUTDOWN") {
    shutdown();
    sendMessageToParent("CLOSED");
  }
});

sendMessageToParent("READY");
