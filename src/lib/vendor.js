import Promise from 'promise-polyfill';
import 'whatwg-fetch';
import config from './config';
import log from './log';
import { updateLocalizationSettings } from './localize';
import { sendPortalCommand } from './portal';
const metadata = require('../../metadata.json');

/**
	* Attempt to load a vendor list from the local domain. If a
	* list is not found attempt to load it from the global list location
	* using the "portal" for cross domain communication.
*/
function fetchVendorList() {
	return fetch(config.globalVendorListLocation)
		.then(res => res.json())
		.then(vendors => {
			// update selected vendors against global vendor list
			if (vendors) {
				return updateSelectedVendors(vendors);
			}
			return sendPortalCommand({ command: 'readVendorList' });
		})
		.catch(() => {
			log.debug('Configured vendors.json not found. Requesting global list');
			return sendPortalCommand({ command: 'readVendorList' });
		});
}

function fetchLocalizedPurposeList() {
	let interpolate = (string, args) => string.replace(/\${(\w+)}/g, (_, v) => args[v]);

	const consentLanguage = updateLocalizationSettings({forceLocale: config.forceLocale, localization: config.localization});
	let url = interpolate(metadata.localizedVendorListProvider, {consentLanguage: consentLanguage.toLowerCase()});
	return fetch(url)
		.then(res => res.json())
		.catch(err => {
			log.error(`Failed to load standard purposes in the selected language`, err);
		});
}

function fetchCustomPurposeList() {
	if (!config.storePublisherData || !config.customPurposeListLocation) {
		return Promise.resolve();
	}

	return fetch(config.customPurposeListLocation)
		.then(res => res.json())
		.catch(err => {
			log.error(`Failed to load custom purposes list from ${config.customPurposeListLocation}`, err);
		});
}

function updateSelectedVendors(selectedVendors) {
	return sendPortalCommand({ command: 'readVendorList' }).then((globalVendors) => {
		const updatedVendors = selectedVendors.vendors
			.map(customVendor => {
				// update selected vendors with fetched global versions
				return globalVendors.vendors.find(globalVendor => {
					return customVendor && globalVendor.id === customVendor.id;
				});
			})
			// filter out undefined vendors
			.filter(customVendor => {
				return customVendor && customVendor.id;
			});
		return {
			lastUpdated: globalVendors.lastUpdated,
			version: globalVendors.vendorListVersion,
			vendorListVersion: globalVendors.vendorListVersion,
			// is set to highest GVL id, not used id
			maxVendorId: globalVendors.vendors.reduce((prevMax, currenMax) => {
				return currenMax.id > prevMax ? currenMax.id : prevMax;
			}, 0),
			vendors: updatedVendors,
			purposes: globalVendors.purposes,
		};
	});
}

export {
	fetchVendorList,
	fetchLocalizedPurposeList,
	fetchCustomPurposeList,
};
