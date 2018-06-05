import {
	writePublisherConsentCookie,
	writeVendorConsentCookie,
	readVendorConsentCookie
} from "./cookie/cookie";
import config from './config';
import {
	updateLocalizationSettings
} from './localize';
const metadata = require('../../metadata.json');

/**
 * Copy a data object and make sure to replace references
 * of Set objects with new ones.
 */
function copyData(dataObject) {
	if (typeof dataObject !== 'object') {
		return dataObject;
	}
	const copy = {...dataObject};
	for (let key in copy) {
		if (copy.hasOwnProperty(key) && copy[key] instanceof Set) {
			copy[key] = new Set(copy[key]);
		}
	}
	return copy;
}

export default class Store {
	constructor({
		cmpId = metadata.cmpId,
		cmpVersion = metadata.cmpVersion,
		cookieVersion = 1,
		vendorConsentData,
		publisherConsentData,
		vendorList,
		customPurposeList
	} = {}) {
		// Keep track of data that has already been persisted
		this.persistedVendorConsentData = copyData(vendorConsentData);
		this.persistedPublisherConsentData = copyData(publisherConsentData);

		this.vendorConsentData = Object.assign({
			cookieVersion,
			cmpId,
			cmpVersion,
			selectedPurposeIds: new Set(),
			selectedVendorIds: new Set(),
			isEU: null
		}, vendorConsentData);

		const consentLanguage = updateLocalizationSettings({forceLocale: config.forceLocale, localization: config.localization});
		this.consentLanguage = consentLanguage;
		this.vendorConsentData.consentLanguage = consentLanguage;

		this.publisherConsentData = Object.assign({
			cookieVersion,
			cmpId,
			cmpVersion,
			selectedCustomPurposeIds: new Set()
		}, publisherConsentData);
		this.publisherConsentData.consentLanguage = consentLanguage;

		this.isConsentToolShowing = false;
		this.isFooterShowing = false;

		this.updateVendorList(vendorList);
		this.updateCustomPurposeList(customPurposeList);
	}

	/**
	 * Build vendor consent object from data that has already been persisted. This
	 * list will only return consent=true for vendors that exist in the current
	 * vendorList.
	 */
	getVendorConsentsObject = (vendorIds) => {
		const {
			vendorList = {},
			persistedVendorConsentData = {}
		} = this;

		const {
			isEU,
			consentString,
			source,
			created,
			lastUpdated,
			cookieVersion,
			cmpId,
			cmpVersion,
			consentScreen,
			consentLanguage,
			vendorListVersion,
			maxVendorId = 0,
			selectedVendorIds = new Set(),
			selectedPurposeIds = new Set()
		} = persistedVendorConsentData;

		const {purposes = [], vendors = []} = vendorList;

		// No consent will be allowed for vendors or purposes not on the list
		const allowedVendorIds = new Set(vendors.map(({id}) => id));
		const allowedPurposeIds = new Set(purposes.map(({id}) => id));

		// Map requested vendorIds
		const vendorMap = {};
		if (vendorIds && vendorIds.length) {
			vendorIds.forEach(id => vendorMap[id] = selectedVendorIds.has(id) && allowedVendorIds.has(id));
		}
		else {
			// In case the vendor list has not been loaded yet find the highest
			// vendor ID to map any consent data we already have
			const lastVendorId = Math.max(maxVendorId,
				...vendors.map(({id}) => id),
				...Array.from(selectedVendorIds));

			// Map all IDs up to the highest vendor ID found
			for (let i = 1; i <= lastVendorId; i++) {
				vendorMap[i] = selectedVendorIds.has(i) && allowedVendorIds.has(i);
			}
		}

		// Map all purpose IDs
		const lastPurposeId = Math.max(
			...purposes.map(({id}) => id),
			...Array.from(selectedPurposeIds));

		const purposeMap = {};
		for (let i = 1; i <= lastPurposeId; i++) {
			purposeMap[i] = selectedPurposeIds.has(i) && allowedPurposeIds.has(i);
		}

		return {
			isEU,
			consentString,
			source,
			cookieVersion,
			created,
			lastUpdated,
			cmpId,
			cmpVersion,
			consentScreen,
			consentLanguage,
			vendorListVersion,
			maxVendorId,
			purposeConsents: purposeMap,
			vendorConsents: vendorMap
		};
	};

