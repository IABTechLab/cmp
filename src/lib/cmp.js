import log from './log';
import Promise from 'promise-polyfill';
import { encodeVendorConsentData } from './cookie/cookie';
import 'whatwg-fetch';

const metadata = require('../../metadata.json');

const MAX_COOKIE_LIFESPAN_DAYS = 390;
const EU_COUNTRY_CODES = new Set([
	"GB",
	"DE",
	"PL",
	"FR",
	"ES",
	"IT",
	"RO",
	"SE",
	"BG",
	"GR",
	"NL",
	"HR",
	"IE",
	"CZ",
	"AT",
	"HU",
	"FI",
	"DK",
	"BE",
	"PT",
	"MT",
	"CY",
	"LT",
	"SK",
	"SI",
	"EE",
	"LV",
]);
const EU_LANGUAGE_CODES = new Set([
	"bg",
	"hr",
	"tr",
	"cs",
	"da",
	"et",
	"fi",
	"fr",
	"fr-be",
	"fr-fr",
	"fr-lu",
	"fr-mc",
	"fr-ch",
	"de",
	"de-at",
	"de-de",
	"de-li",
	"de-lu",
	"de-ch",
	"el",
	"hu",
	"gd-ie",
	"ga",
	"it",
	"it-ch",
	"lv",
	"lt",
	"lb",
	"mt",
	"nl",
	"nl-be",
	"pl",
	"pt",
	"rm",
	"ro",
	"ro-mo",
	"sk",
	"sl",
	"es",
	"es-es",
	"cy",
	"sv",
	"sv-fi",
	"sv-sv",
	"en-gb",
	"en-ie",
	"mo",
	"ru-mo",
	"eu",
	"ca",
	"co",
	"fo",
	"fy",
	"fur",
	"gd",
	"gl",
	"is",
	"la",
	"no",
	"nb",
	"nn",
	"oc",
	"sc",
	"sb",
	"hsb",
	"vo",
	"wa",
	"ar",
	"ast",
	"br",
	"eo",
]);
const CMP_VERSION = metadata.cmpVersion;
export const CMP_GLOBAL_NAME = '__cmp';

export default class Cmp {
	constructor(store, config) {
		this.isLoaded = false;
		this.cmpReady = false;
		this.eventListeners = {};
		this.store = store;
		this.config = config;
		this.processCommand.receiveMessage = this.receiveMessage;
		this.processCommand.VERSION = CMP_VERSION;
	}

	utils = {
		checkReprompt: (repromptOptions, vendorConsents, presentVendors) => {
			const self = this;

			const consentGiven = self.utils.getAmountOfConsentGiven(vendorConsents, presentVendors.length);
			let days = repromptOptions[consentGiven];
			return self.utils.checkIfCookieIsOld(days);
		},
		checkIfGDPRApplies: () => {
			const self = this;

			if (self.utils.checkIfLanguageLocaleApplies(navigator.languages)) return true;
			return self.utils.checkIfUserInEU();
		},
		checkIfLanguageLocaleApplies: (languages) => {
			for (let idx in languages) {
				if (EU_LANGUAGE_CODES.has(languages[idx])) {
					return true;
				}
			}
			return false;
		},
		checkIfUserInEU: () => {
			const self = this;

			return fetch(self.config.geoIPVendor)
				.then(resp => {
				  let countryISO = resp.headers.get("X-GeoIP-Country");
				  if (EU_COUNTRY_CODES.has(countryISO)) {
						self.store.updateIsEU(true);
						return true;
				  }
				  return false;
				});
		},
		getAmountOfConsentGiven: (vendorConsents, totalPossibleVendors) => {
			let consentGiven;
			const allowedVendorsCount = Object.keys(vendorConsents).map((vendor) => { return vendorConsents[vendor]; }).filter((bool) => bool).length;
			if (allowedVendorsCount === 0) {
				consentGiven = "noConsentGiven";
			} else if (allowedVendorsCount < totalPossibleVendors) {
				consentGiven = "someConsentGiven";
			} else {
				consentGiven = "fullConsentGiven";
			}
			return consentGiven;
		},
		checkIfCookieIsOld: (days) => {
			const self = this;

			// cookie not present; this particular branch should only ever be hit by non-EU people
			if (!self.store.getVendorConsentsObject().lastUpdated && !self.store.getPublisherConsentsObject().lastUpdated) return false;

			const globalConsentCookieTimestamp = new Date(self.store.getVendorConsentsObject().lastUpdated).getTime();
			const publisherConsentCookieTimestamp = new Date(self.store.getPublisherConsentsObject().lastUpdated).getTime();
			const oldestCookieTimestamp = (globalConsentCookieTimestamp > publisherConsentCookieTimestamp) ? publisherConsentCookieTimestamp : globalConsentCookieTimestamp;

			const now = Date.now();
			if (days > MAX_COOKIE_LIFESPAN_DAYS) days = MAX_COOKIE_LIFESPAN_DAYS;
			const daysInMS = (1000 * 60 * 60 * 24 * days);
			return ((now - daysInMS) > oldestCookieTimestamp) ? true : false;
		},
	};

