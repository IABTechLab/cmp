exports.config = {
  specs: ['spec/**/*.spec.js'],
  capabilities: {
    browserName: 'chrome'
  },
  baseUrl: 'http://localhost:8080',
  framework: 'jasmine'
}
