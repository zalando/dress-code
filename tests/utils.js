var require = patchRequire(require);
var phantomcss = require("phantomcss");

var config = {
  rootUrl: "http://127.0.0.1:PORT/",
  baseline: "./tests/screenshots/baseline/",
  results: "./tests/screenshots/results/",
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
    failedComparisonsRoot: false,
    addIteratorToImage: false,
    outputSettings: {
      errorColor: {
        red: 255,
        green: 255,
        blue: 0
      },
      errorType: "movement",
      transparency: 0.5
    }
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
  return [componentName, fileName + "__" + viewportName].join('');
}