	commands = {
		renderCmpIfNeeded: (_, callback = () => {}) => {
			const self = this;
			const store = self.store;
			const config = self.config;
			const cmp = window.__cmp;
			if (!cmp) {
				log.error('CMP failed to load');
			}
			else if (!window.navigator.cookieEnabled) {
				log.warn('Cookies are disabled. Ignoring CMP consent check');
			}
			else {
				Promise.all([
					cmp('getVendorConsents'),
					cmp('getVendorList')
				]).then(([{vendorConsents}, {vendors}]) => {
					let needsPublisherCookie = false;
					if (config.storePublisherData && !store.getPublisherConsentsObject().lastUpdated) needsPublisherCookie = true;
					let needsGlobalCookie = false;
					if (!store.getVendorConsentsObject().lastUpdated) needsGlobalCookie = true;
					if (config.gdprAppliesGlobally) {
						// if no cookie, show tool
						if (needsPublisherCookie || needsGlobalCookie) {
							cmp('showConsentTool');
						}
						// if cookie present and current, don't show tool
						// if cookie present and old, show tool
						else if (self.utils.checkReprompt(config.repromptOptions, vendorConsents, vendors)) {
							cmp('showConsentTool');
						}
						else {
							log.debug("rendering the CMP is not needed");
						}
					}
					else {
						// if not in EU, no cookie present, don't show tool
						// if geolocation in EU, no cookie present, show tool
						if (self.utils.checkIfGDPRApplies()) {
							if (needsPublisherCookie || needsGlobalCookie) {
								cmp('showConsentTool');
							} else {
								store.toggleFooterShowing(true);
							}
						}
						// if cookie present and current, don't show tool
						// if cookie present and old, show tool
						else if (self.utils.checkReprompt(config.repromptOptions, vendorConsents, vendors)) {
							cmp('showConsentTool');
						}
						else {
							log.debug("rendering the CMP is not needed");
						}
					}
				});
				callback();
			}
		},

		/**
		 * Get all publisher consent data from the data store.
		 */
		getPublisherConsents: (purposeIds, callback = () => {}) => {
			const consent = this.store.getPublisherConsentsObject();
			callback(consent);
			return consent;
		},

		/**
		 * Get all vendor consent data from the data store.
		 * @param {Array} vendorIds Array of vendor IDs to retrieve.  If empty return all vendors.
		 */
		getVendorConsents: (vendorIds, callback = () => {}) => {
			const consent = this.store.getVendorConsentsObject(vendorIds)
			callback(consent);
			return consent;
		},

		/**
		 * Get all current vendor consent cookie data from the data store.
		 * @param {Array} vendorIds Array of vendor IDs to retrieve.  If empty return all vendors.
		 */
		getUnpackedVendorCookie: (vendorIds, callback = () => {}) => {
			return this.store.getFullVendorConsentsObject(vendorIds)
				.then(consent => {
					callback(consent);
					return consent;
				});
		},

		/**
		 * Get the encoded vendor consent data value.
		 */
		getConsentData: (_, callback = () => {}) => {
			const {
				persistedVendorConsentData,
				vendorList
			} = this.store;

			const {
				vendors = [],
				purposes = []
			} = vendorList || {};

			const {
				selectedVendorIds = new Set(),
				selectedPurposeIds = new Set()
			} = persistedVendorConsentData || {};

			// Filter consents by values that exist in the current vendorList
			const allowedVendorIds = new Set(vendors.map(({id}) => id));
			const allowedPurposeIds = new Set(purposes.map(({id}) => id));

			// Encode the persisted data
			const consentData = persistedVendorConsentData && encodeVendorConsentData({
				...persistedVendorConsentData,
				selectedVendorIds: new Set(Array.from(selectedVendorIds).filter(id => allowedVendorIds.has(id))),
				selectedPurposeIds: new Set(Array.from(selectedPurposeIds).filter(id => allowedPurposeIds.has(id))),
				vendorList
			});
			callback(consentData);
			return consentData;
		},

		/**
		 * Get the entire vendor list
		 */
		getVendorList: (vendorListVersion, callback = () => {}) => {
			const list = this.store.vendorList;
			callback(list);
			return list;
		},

		/**
		 * Add a callback to be fired on a specific event.
		 * @param {string} event Name of the event
		 */
		addEventListener: (event, callback) => {
			const eventSet = this.eventListeners[event] || new Set();
			eventSet.add(callback);
			this.eventListeners[event] = eventSet;

			// Trigger load events immediately if they have already occurred
			if (event === 'isLoaded' && this.isLoaded) {
				callback({event});
			}
			if (event === 'cmpReady' && this.cmpReady) {
				callback({event});
			}
		},

		/**
		 * Remove a callback for an event.
		 * @param {string} event Name of the event to remove callback from
		 */
		removeEventListener: (event, callback) => {
			// If an event is supplied remove the specific listener
			if (event) {
				const eventSet = this.eventListeners[event] || new Set();
				// If a callback is supplied remove it
				if (callback) {
					eventSet.delete(callback);
				}
				// If no callback is supplied clear all listeners for this event
				else {
					eventSet.clear();
				}
				this.eventListeners[event] = eventSet;
			}
			// If no event is supplied clear ALL listeners
			else {
				this.eventListeners = {};
			}
		},

		/**
		 * Trigger the consent tool UI to be shown
		 */
		showConsentTool: (_, callback = () => {}) => {
			this.store.toggleConsentToolShowing(true);
			callback(true);
			return true;
		}
	};

