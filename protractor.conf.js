exports.config = {
  specs: ['spec/**/*.spec.js'],
  multiCapabilities: [
    {'browserName': 'firefox'},
    {'browserName': 'chrome'}
  ],
  baseUrl: 'http://localhost:8080',
  framework: 'jasmine'
}