	getFullVendorConsentsObject = () => {
		const self = this;
		return readVendorConsentCookie().then(cookie => {
			var consentString;
			var source;
			var consentScreen;
			const isEU = this.vendorConsentData.isEU;

			if (cookie) {
				consentString = cookie.consentString;
				source = cookie.source;
				consentScreen = cookie.consentScreen;
			}

			return Object.assign(self.getVendorConsentsObject(), {
				isEU,
				consentString,
				source,
				consentScreen
			});
		});
	}

	/**
	 * Build publisher consent object from data that has already been persisted.
	 * Purposes will only have consent=true if they exist in the current vendorList.
	 */
	getPublisherConsentsObject = () => {
		const {
			vendorList = {},
			customPurposeList = {},
			persistedPublisherConsentData = {},
			persistedVendorConsentData = {}
		} = this;

		const {
			cookieVersion,
			created,
			lastUpdated,
			cmpId,
			cmpVersion,
			consentScreen,
			consentLanguage,
			vendorListVersion,
			publisherPurposesVersion,
			selectedCustomPurposeIds = new Set()
		} = persistedPublisherConsentData;

		const {selectedPurposeIds = new Set()} = persistedVendorConsentData;
		const {purposes = []} = vendorList;
		const {purposes: customPurposes = []} = customPurposeList;

		// No consent will be allowed for purposes not on the list
		const allowedPurposeIds = new Set(purposes.map(({id}) => id));

		const lastStandardPurposeId = Math.max(
			...purposes.map(({id}) => id),
			...Array.from(selectedPurposeIds));

		const lastCustomPurposeId = Math.max(
			...customPurposes.map(({id}) => id),
			...Array.from(selectedCustomPurposeIds));

		// Map all purpose IDs
		const standardPurposeMap = {};
		for (let i = 1; i <= lastStandardPurposeId; i++) {
			standardPurposeMap[i] = selectedPurposeIds.has(i) && allowedPurposeIds.has(i);
		}
		const customPurposeMap = {};
		for (let i = 1; i <= lastCustomPurposeId; i++) {
			customPurposeMap[i] = selectedCustomPurposeIds.has(i);
		}

		return {
			cookieVersion,
			created,
			lastUpdated,
			cmpId,
			cmpVersion,
			consentScreen,
			consentLanguage,
			vendorListVersion,
			publisherPurposesVersion,
			standardPurposes: standardPurposeMap,
			customPurposes: customPurposeMap
		};
	};

	getVendorList = () => {
		return this.vendorList;
	}

	/**
	 * Persist all consent data to the cookie.  This data will NOT be filtered
	 * by the vendorList and will include global consents set no matter what
	 * was allowed by the list.
	 */
	persist = () => {
		const {
			vendorConsentData,
			publisherConsentData,
			vendorList,
			customPurposeList
		} = this;

		const {
			vendorListVersion = 1
		} = vendorList || {};

		// Update modification dates and write the cookies
		const now = new Date();
		vendorConsentData.created = vendorConsentData.created || now;
		vendorConsentData.lastUpdated = now;

		// Update version of list to one we are using
		vendorConsentData.vendorListVersion = vendorListVersion;
		publisherConsentData.vendorListVersion = vendorListVersion;

		publisherConsentData.created = publisherConsentData.created || now;
		publisherConsentData.lastUpdated = now;

		// Write vendor cookie to appropriate domain
		writeVendorConsentCookie({...vendorConsentData, vendorList})
			.then(() => {
				if (this.cmp) this.cmp.notify('consentStringUpdated');
			});

		// Write publisher cookie if enabled
		if (config.storePublisherData) {
			writePublisherConsentCookie({
				...vendorConsentData, ...publisherConsentData,
				vendorList,
				customPurposeList
			});
		}

		// Store the persisted data
		this.persistedVendorConsentData = copyData(vendorConsentData);
		this.persistedPublisherConsentData = copyData(publisherConsentData);

		// Notify of date changes
		this.storeUpdate();
	};

	listeners = new Set();

	subscribe = (callback) => {
		this.listeners.add(callback);
	};

	unsubscribe = (callback) => {
		this.listeners.delete(callback);
	};

	storeUpdate = () => {
		this.listeners.forEach(callback => callback(this));
	};

	selectVendor = (vendorId, isSelected) => {
		const {selectedVendorIds} = this.vendorConsentData;
		if (isSelected) {
			selectedVendorIds.add(vendorId);
		}
		else {
			selectedVendorIds.delete(vendorId);
		}
		this.storeUpdate();
	};

