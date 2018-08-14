exports.config = {
  specs: ['spec/**/*.spec.js'],
  multiCapabilities: [
    {
      'browserName': 'firefox',
      'moz:firefoxOptions': {
        'binary': process.env.FIREFOX_BIN,
        'args': ['--verbose']
      }
    },
    {'browserName': 'chrome'}
  ],
  baseUrl: 'http://localhost:8080',
  framework: 'jasmine'
}
