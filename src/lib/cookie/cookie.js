//jshint esversion:6
import Promise from 'promise-polyfill';
import log from '../log';
import {
	padRight,
	encodeVendorCookieValue,
	decodeVendorCookieValue,
	encodePublisherCookieValue,
	decodePublisherCookieValue
} from './cookieutils';

import { sendPortalCommand } from '../portal';
import config from '../config';
const metadata = require('../../../metadata.json');

const PUBLISHER_CONSENT_COOKIE_NAME = 'pubconsent';
const PUBLISHER_CONSENT_COOKIE_MAX_AGE = 33696000;

const VENDOR_CONSENT_COOKIE_NAME = 'euconsent';
const VENDOR_CONSENT_COOKIE_MAX_AGE = 33696000;


function encodeVendorIdsToBits(maxVendorId, selectedVendorIds = new Set()) {
	let vendorString = '';
	for (let id = 1; id <= maxVendorId; id++) {
		vendorString += (selectedVendorIds.has(id) ? '1' : '0');
	}
	return padRight(vendorString, Math.max(0, maxVendorId - vendorString.length));
}

function encodePurposeIdsToBits(purposes, selectedPurposeIds = new Set()) {
	const maxPurposeId = Math.max(0,
		...purposes.map(({id}) => id),
		...Array.from(selectedPurposeIds));
	let purposeString = '';
	for (let id = 1; id <= maxPurposeId; id++) {
		purposeString += (selectedPurposeIds.has(id) ? '1' : '0');
	}
	return purposeString;
}

function decodeBitsToIds(bitString) {
	return bitString.split('').reduce((acc, bit, index) => {
		if (bit === '1') {
			acc.add(index + 1);
		}
		return acc;
	}, new Set());
}

function convertVendorsToRanges(maxVendorId, selectedIds) {
	let range = [];
	const ranges = [];
	for (let id = 1; id <= maxVendorId; id++) {
		if (selectedIds.has(id)) {
			range.push(id);
		}

		// If the range has ended or at the end of vendors add entry to the list
		if ((!selectedIds.has(id) || id === maxVendorId) && range.length) {
			const startVendorId = range.shift();
			const endVendorId = range.pop();
			range = [];
			ranges.push({
				isRange: typeof endVendorId === 'number',
				startVendorId,
				endVendorId
			});
		}
	}
	return ranges;
}

function encodeVendorConsentData(vendorData) {
	const {vendorList = {}, selectedPurposeIds, selectedVendorIds, maxVendorId, cmpId, cmpVersion, cookieVersion} = vendorData;
	const {purposes = []} = vendorList;

	// Encode the data with and without ranges and return the smallest encoded payload
	const noRangesData = encodeVendorCookieValue({
		...vendorData,
		maxVendorId,
		cmpId,
		cmpVersion,
		cookieVersion,
		purposeIdBitString: encodePurposeIdsToBits(purposes, selectedPurposeIds),
		isRange: false,
		vendorIdBitString: encodeVendorIdsToBits(maxVendorId, selectedVendorIds)
	});

	const vendorRangeList = convertVendorsToRanges(maxVendorId, selectedVendorIds);
	const rangesData = encodeVendorCookieValue({
		...vendorData,
		maxVendorId,
		cmpId,
		cmpVersion,
		cookieVersion,
		purposeIdBitString: encodePurposeIdsToBits(purposes, selectedPurposeIds),
		isRange: true,
		defaultConsent: false,
		numEntries: vendorRangeList.length,
		vendorRangeList
	});

	return noRangesData.length < rangesData.length ? noRangesData : rangesData;
}

function decodeVendorConsentData(cookieValue, source) {
	const {
		cookieVersion,
		cmpId,
		cmpVersion,
		consentScreen,
		consentLanguage,
		vendorListVersion,
		purposeIdBitString,
		maxVendorId,
		created,
		lastUpdated,
		isRange,
		defaultConsent,
		vendorIdBitString,
		vendorRangeList
	} = decodeVendorCookieValue(cookieValue);

	const cookieData = {
		consentString: cookieValue,
		source,
		cookieVersion,
		cmpId,
		cmpVersion,
		consentScreen,
		consentLanguage,
		vendorListVersion,
		selectedPurposeIds: decodeBitsToIds(purposeIdBitString),
		maxVendorId,
		created,
		lastUpdated
	};


	if (isRange) {
		const idMap = vendorRangeList.reduce((acc, {isRange, startVendorId, endVendorId}) => {
			const lastVendorId = isRange ? endVendorId : startVendorId;
			for (let i = startVendorId; i <= lastVendorId; i++) {
				acc[i] = true;
			}
			return acc;
		}, {});

		cookieData.selectedVendorIds = new Set();
		for (let i = 0; i <= maxVendorId; i++) {
			if ((defaultConsent && !idMap[i]) ||
				(!defaultConsent && idMap[i])) {
				cookieData.selectedVendorIds.add(i);
			}
		}
	}
	else {
		cookieData.selectedVendorIds = decodeBitsToIds(vendorIdBitString);
	}

	return cookieData;
}

function encodePublisherConsentData(publisherData) {
	const {
		vendorList = {},
		customPurposeList = {},
		selectedPurposeIds,
		selectedCustomPurposeIds
	} = publisherData;
	const {purposes: customPurposes = []} = customPurposeList;
	const {purposes = []} = vendorList;

	return encodePublisherCookieValue({
		...publisherData,
		numCustomPurposes: customPurposes.length,
		standardPurposeIdBitString: encodePurposeIdsToBits(purposes, selectedPurposeIds),
		customPurposeIdBitString: encodePurposeIdsToBits(customPurposes, selectedCustomPurposeIds)
	});
}

