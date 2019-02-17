//jshint esversion:6
import Promise from 'promise-polyfill';
import log from '../log';
import {
  padRight,
  encodeVendorCookieValue,
  decodeVendorCookieValue,
  encodePublisherCookieValue,
  decodePublisherCookieValue,
} from './cookieutils';

import { sendPortalCommand } from '../portal';
import config from '../config';
const metadata = require('../../../metadata.json');

const PUBLISHER_CONSENT_COOKIE_NAME = 'pubconsent';
const PUBLISHER_CONSENT_COOKIE_MAX_AGE = 33696000;

const VENDOR_CONSENT_COOKIE_NAME = 'euconsent';
const VENDOR_CONSENT_COOKIE_MAX_AGE = 33696000;

const MAX_STANDARD_PURPOSE_ID = 24;
const START_CUSTOM_PURPOSE_ID = 25;

function encodeVendorIdsToBits(maxVendorId, selectedVendorIds = new Set()) {
  let vendorString = '';
  for (let id = 1; id <= maxVendorId; id++) {
    vendorString += selectedVendorIds.has(id) ? '1' : '0';
  }
  return padRight(vendorString, Math.max(0, maxVendorId - vendorString.length));
}

function encodePurposeIdsToBits(purposes, selectedPurposeIds = new Set()) {
  let purposeString = '';
  for (let id = 1; id <= MAX_STANDARD_PURPOSE_ID; id++) {
    purposeString += selectedPurposeIds.has(id) ? '1' : '0';
  }
  return purposeString;
}

function encodeCustomPurposeIdsToBits(
  purposes,
  selectedPurposeIds = new Set(),
) {
  const maxPurposeId = Math.max(
    0,
    ...purposes.map(({ id }) => id),
    ...Array.from(selectedPurposeIds),
  );
  let purposeString = '';
  for (let id = START_CUSTOM_PURPOSE_ID; id <= maxPurposeId; id++) {
    purposeString += selectedPurposeIds.has(id) ? '1' : '0';
  }
  return purposeString;
}

function decodeBitsToIds(bitString, addToIndex = 0) {
  return bitString.split('').reduce((acc, bit, index) => {
    if (bit === '1') {
      acc.add(index + addToIndex + 1);
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
        endVendorId,
      });
    }
  }
  return ranges;
}

function encodeVendorConsentData(vendorData) {
  const {
    vendorList = {},
    selectedPurposeIds,
    selectedVendorIds,
    maxVendorId,
    cmpId,
    cmpVersion,
    cookieVersion,
  } = vendorData;
  const { purposes = [] } = vendorList;

  // Encode the data with and without ranges and return the smallest encoded payload
  const noRangesData = encodeVendorCookieValue({
    ...vendorData,
    maxVendorId,
    cmpId,
    cmpVersion,
    cookieVersion,
    purposeIdBitString: encodePurposeIdsToBits(purposes, selectedPurposeIds),
    isRange: false,
    vendorIdBitString: encodeVendorIdsToBits(maxVendorId, selectedVendorIds),
  });

  const vendorRangeList = convertVendorsToRanges(
    maxVendorId,
    selectedVendorIds,
  );
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
    vendorRangeList,
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
    vendorRangeList,
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
    lastUpdated,
  };

  if (isRange) {
    const idMap = vendorRangeList.reduce(
      (acc, { isRange, startVendorId, endVendorId }) => {
        const lastVendorId = isRange ? endVendorId : startVendorId;
        for (let i = startVendorId; i <= lastVendorId; i++) {
          acc[i] = true;
        }
        return acc;
      },
      {},
    );

    cookieData.selectedVendorIds = new Set();
    for (let i = 0; i <= maxVendorId; i++) {
      if ((defaultConsent && !idMap[i]) || (!defaultConsent && idMap[i])) {
        cookieData.selectedVendorIds.add(i);
      }
    }
  } else {
    cookieData.selectedVendorIds = decodeBitsToIds(vendorIdBitString);
  }

  return cookieData;
}

function encodePublisherConsentData(publisherData) {
  const {
    vendorList = {},
    customPurposeList = {},
    selectedPurposeIds,
    selectedCustomPurposeIds,
  } = publisherData;
  const { purposes: customPurposes = [] } = customPurposeList;
  const { purposes = [] } = vendorList;

  return encodePublisherCookieValue({
    ...publisherData,
    numCustomPurposes: customPurposes.length,
    standardPurposeIdBitString: encodePurposeIdsToBits(
      purposes,
      selectedPurposeIds,
    ),
    customPurposeIdBitString: encodeCustomPurposeIdsToBits(
      customPurposes,
      selectedCustomPurposeIds,
    ),
  });
}

function decodePublisherConsentData(cookieValue, source) {
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
    customPurposeIdBitString,
  } = decodePublisherCookieValue(cookieValue);

  return {
    consentString: cookieValue,
    cookieVersion,
    cmpId,
    cmpVersion,
    consentScreen,
    consentLanguage,
    vendorListVersion,
    publisherPurposesVersion,
    created,
    lastUpdated,
    source,
    selectedPurposeIds: decodeBitsToIds(standardPurposeIdBitString),
    selectedCustomPurposeIds: decodeBitsToIds(
      customPurposeIdBitString,
      MAX_STANDARD_PURPOSE_ID,
    ),
  };
}

function readCookie(name) {
  const values = document.cookie.split('; ').reduce((acc, str) => {
    const pair = str.split('=');
    if (pair[0] === name) {
      acc.push(pair[1]);
    }
    return acc;
  }, []);

  if (values.length > 0) {
    return values.pop();
  }

  return null;
}

