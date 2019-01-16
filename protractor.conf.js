const browserstack = require('browserstack-local');

exports.config = {
  specs: ['spec/**/*.spec.js'],

  jasmineNodeOpts: {
    print() {},
  },

  multiCapabilities: [
    // {
    //   browserName: 'chrome',
    //   chromeOptions: {
    //     args: ['--headless', '--disable-gpu', '--window-size=800,600'],
    //   },
    // },
    // {
    //   browserName: 'safari',
    // },
    {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['--headless', '--width=800', '--height=600'],
      },
    },
    // {
    //   browserName: 'ie',
    // },
  ],

  onPrepare() {
    var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().clearReporters();
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: false,
          displaySuccessesSummary: false, // display summary of all successes after execution
          displayFailuresSummary: false, // display summary of all failures after execution
          displayPendingSummary: false, // display summary of all pending specs after execution
          displaySuccessfulSpec: true, // display each successful spec
          displayFailedSpec: true, // display each failed spec
          displayPendingSpec: true, // display each pending spec
          displaySpecDuration: true, // display each spec duration
          displaySuiteNumber: true,
        },
      }),
    );
  },

  baseUrl: 'http://localhost:8080',
  framework: 'jasmine',
};

// exports.config.multiCapabilities.forEach(caps => {
//   for (var i in exports.config.commonCapabilities)
//     caps[i] = caps[i] || exports.config.commonCapabilities[i];
// });
