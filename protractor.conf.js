exports.config = {
  specs: ['spec/**/*.spec.js'],
  capabilities: {
    browserName: 'firefox'
  },
  baseUrl: 'http://localhost:8080',
  framework: 'jasmine'
}
