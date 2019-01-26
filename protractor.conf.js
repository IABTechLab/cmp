const browserstack = require('browserstack-local');

const availableBrowsers = {
  chrome: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=800,600'],
    },
  },

  firefox: {
    browserName: 'firefox',
    'moz:firefoxOptions': {
      args: ['--headless', '--width=800', '--height=600'],
    },
  },

  safari: {
    browserName: 'safari',
  },

  ie: {
    browserName: 'ie',
  },

  edge: {
    browserName: 'ie',
  },
};

const browsers = process.env.BROWSERS
  ? process.env.BROWSERS.split(',')
  : ['chrome'];

const baseUrl = process.env.BASE_URL || 'http://localhost:8080';

const config = {
  baseUrl,
  framework: 'jasmine',
  specs: ['spec/**/*.spec.js'],

  jasmineNodeOpts: {
    print() {},
  },

  multiCapabilities: browsers
    .filter(
      browserName => typeof availableBrowsers[browserName] !== 'undefined',
    )
    .map(browserName => availableBrowsers[browserName]),

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
};

if (process.env.BROWSERSTACK == 1) {
  config.seleniumAddress = 'http://hub-cloud.browserstack.com/wd/hub';
  config.commonCapabilities = {
    'browserstack.user': process.env.BROWSERSTACK_USER,
    'browserstack.key': process.env.BROWSERSTACK_KEY,
    // 'browserstack.local': true,
  };

  config.multiCapabilities.forEach(cap => {
    for (let key in config.commonCapabilities) {
      cap[key] = cap[key] || config.commonCapabilities[key];
    }
  });
}

exports.config = config;