	selectAllVendors = (isSelected) => {
		const {vendors = []} = this.vendorList || {};
		const operation = isSelected ? 'add' : 'delete';
		vendors.forEach(({id}) => this.vendorConsentData.selectedVendorIds[operation](id));
		this.storeUpdate();
	};

	selectPurpose = (purposeId, isSelected) => {
		const {selectedPurposeIds} = this.vendorConsentData;
		if (isSelected) {
			selectedPurposeIds.add(purposeId);
		}
		else {
			selectedPurposeIds.delete(purposeId);
		}
		this.storeUpdate();
	};

	selectAllPurposes = (isSelected) => {
		const {purposes = []} = this.vendorList || {};
		const operation = isSelected ? 'add' : 'delete';
		purposes.forEach(({id}) => this.vendorConsentData.selectedPurposeIds[operation](id));
		this.storeUpdate();
	};

	selectCustomPurpose = (purposeId, isSelected) => {
		const {selectedCustomPurposeIds} = this.publisherConsentData;
		if (isSelected) {
			selectedCustomPurposeIds.add(purposeId);
		}
		else {
			selectedCustomPurposeIds.delete(purposeId);
		}
		this.storeUpdate();
	};

	selectAllCustomPurposes = (isSelected) => {
		const {purposes = []} = this.customPurposeList || {};
		const operation = isSelected ? 'add' : 'delete';
		purposes.forEach(({id}) => this.publisherConsentData.selectedCustomPurposeIds[operation](id));
		this.storeUpdate();
	};

	toggleFooterConsentToolShowing = (isShown) => {
		this.isFooterConsentToolShowing = typeof isShown === 'boolean' ? isShown : !this.isConsentToolShowing;
		this.isFooterShowing = false;
		this.isConsentToolShowing = false;
		this.storeUpdate();
	};

	toggleConsentToolShowing = (isShown) => {
		this.isConsentToolShowing = typeof isShown === 'boolean' ? isShown : !this.isConsentToolShowing;
		this.isFooterShowing = false;
		this.isFooterConsentToolShowing = false;
		this.storeUpdate();
	};

	toggleFooterShowing = (isShown) => {
		this.isFooterShowing = typeof isShown === 'boolean' ? isShown : !this.isFooterShowing;
		this.isConsentToolShowing = false;
		this.isFooterConsentToolShowing = false;
		this.storeUpdate();
	};

	updateVendorList = vendorList => {
		const {
			created,
			maxVendorId = 0
		} = this.vendorConsentData;

		const {
			vendors = [],
			purposes = [],
		} = vendorList || {};

		// If vendor consent data has never been persisted set default selected status
		if (!created) {
			this.vendorConsentData.selectedPurposeIds = new Set(purposes.map(p => p.id));
			this.vendorConsentData.selectedVendorIds = new Set(vendors.map(v => v.id));
		}

		const {selectedVendorIds = new Set()} = this.vendorConsentData;
		const {version = 1} = vendorList || {};

		// Find the maxVendorId out of the vendor list and selectedVendorIds
		this.vendorConsentData.maxVendorId = Math.max(maxVendorId,
			...vendors.map(({id}) => id),
			...Array.from(selectedVendorIds));
		this.vendorConsentData.vendorListVersion = version;
		this.publisherConsentData.vendorListVersion = version;
		this.vendorList = vendorList;
		this.storeUpdate();
	};

	updateCustomPurposeList = customPurposeList => {
		const {created} = this.publisherConsentData;

		// If publisher consent has never been persisted set the default selected status
		if (!created) {
			const {purposes = [],} = customPurposeList || {};
			this.publisherConsentData.selectedCustomPurposeIds = new Set(purposes.map(p => p.id));
		}

		const {version = 1} = customPurposeList || {};
		this.publisherConsentData.publisherPurposesVersion = version;

		this.customPurposeList = customPurposeList;
		this.storeUpdate();
	};

	updateLocalizedPurposeList = localizedPurposeList => {
		this.vendorList.purposes = localizedPurposeList.purposes;
		this.vendorList.features = localizedPurposeList.features;
	}

	updateIsEU = boolean => {
		this.vendorConsentData.isEU = boolean;
	};

	updateCmpHandle = cmpInstance => {
		this.cmp = cmpInstance;
	}
}
