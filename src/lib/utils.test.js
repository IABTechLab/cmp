//jshint esversion:6
/* eslint-disable max-nested-callbacks */

import { expect } from 'chai';

import {
	checkReprompt,
	checkIfGDPRApplies,
	checkIfLanguageLocaleApplies,
	checkIfUserInEU,
	getAmountOfConsentGiven,
	checkIfCookieIsOld,
	getTimestamp,
	getConsentsCount
} from './utils';
import config from './config';

let vendorList = {vendors: [{id: 1}, {id: 3}, {id: 4}]};

describe('utils', () => {
	describe('checkReprompt', () => {
		let { repromptOptions } = config;

		it('returns true if there are no cookies set', () => {
			const vendorConsent = {
				"purposeConsents": {
					"1": false
				},
				"vendorConsents": {
					"1": false,
				}
			};
			const publisherConsent = {
				"customPurposes": {
					"1": false,
				},
				"standardPurposes": {
					"1": false,
				}
			};
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(true);
		});

		it('returns true if atleast one cookie is not set', () => {
			const vendorConsent = {
				"purposeConsents": {
					"1": false
				},
				"vendorConsents": {
					"1": false,
				}
			};
			const publisherConsent = {
				"lastUpdated": Date.now(),
				"customPurposes": {
					"1": false,
				},
				"standardPurposes": {
					"1": false,
				}
			};
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(true);
		});

		it('returns false if for new cookies', () => {
			const vendorConsent = {
				"lastUpdated": Date.now(),
				"purposeConsents": {
					"1": false
				},
				"vendorConsents": {
					"1": false,
				}
			};
			const publisherConsent = {
				"lastUpdated": Date.now(),
				"customPurposes": {
					"1": true,
				},
				"standardPurposes": {
					"1": false,
				}
			};
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(false);
		});

		it('handles reprompt options', () => {
			const day = 1000 * 60 * 60 * 24;
			const vendorConsent = {
				"lastUpdated": Date.now() - 29 * day,
				"purposeConsents": {
					"1": true
				},
				"vendorConsents": {
					"1": true,
					"2": false,
					"3": true,
					"4": true,
				}
			};
			const publisherConsent = {
				"lastUpdated": Date.now(),
				"customPurposes": {
					"1": true,
				},
				"standardPurposes": {
					"1": true,
				}
			};

			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(false);

			vendorConsent.lastUpdated = Date.now() - 100 * day;
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(false);

			vendorConsent.lastUpdated = Date.now() - 361 * day;
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(true);
			vendorConsent.lastUpdated = Date.now() - 500 * day;
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(true);

			vendorConsent.purposeConsents['1'] = false;
			vendorConsent.lastUpdated = Date.now() - 29 * day;
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(false);
			vendorConsent.lastUpdated = Date.now() - 31 * day;
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(true);

			vendorConsent.vendorConsents['1'] = false;
			publisherConsent.customPurposes['1'] = false;
			publisherConsent.standardPurposes['1'] = false;
			vendorConsent.lastUpdated = Date.now() - 29 * day;
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(false);
			vendorConsent.lastUpdated = Date.now() - 31 * day;
			expect(checkReprompt(repromptOptions, vendorList, vendorConsent, publisherConsent)).eq(true);
		});
	});

	describe('checkIfGDPRApplies', () => {
		const returnValues = [ [ 'en-GB' ], ['fr-BE'], 'lt', 'en-US' ];

		beforeEach(() => {
			window.fetch = jest.fn().mockImplementation(() => Promise.resolve({ headers: new Map([]) }));
			const langMock = jest.fn();
			langMock.mockImplementation(() => returnValues.shift());
			Object.defineProperty(window.navigator, 'languages', {
				get: langMock,
				configurable: true
			});
			Object.defineProperty(window.navigator, 'browserLanguage', {
				get: langMock,
				configurable: true
			});
		});

		it('returns value from browser languages', (done) => {
			checkIfGDPRApplies('url', (res) => {
				expect(res.applies).eq(true);
				expect(res.language).eq(true);
				expect(res.location).eq(false);
				expect(window.fetch.mock.calls.length).to.equal(0);
				done();
			});
		});

		it('handles Internet Explorer navigator implementation', (done) => {
			checkIfGDPRApplies('url', (res) => {
				expect(res.applies).eq(true);
				expect(res.language).eq(true);
				expect(res.location).eq(false);
				expect(window.fetch.mock.calls.length).to.equal(0);
				done();
			});
		});

		it('fallbacks to ip resolution', (done) => {
			checkIfGDPRApplies('url', (res) => {

				expect(res).eq(false);
				expect(window.fetch.mock.calls.length).to.equal(1);

				window.fetch.mockImplementation(() => Promise.resolve({ headers: new Map([ [ 'X-GeoIP-Country', 'LT' ] ]) }));
				checkIfGDPRApplies('url', (res) => {
					expect(res.applies).eq(true);
					expect(res.language).eq(false);
					expect(res.location).eq(true);
					expect(window.fetch.mock.calls.length).to.equal(2);
					done();
				});
			});
		});
	});

	describe('checkIfUserInEU', () => {
		beforeEach(() => {
			window.fetch = jest.fn().mockImplementation(() => Promise.resolve({ headers: new Map([]) }));
		});

		it('returns promise', (done) => {
			expect(checkIfUserInEU('url', () => {})).be.a('promise');
			checkIfUserInEU('url', () => {}).then(res => {
				expect(res.applies).eq(false);
				expect(res.language).eq(false);
				expect(res.location).eq(false);
				done();
			});
		});

		it('supports callback api', (done) => {
			checkIfUserInEU('url', (res) => {
				expect(res.applies).eq(false);
				expect(res.language).eq(false);
				expect(res.location).eq(false);
				done();
			});
		});

		it('returns true for EU countries', (done) => {
			window.fetch.mockImplementation(() => Promise.resolve({ headers: new Map([ [ 'X-GeoIP-Country', 'LT' ] ]) }));
			checkIfUserInEU('url', (res) => {
				expect(res.applies).eq(true);
				expect(res.language).eq(false);
				expect(res.location).eq(true);
			}).then(res => {
				expect(res.applies).eq(true);
				expect(res.language).eq(false);
				expect(res.location).eq(true);
				done();
			});
		});
	});

	describe('getConsentsCount', () => {
		let consentObject;
		beforeEach(() => {
			vendorList = {
				vendors: [
					{id: 1},
					{id: 2},
					{id: 3},
					{id: 4},
					{id: 5},
					{id: 6}
				]
			};
			consentObject = {
				"cookieVersion": 1,
				"cmpId": 1,
				"vendorListVersion": 1,
				"maxVendorId": 6,
				"purposeConsents": {
					"1": true,
					"2": true,
					"3": true,
					"4": true,
					"5": true
				},
				"vendorConsents": {
					"1": false,
					"2": true,
					"3": true,
					"4": false,
					"5": true,
					"6": true
				},
				"customPurposes": {
					"1": false,
					"2": false
				},
				"standardPurposes": {
					"1": true,
					"2": true,
					"3": true
				}
			 };
		});

		it('returns total amount of required consents', () => {
			expect(getConsentsCount(consentObject, vendorList).total).eq(16);
			consentObject.customPurposes['4'] = true;
			expect(getConsentsCount(consentObject, vendorList).total).eq(17);
			delete consentObject.vendorConsents;
			expect(getConsentsCount(consentObject, vendorList).total).eq(11);
		});

		it('returns amount of required granted consents', () => {
			expect(getConsentsCount(consentObject, vendorList).consented).eq(12);
			consentObject.customPurposes['4'] = true;
			expect(getConsentsCount(consentObject, vendorList).consented).eq(13);
			delete consentObject.vendorConsents;
			expect(getConsentsCount(consentObject, vendorList).consented).eq(9);
		});
	});

	describe('checkIfLanguageLocaleApplies', () => {
		it('returns true or false depending on if the language locale is a known locale in the EU', () => {
			expect(checkIfLanguageLocaleApplies(["en-US", "ja"])).to.eq(false);
			expect(checkIfLanguageLocaleApplies(["en-US", "pt-BR", "cy", "es-mx"])).to.eq(true);
		});
	});

	describe('getAmountOfConsentGiven', () => {
		 it('returns the amount of consent given to look up in the configuration object for how long it should be before the user is reprompted', () => {
			expect(getAmountOfConsentGiven(10, 9)).to.eq('someConsentGiven');
			expect(getAmountOfConsentGiven(10, 10)).to.eq('fullConsentGiven');
			expect(getAmountOfConsentGiven(10, 0)).to.eq('noConsentGiven');
		 });
	});

	describe('checkIfCookieIsOld', () => {
		 it('returns whether or not the cookie is old enough to reprompt the user for consent', () => {
			const day = 1000 * 60 * 60 * 24;
			expect(checkIfCookieIsOld(0, 3)).eq(true);
			expect(checkIfCookieIsOld(Date.now(), 3)).eq(false);
			expect(checkIfCookieIsOld(Date.now() - day * 2, 3)).eq(false);
			expect(checkIfCookieIsOld(Date.now() - day * 4, 3)).eq(true);
			expect(checkIfCookieIsOld(Date.now() - day * 4, 400)).eq(false);
		 });
	});

	describe('getTimestamp', () => {
		 it('returns timestamp for provided date string', () => {
			expect(getTimestamp('Tue May 08 2018 21:06:12 GMT+0300 (EEST)')).eq(1525802772000);
			expect(getTimestamp(0)).eq(0);
		 });
	});
});
