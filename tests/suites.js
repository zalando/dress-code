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

casper.test.begin("Compare screenshots", function(test) {
  casper.start();
  var start = new Date().getTime();

  casper.then(utils.compareScreenshots);

  casper.run(function() {
    var end = new Date().getTime();
    console.log("Finished after " + (end - start) + " ms");

    casper.test.done();
  });
});

////////////////////////////////////////

function runTests(component) {
  casper.test.begin("Taking screenshots for " + component.name, function(test) {
    casper.start();
    var start = new Date().getTime();

    component.files.forEach(function(file) {
      viewports.forEach(function(viewport) {
        runTest(component.name, file, viewport);
      });
    });

    casper.run(function() {
      var end = new Date().getTime();
      console.log("Finished after " + (end - start) + " ms");
      
      casper.test.done();
    });
  });
}

function runTest(componentName, fileName, viewport) {
  casper
    .then(function() {
      utils.openPage(fileName, viewport);
    })
    .then(function() {
      utils.takeScreenshots(componentName, fileName, viewport);
    });
}
