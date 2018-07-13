const fs = require('fs');

var utils = {
  writeScreenShot: function(data, filename) {
		let stream = fs.createWriteStream(filename);
		stream.write(new Buffer(data, 'base64'));
		stream.end();
	}
}

module.exports = utils;
