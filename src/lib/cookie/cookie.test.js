/* eslint-disable max-nested-callbacks */
import { expect } from 'chai';
import customPurposeList from '../../docs/assets/purposes.json';
import config from '../config';

import {
  readCookie,
  writeCookie,
  encodeVendorConsentData,
  decodeVendorConsentData,
  encodePublisherConsentData,
  decodePublisherConsentData,
  writeVendorConsentCookie,
  writePublisherConsentCookie,
  readPublisherConsentCookie,
  readVendorConsentCookie,
  convertVendorsToRanges,
  PUBLISHER_CONSENT_COOKIE_NAME,
  VENDOR_CONSENT_COOKIE_NAME,
} from './cookie';

jest.mock('../portal');
const mockPortal = require('../portal');

const vendorList = {
  version: 1,
  origin: 'http://ib.adnxs.com/vendors.json',
  purposes: [
    {
      id: 1,
      name: 'Accessing a Device or Browser',
    },
    {
      id: 2,
      name: 'Advertising Personalisation',
    },
    {
      id: 3,
      name: 'Analytics',
    },
    {
      id: 4,
      name: 'Content Personalisation',
    },
  ],
  vendors: [
    {
      id: 1,
      name: 'Globex',
    },
    {
      id: 2,
      name: 'Initech',
    },
    {
      id: 3,
      name: 'CRS',
    },
    {
      id: 4,
      name: 'Umbrella',
    },
    {
      id: 10,
      name: 'Pierce and Pierce',
    },
    {
      id: 8,
      name: 'Aperture',
    },
  ],
};