function decodePublisherConsentData(cookieValue) {
	const {
		cookieVersion,
		cmpId,
		cmpVersion,
		consentScreen,
		consentLanguage,
		vendorListVersion,
		publisherPurposesVersion,
		created,
		lastUpdated,
		standardPurposeIdBitString,
		customPurposeIdBitString
	} = decodePublisherCookieValue(cookieValue);

	return {
		cookieVersion,
		cmpId,
		cmpVersion,
		consentScreen,
		consentLanguage,
		vendorListVersion,
		publisherPurposesVersion,
		created,
		lastUpdated,
		selectedPurposeIds: decodeBitsToIds(standardPurposeIdBitString),
		selectedCustomPurposeIds: decodeBitsToIds(customPurposeIdBitString)
	};

}

function readCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);

	if (parts.length === 2) {
		return parts.pop().split(';').shift();
	}
}

function writeCookie(name, value, maxAgeSeconds, path = '/') {
	const maxAge = maxAgeSeconds === null ? '' : `;max-age=${maxAgeSeconds}`;
	document.cookie = `${name}=${value};path=${path}${maxAge}`;
}

function readPublisherConsentCookie() {
	// If configured try to read publisher cookie
	if (config.storePublisherData) {
		const cookie = readCookie(PUBLISHER_CONSENT_COOKIE_NAME);
		log.debug('Read publisher consent data from local cookie', cookie);
		if (cookie) {
			return decodePublisherConsentData(cookie);
		}
	}
}

function writePublisherConsentCookie(publisherConsentData) {
	log.debug('Write publisher consent data to local cookie', publisherConsentData);
	writeCookie(PUBLISHER_CONSENT_COOKIE_NAME,
		encodePublisherConsentData(publisherConsentData),
		PUBLISHER_CONSENT_COOKIE_MAX_AGE,
		'/');
}


/**
 * Read vendor consent data from third-party cookie on the
 * global vendor list domain. Fallback to first-party cookie
 * if the operation fails.
 *
 * @returns Promise resolved with decoded cookie object
 */
function readGlobalVendorConsentCookie() {
	log.debug('Request consent data from global cookie');
	return sendPortalCommand({
		command: 'readVendorConsent',
	}).then(result => {
		log.debug('Read consent data from global cookie', result);
		if (result) {
			return decodeVendorConsentData(result, "global");
		}
		return readLocalVendorConsentCookie();
	}).catch(err => {
		log.error('Failed reading global vendor consent cookie', err);
	});
}

/**
 * Write vendor consent data to third-party cookie on the
 * global vendor list domain. Fallback to first-party cookie
 * if the operation fails.
 *
 * @returns Promise resolved after cookie is written
 */
function writeGlobalVendorConsentCookie(vendorConsentData) {
	log.debug('Write consent data to global cookie', vendorConsentData);
	return sendPortalCommand({
		command: 'writeVendorConsent',
		encodedValue: encodeVendorConsentData(vendorConsentData),
		vendorConsentData,
		cmpVersion: metadata.cmpVersion
	})
		.then((succeeded) => {
			if ( !succeeded ) {
				return writeLocalVendorConsentCookie(vendorConsentData);
			}
			return Promise.resolve();
		})
		.catch(err => {
			log.error('Failed writing global vendor consent cookie', err);
		});
}

/**
 * Read vendor consent data from first-party cookie on the
 * local domain.
 *
 * @returns Promise resolved with decoded cookie object
 */
function readLocalVendorConsentCookie() {
	const cookie = readCookie(VENDOR_CONSENT_COOKIE_NAME);
	log.debug('Read consent data from local cookie', cookie);
	return Promise.resolve(cookie && decodeVendorConsentData(cookie, "local"));
}

/**
 * Write vendor consent data to first-party cookie on the
 * local domain.
 *
 * @returns Promise resolved after cookie is written
 */
function writeLocalVendorConsentCookie(vendorConsentData) {
	log.debug('Write consent data to local cookie', vendorConsentData);
	return Promise.resolve(writeCookie(VENDOR_CONSENT_COOKIE_NAME,
		encodeVendorConsentData(vendorConsentData),
		VENDOR_CONSENT_COOKIE_MAX_AGE,
		'/'));
}

function readVendorConsentCookie() {
	return config.storeConsentGlobally ?
		readGlobalVendorConsentCookie() : readLocalVendorConsentCookie();
}

function writeVendorConsentCookie(vendorConsentData, pubvendors) {
	if (!pubvendors) {
		if (config.storeConsentGlobally) {
			if ( 	(config.globalVendorListLocation === metadata.globalVendorListLocation) ||
						(config.globalConsentLocation !== metadata.globalConsentLocation) ) {
				return writeGlobalVendorConsentCookie(vendorConsentData);
			}
		}
	}
	return writeLocalVendorConsentCookie(vendorConsentData);
}

export {
	writeCookie,
	encodeVendorConsentData,
	decodeVendorConsentData,

	convertVendorsToRanges,

	encodePublisherConsentData,
	decodePublisherConsentData,

	readGlobalVendorConsentCookie,
	writeGlobalVendorConsentCookie,
	readLocalVendorConsentCookie,
	writeLocalVendorConsentCookie,
	readVendorConsentCookie,
	writeVendorConsentCookie,

	readPublisherConsentCookie,
	writePublisherConsentCookie,

	PUBLISHER_CONSENT_COOKIE_NAME,
	VENDOR_CONSENT_COOKIE_NAME
};
