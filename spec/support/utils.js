/* global browser */
const fs = require('fs');

module.exports = {
  clearCookies() {
    browser.driver.manage().deleteAllCookies();
  },
  getCookies() {
    return browser.manage().getCookies();
  },
  writeScreenshot(data, filename) {
    let stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
  },
  suiteTitle(title) {
    const separator = Array(title.length)
      .fill('=')
      .join('');
    return [separator, title, separator].join('\n');
  },
};
