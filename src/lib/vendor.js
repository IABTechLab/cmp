import Promise from 'promise-polyfill';
import 'whatwg-fetch';
import config from './config';
import log from './log';
import { sendPortalCommand } from './portal';

const LOCAL_VENDOR_LIST_LOCATION = `//${window.location.host}/cmp/vendors.json`;

function fetchVendorList() {
	/**
	 * Global consent triggered should always load all vendors.
	 */
	if (config.storeConsentGlobally) {
		log.debug('Consent to be stored globally. Requesting global list');
		return sendPortalCommand({command: 'readVendorList'});
	}

	/**
	 * Attempt to load a vendor list from the local domain. If a
	 * list is not found attempt to load it from the global list location
	 * using the "portal" for cross domain communication.
	 */
	return fetch(LOCAL_VENDOR_LIST_LOCATION)
		.then(res => res.json())
		.catch(() => {
			log.debug('Local vendors.json not found. Requesting global list');
			return sendPortalCommand({command: 'readVendorList'});
		});
}

function fetchPurposeList() {
	if (!config.storePublisherData || !config.customPurposeListLocation) {
		return Promise.resolve();
	}

	return fetch(config.customPurposeListLocation)
		.then(res => res.json())
		.catch(err => {
			log.error(`Failed to load custom purposes list from ${config.customPurposeListLocation}`, err);
		});
}

export {
	fetchVendorList,
	fetchPurposeList,
};