describe('cookie', () => {
  const aDate = new Date('2018-07-15 PDT');

  beforeEach(() => {
    // Reset url
    window.history.pushState({}, '', '/');
    // Remove all cookies
    const value = document.cookie.split(';');
    value.forEach(cookie => {
      const parts = cookie.trim().split('=');
      if (parts.length === 2) {
        writeCookie(parts[0], '', 0);
      }
    });
    mockPortal.sendPortalCommand = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
  });

  it('can read a cookie based on its name', () => {
    document.cookie = `${VENDOR_CONSENT_COOKIE_NAME}=consentstring;path=/`;
    const cookieValue = readCookie(VENDOR_CONSENT_COOKIE_NAME);

    expect(cookieValue).to.equal('consentstring');
  });

  it('it returns the last occurence, if there are multiple cookies with the same name', () => {
    window.history.pushState({}, '', '/random/cookie/path');

    document.cookie = `${VENDOR_CONSENT_COOKIE_NAME}=consentstringwithoutpathset`;
    document.cookie = `${VENDOR_CONSENT_COOKIE_NAME}=consentstringwithpathset;path=/`;

    const cookieValue = readCookie(VENDOR_CONSENT_COOKIE_NAME);
    expect(cookieValue).to.equal('consentstringwithpathset');
  });

  it('encodes and decodes the vendor cookie object back to original value', () => {
    const vendorConsentData = {
      cookieVersion: 1,
      cmpId: 1,
      cmpVersion: 1,
      consentScreen: 2,
      consentLanguage: 'DE',
      vendorListVersion: 1,
      maxVendorId: vendorList.vendors[vendorList.vendors.length - 1].id,
      created: aDate,
      lastUpdated: aDate,
      selectedPurposeIds: new Set([1, 2]),
      selectedVendorIds: new Set([1, 2, 4]),
    };

    const encodedString = encodeVendorConsentData({
      ...vendorConsentData,
      vendorList,
    });
    const decoded = decodeVendorConsentData(encodedString, 'local');
    const output = Object.assign(
      { consentString: encodedString, source: 'local' },
      vendorConsentData,
    );

    expect(decoded).to.deep.equal(output);
  });

  it('encodes and decodes the publisher cookie object back to original value', () => {
    const vendorConsentData = {
      cookieVersion: 1,
      cmpId: 15,
      cmpVersion: 1,
      consentScreen: 0,
      consentLanguage: 'EN',
      vendorListVersion: 1,
      created: aDate,
      lastUpdated: aDate,
      selectedPurposeIds: new Set([1, 2]),
    };

    const publisherConsentData = {
      cookieVersion: 1,
      cmpId: 15,
      vendorListVersion: 1,
      publisherPurposesVersion: 1,
      created: aDate,
      lastUpdated: aDate,
      source: 'local',
      selectedCustomPurposeIds: new Set([25, 26]),
    };

    const encodedString = encodePublisherConsentData({
      ...vendorConsentData,
      ...publisherConsentData,
      vendorList,
      customPurposeList,
    });
    const decoded = decodePublisherConsentData(encodedString, 'local');

    expect(decoded).to.deep.include({
      ...vendorConsentData,
      ...publisherConsentData,
    });
  });

  it('writes and reads the local cookie when globalConsent = false', () => {
    config.update({
      storeConsentGlobally: false,
    });

    const vendorConsentData = {
      cookieVersion: 1,
      cmpId: 1,
      vendorListVersion: 1,
      created: aDate,
      lastUpdated: aDate,
    };

    return writeVendorConsentCookie(vendorConsentData).then(() => {
      return readVendorConsentCookie().then(fromCookie => {
        expect(document.cookie).to.contain(VENDOR_CONSENT_COOKIE_NAME);
        expect(fromCookie).to.deep.include(vendorConsentData);
      });
    });
  });

  it('writes the global cookie to the local domain when globalConsent = true and writing to portal domain is unsupported', () => {
    config.update({
      storeConsentGlobally: true,
    });

    const vendorConsentData = {
      cookieVersion: 1,
      cmpId: 1,
      vendorListVersion: 1,
      created: aDate,
      lastUpdated: aDate,
    };

    return writeVendorConsentCookie(vendorConsentData).then(() => {
      expect(
        mockPortal.sendPortalCommand.mock.calls[0][0].command,
      ).to.deep.equal('writeVendorConsent');
      expect(document.cookie).to.contain(VENDOR_CONSENT_COOKIE_NAME);
    });
  });

  it('reads the global cookie when globalConsent = true', () => {
    config.update({
      storeConsentGlobally: true,
    });

    const vendorConsentData = {
      cookieVersion: 1,
      cmpId: 1,
      vendorListVersion: 1,
      created: aDate,
      lastUpdated: aDate,
    };

    return readVendorConsentCookie(vendorConsentData).then(() => {
      expect(
        mockPortal.sendPortalCommand.mock.calls[0][0].command,
      ).to.deep.equal('readVendorConsent');
    });
  });

  it('writes and reads the publisher consent cookie locally', () => {
    config.update({
      storePublisherConsentGlobally: false,
      storePublisherData: true,
    });

    const publisherConsentData = {
      cookieVersion: 1,
      cmpId: 15,
      cmpVersion: 2,
      consentScreen: 1,
      consentLanguage: 'EN',
      vendorListVersion: 1,
      publisherPurposesVersion: 1,
      created: aDate,
      lastUpdated: aDate,
      source: 'local',
      vendorList,
      customPurposeList,
      selectedPurposeIds: new Set([1, 2]),
      selectedCustomPurposeIds: new Set([25, 26]),
    };

    return writePublisherConsentCookie(publisherConsentData).then(() => {
      return readPublisherConsentCookie().then(cookie => {
        expect(document.cookie).to.contain(PUBLISHER_CONSENT_COOKIE_NAME);
        expect(cookie).to.deep.include({
          cookieVersion: 1,
          cmpId: 15,
          cmpVersion: 2,
          consentScreen: 1,
          consentLanguage: 'EN',
          vendorListVersion: 1,
          publisherPurposesVersion: 1,
          created: aDate,
          lastUpdated: aDate,
          source: 'local',
          selectedPurposeIds: new Set([1, 2]),
          selectedCustomPurposeIds: new Set([25, 26]),
        });
      });
    });
  });

  it('writes and reads the publisher consent cookie on a third party domain', () => {
    config.update({
      storePublisherConsentGlobally: true,
      globalPublisherConsentLocation: 'https://www.example.com',
      storePublisherData: true,
    });

    const publisherConsentData = {
      cmpId: 1,
      vendorListVersion: 1,
      publisherPurposesVersion: 1,
      created: aDate,
      lastUpdated: aDate,
      source: 'global',
    };

    return writePublisherConsentCookie(publisherConsentData).then(() => {
      expect(
        mockPortal.sendPortalCommand.mock.calls[0][0].command,
      ).to.deep.equal('writePublisherConsent');
      expect(document.cookie).to.contain(PUBLISHER_CONSENT_COOKIE_NAME);
    });
  });

  it('converts selected vendor list to a range', () => {
    const maxVendorId = Math.max(
      ...vendorList.vendors.map(vendor => vendor.id),
    );
    const ranges = convertVendorsToRanges(maxVendorId, new Set([2, 3, 4]));

    expect(ranges).to.deep.equal([
      {
        isRange: true,
        startVendorId: 2,
        endVendorId: 4,
      },
    ]);
  });

  it('converts selected vendor list to multiple ranges', () => {
    const maxVendorId = Math.max(
      ...vendorList.vendors.map(vendor => vendor.id),
    );
    const ranges = convertVendorsToRanges(
      maxVendorId,
      new Set([2, 3, 5, 6, 10]),
    );

    expect(ranges).to.deep.equal([
      {
        isRange: true,
        startVendorId: 2,
        endVendorId: 3,
      },
      {
        isRange: true,
        startVendorId: 5,
        endVendorId: 6,
      },
      {
        isRange: false,
        startVendorId: 10,
        endVendorId: undefined,
      },
    ]);
  });
});
