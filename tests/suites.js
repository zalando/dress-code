// This is the path from the directory where CasperJS runs, tests/suites in this case, as specified in the script
var utils = require("../utils");
var globals = require("../globals");

var executionStart = new Date().getTime();

var PORT = casper.cli.get("port");
var COMPONENTS = globals.COMPONENTS;

utils.initialize(PORT);

var viewports = ["desktop", "mobile"];

COMPONENTS.forEach(function(component) {
    runTests(component);
});

if (casper.cli.has("rebase")) {
    casper.test.begin("Rebase", function() {
        casper.start();

        casper
            .then(function() {
                casper.test.assert(true, "Rebase completed");
            })
            .run(function() {
                var end = new Date().getTime();
                console.log(
                    "\nRebase completed after " + (end - executionStart) + " ms"
                );

                casper.test.done();
            });
    });
} else {
    casper.test.begin("Compare screenshots", function() {
        casper.start();
        var start = new Date().getTime();

        casper.then(utils.compareScreenshots).run(function() {
            var end = new Date().getTime();
            console.log("\nComparison finished after " + (end - start) + " ms");

            console.log(
                "\nVisual regression tests completed after " +
                    (end - executionStart) +
                    " ms"
            );

            casper.test.done();
        });
    });
}

////////////////////////////////////////

function runTests(component) {
    casper.test.begin("Taking screenshots for " + component.name, function() {
        casper.start();
        var start = new Date().getTime();

        component.files.forEach(function(file) {
            viewports.forEach(function(viewport) {
                runTest(component.name, file, viewport);
            });
        });

        casper.run(function() {
            var end = new Date().getTime();
            console.log("\nFinished after " + (end - start) + " ms\n");

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
