var require = patchRequire(require);
var phantomcss = require("phantomcss");
var fs = require("fs");
var http = require("http");

var config = {
  rootUrl: "http://127.0.0.1:PORT/",
  baseline: "./tests/screenshots/baseline/",
  results: "./tests/screenshots/results/",
  failures: "./tests/screenshots/failures/",
  viewports: {
    desktop: { width: 1280, height: 1024 },
    mobile: { width: 320, height: 568 }
  }
};

exports.initialize = function(port) {
  config.rootUrl = config.rootUrl.replace("PORT", port);

  phantomcss.init({
    rebase: casper.cli.get("rebase"),
    screenshotRoot: config.baseline,
    comparisonResultRoot: config.results,
    failedComparisonsRoot: config.failures,
    failures: false,
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
    rebase: casper.cli.get("rebase")
  });
};

function setViewport(viewportName) {
  var viewport = config.viewports[viewportName];
  casper.viewport(viewport.width, viewport.height);
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
exports.takeScreenshots = function(componentName, fileName, viewport) {
  phantomcss.screenshot(
    {
      top: 0,
      left: 0,
      width: 640,
      height: 480
    },
    getFileNameForComponent(componentName, fileName, viewport)
  );
};

function getFileNameForComponent(componentName, fileName, viewport) {
  return componentName + "/" + fileName + "__" + viewport;
}
