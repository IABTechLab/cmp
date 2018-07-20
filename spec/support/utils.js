const fs = require('fs');

module.exports = {
	clearCookies: function() {
		browser.driver.manage().deleteAllCookies();
	},
	getCookies: function() {
		return browser.manage().getCookies();
	},
	writeScreenShot: function(data, filename) {
		let stream = fs.createWriteStream(filename);
		stream.write(new Buffer(data, 'base64'));
		stream.end();
	}
}