function writeCookie(name, value, maxAgeSeconds, path = '/') {
  const maxAge = maxAgeSeconds === null ? '' : `;max-age=${maxAgeSeconds}`;
  document.cookie = `${name}=${value};path=${path}${maxAge}`;
}

/**
 * Read publisher consent data from third-party cookie on the
 * configured third party domain. Fallback to first-party cookie
 * if the operation fails.
 *
 * @returns Promise resolved with decoded cookie object
 */
function readGlobalPublisherConsentCookie() {
  log.debug('Request publisher consent data from global cookie');
  return sendPortalCommand({
    command: 'readPublisherConsent',
  })
    .then(result => {
      log.debug('Read publisher consent data from global cookie', result);
      if (result) {
        return decodePublisherConsentData(result, 'global');
      }
      return readLocalPublisherConsentCookie();
    })
    .catch(err => {
      log.error('Failed reading third party publisher consent cookie', err);
    });
}

/**
 * Write publisher consent data to third-party cookie on the
 * configured third party domain. Fallback to first-party cookie
 * if the operation fails.
 *
 * @returns Promise resolved after cookie is written
 */
function writeGlobalPublisherConsentCookie(publisherConsentData) {
  log.debug(
    'Write publisher consent data to third party cookie',
    publisherConsentData,
  );
  return sendPortalCommand({
    command: 'writePublisherConsent',
    encodedValue: encodePublisherConsentData(publisherConsentData),
    publisherConsentData,
  })
    .then(succeeded => {
      if (!succeeded) {
        return writeLocalPublisherConsentCookie(publisherConsentData);
      }
      return Promise.resolve();
    })
    .catch(err => {
      log.error('Failed writing third party publisher consent cookie', err);
    });
}

function readLocalPublisherConsentCookie() {
  // If configured try to read publisher cookie
  const cookie = readCookie(PUBLISHER_CONSENT_COOKIE_NAME);
  log.debug('Read publisher consent data from local cookie', cookie);
  return Promise.resolve(cookie && decodePublisherConsentData(cookie, 'local'));
}

function writeLocalPublisherConsentCookie(publisherConsentData) {
  log.debug(
    'Write publisher consent data to local cookie',
    publisherConsentData,
  );
  return Promise.resolve(
    writeCookie(
      PUBLISHER_CONSENT_COOKIE_NAME,
      encodePublisherConsentData(publisherConsentData),
      PUBLISHER_CONSENT_COOKIE_MAX_AGE,
      '/',
    ),
  );
}

function readPublisherConsentCookie() {
  if (config.storePublisherData) {
    return config.storePublisherConsentGlobally
      ? readGlobalPublisherConsentCookie()
      : readLocalPublisherConsentCookie();
  }
  return Promise.resolve();
}

function writePublisherConsentCookie(publisherConsentData) {
  if (config.storePublisherData) {
    return config.storePublisherConsentGlobally
      ? writeGlobalPublisherConsentCookie(publisherConsentData)
      : writeLocalPublisherConsentCookie(publisherConsentData);
  }
  return Promise.resolve();
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
  })
    .then(result => {
      log.debug('Read consent data from global cookie', result);
      if (result) {
        return decodeVendorConsentData(result, 'global');
      }
      return readLocalVendorConsentCookie();
    })
    .catch(err => {
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
    cmpVersion: metadata.cmpVersion,
  })
    .then(succeeded => {
      if (!succeeded) {
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
  return Promise.resolve(cookie && decodeVendorConsentData(cookie, 'local'));
}

/**
 * Write vendor consent data to first-party cookie on the
 * local domain.
 *
 * @returns Promise resolved after cookie is written
 */
function writeLocalVendorConsentCookie(vendorConsentData) {
  log.debug('Write consent data to local cookie', vendorConsentData);
  return Promise.resolve(
    writeCookie(
      VENDOR_CONSENT_COOKIE_NAME,
      encodeVendorConsentData(vendorConsentData),
      VENDOR_CONSENT_COOKIE_MAX_AGE,
      '/',
    ),
  );
}

function readVendorConsentCookie() {
  return config.storeConsentGlobally
    ? readGlobalVendorConsentCookie()
    : readLocalVendorConsentCookie();
}

function writeVendorConsentCookie(vendorConsentData) {
  if (config.duplicateConsent) {
    return writeGlobalVendorConsentCookie(vendorConsentData).then(() =>
      writeLocalVendorConsentCookie(vendorConsentData),
    );
  }
  return config.storeConsentGlobally &&
    (config.globalVendorListLocation === metadata.globalVendorListLocation ||
      config.globalConsentLocation !== metadata.globalConsentLocation)
    ? writeGlobalVendorConsentCookie(vendorConsentData)
    : writeLocalVendorConsentCookie(vendorConsentData);
}

export {
  readCookie,
  writeCookie,
  encodeVendorConsentData,
  decodeVendorConsentData,
  convertVendorsToRanges,
  encodePublisherConsentData,
  decodePublisherConsentData,
  readGlobalVendorConsentCookie,
  readGlobalPublisherConsentCookie,
  readLocalPublisherConsentCookie,
  writeGlobalVendorConsentCookie,
  readLocalVendorConsentCookie,
  writeLocalVendorConsentCookie,
  readVendorConsentCookie,
  writeVendorConsentCookie,
  readPublisherConsentCookie,
  writePublisherConsentCookie,
  PUBLISHER_CONSENT_COOKIE_NAME,
  VENDOR_CONSENT_COOKIE_NAME,
};
