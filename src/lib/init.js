import { h, render } from 'preact';
import Promise from 'promise-polyfill';
import Store from './store';
import Cmp, { CMP_GLOBAL_NAME } from './cmp';
import { readVendorConsentCookie, readPublisherConsentCookie } from './cookie/cookie';
import { fetchVendorList, fetchPurposeList } from './vendor';
import log from './log';
import config from './config';
const metadata = require('../../metadata.json');

export function init(configUpdates) {
	config.update(configUpdates);
	log.debug('Using configuration:', config);

	// Fetch the current vendor consent before initializing
	return readVendorConsentCookie()
		.then(vendorConsentData => {

			// Initialize the store with all of our consent data
			const store = new Store({
				vendorConsentData,
				publisherConsentData: readPublisherConsentCookie(),
				cmpId: metadata.cmpId,
				cmpVersion: metadata.cmpVersion,
				cookieVersion: 1
			});

			// Request lists
			return Promise.all([
				fetchVendorList().then(store.updateVendorList),
				fetchPurposeList().then(store.updateCustomPurposeList)
			]).then(() => {
				// Pull queued command from __cmp stub
				const {commandQueue = []} = window[CMP_GLOBAL_NAME] || {};

				// Replace the __cmp with our implementation
				const cmp = new Cmp(store, config);

				// Expose `processCommand` as the CMP implementation
				window[CMP_GLOBAL_NAME] = cmp.processCommand;

				// Execute any previously queued command
				cmp.commandQueue = commandQueue;
				cmp.processCommandQueue();

				// Render the UI
				const App = require('../components/app').default;
				render(<App store={store} notify={cmp.notify} />, document.body);
				// Request lists
				return Promise.all([
					fetchVendorList().then(store.updateVendorList),
					fetchPurposeList().then(store.updateCustomPurposeList)
				]).then(() => {
					// Notify listeners that the CMP is loaded
					log.debug(`Successfully loaded CMP version: ${metadata.cmpVersion}`);
					cmp.isLoaded = true;
					cmp.notify('isLoaded');
					cmp.cmpReady = true;
					cmp.notify('cmpReady');
				}).catch(err => {
					log.error('Failed to load lists. CMP not ready', err);
				});

			});
		})
		.catch(err => {
			log.error('Failed to load CMP', err);
		});
}


