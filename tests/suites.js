// This is the path from the directory where CasperJS runs, tests/suites in this case, as specified in the script
var utils = require("../utils");

var PORT = casper.cli.get("port");

utils.initialize(PORT);

var components = [
  {
    name: "buttons",
    files: ["01-button", "02-sizes", "03-options", "04-button--block"]
  },
  { name: "tab", files: ["tab"] },
  {
    name: "forms",
    files: [
      "01-checkbox",
      "02-checkbox--switch",
      "radio-button",
      "select",
      "text-input",
      "textarea"
    ]
  }
];

var viewports = ["desktop", "mobile"];

components.forEach(function(component) {
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
