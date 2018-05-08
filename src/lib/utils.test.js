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


describe('utils', () => {
	describe('checkIfGDPRApplies', () => {
		beforeEach(() => {
			window.fetch = jest.fn().mockImplementation(() => Promise.resolve({ headers: new Map([]) }));
			Object.defineProperty(window.navigator, 'languages', {
				get: () => [ 'lt' ]
			});
		});

		it('returns value from browser languages', (done) => {
			checkIfGDPRApplies('url', (res) => {
				expect(res).eq(true);
				done();
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
				expect(res).eq(false);
				done();
			});
		});

		it('supports callback api', (done) => {
			checkIfUserInEU('url', (res) => {
				expect(res).eq(false);
				done();
			});
		});

		it('returns true for EU countries', (done) => {
			window.fetch.mockImplementation(() => Promise.resolve({ headers: new Map([ [ 'X-GeoIP-Country', 'LT' ] ]) }));
			checkIfUserInEU('url', (res) => {
				expect(res).eq(true);
			}).then(res => {
				expect(res).eq(true);
				done();
			});
		});
	});

	describe('getConsentsCount', () => {
		let consentObject;
		beforeEach(() => {
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
			expect(getConsentsCount(consentObject).total).eq(16);
			consentObject.customPurposes['4'] = true;
			expect(getConsentsCount(consentObject).total).eq(17);
			delete consentObject.vendorConsents;
			expect(getConsentsCount(consentObject).total).eq(11);
		});

		it('returns amount of required granted consents', () => {
			expect(getConsentsCount(consentObject).consented).eq(12);
			consentObject.customPurposes['4'] = true;
			expect(getConsentsCount(consentObject).consented).eq(13);
			delete consentObject.vendorConsents;
			expect(getConsentsCount(consentObject).consented).eq(9);
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
		 });
	});

	describe('getTimestamp', () => {
		 it('returns timestamp for provided date string', () => {
			expect(getTimestamp('Tue May 08 2018 21:06:12 GMT+0300 (EEST)')).eq(1525802772000);
			expect(getTimestamp(0)).eq(0);
		 });
	});
});
