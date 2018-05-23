import log from './log';
const metadata = require('../../metadata.json');
const defaultConfig = {
	customPurposeListLocation: null,
	globalVendorListLocation: metadata.globalVendorListLocation,
	globalConsentLocation: metadata.globalConsentLocation,
	storeConsentGlobally: true,
	storePublisherData: true,
	logging: false,
	localization: {},
	forceLocale: null,
	gdprAppliesGlobally: false,
	repromptOptions: {
		fullConsentGiven: 360,
		someConsentGiven: 30,
		noConsentGiven: 30,
	},
	geoIPVendor: 'https://cmp.digitru.st/1/geoip.json',
	testingMode: 'normal',
	layout: null
};

class Config {
	constructor() {
		this.update(defaultConfig);
	}

	update = (updates) => {
		if (updates && typeof updates === 'object') {
			const validKeys = Object.keys(defaultConfig);
			const { validUpdates, invalidKeys } = Object.keys(updates).reduce((acc, key) => {
				if (validKeys.indexOf(key) > -1) {
					acc.validUpdates = {
						...acc.validUpdates,
						[key]: updates[key]
					};
				}
				else {
					acc.invalidKeys.push(key);
				}
				return acc;
			}, { validUpdates: {}, invalidKeys: [] });

			Object.assign(this, validUpdates);
			if (invalidKeys.length) {
				log.warn(`Invalid CMP config values not applied: ${invalidKeys.join(', ')}`);
			}

		}
	};
}

export default new Config();
