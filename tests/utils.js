var require = patchRequire(require);
var phantomcss = require("phantomcss");

var config = {
    rootUrl: "http://127.0.0.1:PORT/",
    baseline: "./tests/screenshots/baseline",
    results: "./tests/screenshots/results",
    failures: "./tests/screenshots/failures",
    viewports: {
        desktop: { width: 1280, height: 800 },
        mobile: { width: 320, height: 568 }
    }
};

exports.initialize = function(port) {
    config.rootUrl = config.rootUrl.replace("PORT", port);

    phantomcss.init({
        captureWaitEnabled: false,
        rebase: casper.cli.get("rebase"),
        screenshotRoot: config.baseline,
        comparisonResultRoot: config.results,
        failedComparisonsRoot: config.failures,
        addIteratorToImage: false,
        outputSettings: {
            errorColor: {
                red: 255,
                green: 255,
                blue: 0
            },
            errorType: "movement",
            transparency: 0.5
        },
        onPass: onTestPass,
        onFail: onTestFail,
        onComplete: onTestsComplete,
        onNewImage: onNewScreenshot
    });
};

function setViewport(viewportName) {
    var viewport = config.viewports[viewportName];
    casper.viewport(viewport.width, viewport.height);
}

function onTestPass(test) {
    var name = "Screenshot is identical: " + test.filename;
    casper.test.pass(name, { name: name });
}

function onTestFail(test) {
    var name = "Mismatch found on: " + test.filename;
    casper.test.fail(name, {
        name: name,
        message: "Mismatch (" + test.mismatch + "%) found on: " + test.filename
    });
}

function onTestsComplete(allTests, numFailures, numErrors) {
    if (tests.length === 0) {
        console.log(
            "\nSince no previous screenshots could be found, the generated screenshots have been stored in " +
                config.baseline +
                "\nThis is the original baseline which following tests results will be compared to."
        );
    } else {
        if (numFailures === 0) {
            console.log("\nAll the tests passed successfully!");
        } else {
            console.log("\n" + numFailures + " tests failed");

            if (config.failures) {
                console.log(
                    "\nSome images which show the difference with the original baseline have been stored in " +
                        config.failures +
                        "\nYellow colored pixels indicate a difference between the current and the previous screenshots."
                );
            }
        }

        if (numErrors !== 0) {
            console.log(
                "\n" +
                    numErrors +
                    "errors occurred. Is it possible that a baseline image was deleted but not the diff?"
            );
        }
    }
}

function onNewScreenshot(test) {
    casper.test.info("New screenshot stored at " + test.filename);
}

exports.openPage = function(path, viewportName) {
    var url = config.rootUrl + path + ".html";
    setViewport(viewportName);

    casper.open(url);
};

exports.compareScreenshots = function() {
    phantomcss.compareAll();
};

/**
 * Takes screenshots of the specified component and its modifiers (in case it has)
 * in a given viewport size
 */
exports.takeScreenshots = function(componentName, fileName, viewportName) {
    phantomcss.screenshot(
        {
            top: 0,
            left: 0,
            width: config.viewports[viewportName].width,
            height: config.viewports[viewportName].height
        },
        getFileNameForComponent(componentName, fileName, viewportName)
    );
};

function getFileNameForComponent(componentName, fileName, viewportName) {
    return [componentName, fileName + "__" + viewportName].join("/");
}
