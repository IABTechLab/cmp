import { h, render } from 'preact';
import Promise from 'promise-polyfill';
import Store from './store';
import Cmp, { CMP_GLOBAL_NAME } from './cmp';
import { readVendorConsentCookie, readPublisherConsentCookie } from './cookie/cookie';
import { fetchVendorList, fetchLocalizedPurposeList, fetchCustomPurposeList } from './vendor';
import { checkIfUserInEU } from './utils';
import log from './log';
import config from './config';
const metadata = require('../../metadata.json');

export function init(configUpdates) {
	config.update(configUpdates);
	log.debug('Using configuration:', config);

	// Fetch the current vendor consent before initializing
	return readVendorConsentCookie().then(vendorConsentData => {
		return readPublisherConsentCookie().then(publisherConsentData => {
			// Initialize the store with all of our consent data
			const store = new Store({
				vendorConsentData,
				publisherConsentData,
				cmpId: metadata.cmpId,
				cmpVersion: metadata.cmpVersion,
				cookieVersion: 1
			});

			const _fetchLocalizedPurposeList = store.consentLanguage.toLowerCase() === "en" ? Promise.resolve : fetchLocalizedPurposeList;
			// Request lists
			return Promise.all([
				fetchVendorList().then((resp) => {
					store.updateVendorList(resp);
					_fetchLocalizedPurposeList().then(localized => { localized && store.updateLocalizedPurposeList(localized); });
				}),
				fetchCustomPurposeList().then(store.updateCustomPurposeList),
			]).then(() => {
				// Pull queued command from __cmp stub
				const {commandQueue = []} = window[CMP_GLOBAL_NAME] || {};

				// Replace the __cmp with our implementation
				const cmp = new Cmp(store, config);
				store.updateCmpHandle(cmp);

				// Expose `processCommand` as the CMP implementation
				window[CMP_GLOBAL_NAME] = cmp.processCommand;

				// Execute any previously queued command
				cmp.commandQueue = commandQueue;

				// set cookies on digitrust domain after consent submitted
				const { addEventListener, getVendorConsents } = cmp.commands;
				if (config.digitrust.redirects) {
					addEventListener('consentStringUpdated', digitrustRedirect);
				}

				function digitrustRedirect() {
					getVendorConsents([64], (result) => {
						if (result && result.vendorConsents && result.vendorConsents[64]) {
							window.location.replace(`${config.digitrustRedirectUrl}${encodeURIComponent(window.location.href)}`);
						}
					});
				}

				return checkIfUserInEU(config.geoIPVendor, (response) => {
					cmp.gdprApplies = response.applies;
					cmp.gdprAppliesLanguage = response.language;
					cmp.gdprAppliesLocation = response.location;
				}).then((response) => {
					store.updateIsEU(response.applies);

					// Render the UI
					const App = require('../components/app').default;
					render(<App store={store} cmp={cmp} notify={cmp.notify} config={config} />, document.body);

					// Notify listeners that the CMP is loaded
					log.debug(`Successfully loaded CMP version: ${metadata.cmpVersion}`);
					cmp.isLoaded = true;
					cmp.notify('isLoaded');
					cmp.cmpReady = true;
					cmp.notify('cmpReady');
					cmp.processCommandQueue();
				}).catch(err => {
					log.error('Failed to check user location. CMP not ready', err);
				});
			}).catch(err => {
				log.error('Failed to load lists. CMP not ready', err);
			});
		}).catch(err => {
			log.error('Failed to load CMP', err);
		});
	});
}