	/**
	 * Handle a message event sent via postMessage to
	 * call `processCommand`
	 */
	receiveMessage = ({data, origin, source}) => {
		const {[CMP_GLOBAL_NAME]: cmp} = data;
		if (cmp) {
			const {callId, command, parameter} = cmp;
			this.processCommand(command, parameter, result =>
				source.postMessage({[CMP_GLOBAL_NAME]: {callId, command, result}}, origin));
		}
	};

	/**
	 * Call one of the available commands.
	 * @param {string} command Name of the command
	 * @param {*} parameter Expected parameter for command
	 */
	processCommand = (command, parameter, callback) => {
		if (typeof this.commands[command] !== 'function') {
			log.error(`Invalid CMP command "${command}"`);
		}
		else {
			log.info(`Proccess command: ${command}, parameter: ${parameter}`);
			return Promise.resolve(this.commands[command](parameter, callback));
		}
	};

	/**
	 * Trigger all event listener callbacks to be called.
	 * @param {string} event Name of the event being triggered
	 * @param {*} data Data that will be passed to each callback
	 */
	notify = (event, data) => {
		log.info(`Notify event: ${event}`);
		const eventSet = this.eventListeners[event] || new Set();
		eventSet.forEach(listener => {
			listener({event, data});
		});
	};
}
