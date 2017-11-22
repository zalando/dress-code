// This is the path from the directory where CasperJS runs, tests/suites in this case, as specified in the script
var utils = require("../utils");
var globals = require("../globals");

var PORT = casper.cli.get("port");
var COMPONENTS = globals.COMPONENTS;

utils.initialize(PORT);

var viewports = ["desktop", "mobile"];

COMPONENTS.forEach(function(component) {
  runTests(component);
});

function runTests(component) {
  casper.test.begin(component.name, function(test) {
    casper.start();

    component.files.forEach(function(file) {
      viewports.forEach(function(viewport) {
        runTest(component.name, file, viewport);
      });
    });

    casper.then(utils.compareScreenshots);

    casper.run(function() {
      casper.test.done();
    });
  });

  function runTest(componentName, fileName, viewport) {
    casper
      .then(function() {
        utils.openPage(fileName, viewport);
      })
      .then(function() {
        utils.takeScreenshots(component.name, fileName, viewport);
      });
  }
}
