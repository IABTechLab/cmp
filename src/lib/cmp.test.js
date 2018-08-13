/* eslint-disable max-nested-callbacks */

import { expect } from 'chai';
import customPurposeList from '../docs/assets/purposes.json';

jest.mock('./utils');
import Store from './store';
import Cmp from './cmp';

jest.setTimeout(100);
jest.mock('./log');
const mockLog = require('./log').default;

const vendorList = {
	"version": 1,
	"origin": "http://ib.adnxs.com/vendors.json",
	"purposes": [
		{
			"id": 1,
			"name": "Accessing a Device or Browser"
		},
		{
			"id": 2,
			"name": "Advertising Personalisation"
		},
		{
			"id": 3,
			"name": "Analytics"
		},
		{
			"id": 4,
			"name": "Content Personalisation"
		}
	],
	"vendors": [
		{
			"id": 1,
			"name": "Globex"
		},
		{
			"id": 2,
			"name": "Initech"
		},
		{
			"id": 3,
			"name": "CRS"
		},
		{
			"id": 4,
			"name": "Umbrella"
		},
		{
			"id": 5,
			"name": "Aperture"
		},
		{
			"id": 6,
			"name": "Pierce and Pierce"
		}
	]
};

describe('cmp', () => {

	let cmp;
	let config = {
		repromptOptions: {
			fullConsentGiven: 30,
			someConsentGiven: 20,
			noConsentGiven: 1
		},
		geoIPVendor: 'http://cmp.digitru.st/geoip.json',
		storeConsentGlobally: false,
		gdprAppliesGlobally: false,
		copy: jest.fn().mockReturnValue('copy')
	};

	beforeEach(() => {
		cmp = new Cmp(new Store({ vendorList, customPurposeList }), config);
		cmp.store.persist();
	});

	describe('processCommand', () => {

		it('logs error on invalid command', () => {
			mockLog.error = jest.fn();
			cmp.processCommand('fakeCommand');
			expect(mockLog.error.mock.calls[0][0]).to.contain('Invalid CMP command');
		});

		it('getPublisherConsents executes', (done) => {
			cmp.processCommand('getPublisherConsents', null, data => {
				expect(Object.keys(data.standardPurposes).length).to.equal(24); // Per the spec, future purposes may be added, up to 24 total
				expect(Object.keys(data.customPurposes).length).to.equal(customPurposeList.purposes.length);
				done();
			});
		});

		it('ping executes', (done) => {
			cmp.processCommand('ping', null, (data, success) => {
				expect(success).to.be.true;
				expect(Object.keys(data)).to.deep.equal(['gdprAppliesGlobally', 'cmpLoaded']);
				expect(data.gdprAppliesGlobally).to.eq(false);

				cmp.processCommand('ping', (data, success) => {
					expect(Object.keys(data)).to.deep.equal(['gdprAppliesGlobally', 'cmpLoaded']);
					expect(success).to.be.true;
					done();
				});
			});
		});

		it('gdprInScope executes', (done) => {
			cmp.processCommand('gdprInScope', null, (response, success) => {
				expect(success).to.eq(true);
				expect(Object.keys(response)).to.deep.equal(['cmpShown', 'gdprAppliesGlobally', 'gdprAppliesLanguage', 'gdprAppliesLocation', 'submitted']);
				expect(response.submitted).to.eq(false);
				done();
			});
		});

		it('getPublisherConsents returns only persisted data', (done) => {
			cmp.store.selectPurpose(1, false);
			cmp.processCommand('getPublisherConsents', null, data => {
				expect(data.standardPurposes['1']).to.be.true;
				cmp.store.persist();

				cmp.processCommand('getPublisherConsents', null, data => {
					expect(data.standardPurposes['1']).to.be.false;
					done();
				});
			});
		});

		it('getVendorConsents executes', (done) => {
			cmp.processCommand('getVendorConsents', null, data => {
				expect(Object.keys(data.purposeConsents).length).to.equal(vendorList.purposes.length);
				expect(Object.keys(data.vendorConsents).length).to.equal(vendorList.vendors.length);
				done();
			});
		});

		it('getVendorConsents returns only persisted data', (done) => {
			cmp.store.selectVendor(1, false);
			cmp.processCommand('getVendorConsents', null, data => {
				expect(data.vendorConsents['1']).to.be.true;
				cmp.store.persist();

				cmp.processCommand('getVendorConsents', null, data => {
					expect(data.vendorConsents['1']).to.be.false;
					done();
				});
			});
		});

		it('decodeMetadata executes', (done) => {
			cmp.processCommand('decodeMetadata', null, (data, success) => {
				expect(Object.keys(data)).to.deep.eq([
					"cookieVersion",
					"created",
					"lastUpdated",
					"cmpId",
					"cmpVersion",
					"consentScreen",
					"consentLanguage",
					"vendorListVersion",
					"publisherPurposesVersion",
				]);
				expect(success).to.be.true;
				done();
			});
		});

		it('decodeMetadata params are optional', (done) => {
			cmp.processCommand('decodeMetadata', (data, success) => {
				expect(Object.keys(data)).to.deep.eq([
					"cookieVersion",
					"created",
					"lastUpdated",
					"cmpId",
					"cmpVersion",
					"consentScreen",
					"consentLanguage",
					"vendorListVersion",
					"publisherPurposesVersion",
				]);
				expect(success).to.be.true;
				done();
			});
		});

		it('getConsentData executes', (done) => {
			cmp.processCommand('getConsentData', null, data => {
				expect(typeof data.consentData).to.equal('string');
				done();
			});
		});

		it('getConsentData returns persisted data', (done) => {
			cmp.store.persist();
			cmp.processCommand('getConsentData', null, data => {
				expect(typeof data.consentData).to.equal('string');
				done();
			});
		});

		it('getVendorList executes', (done) => {
			cmp.processCommand('getVendorList', null, data => {
				expect(data.purposes).to.deep.equal(vendorList.purposes);
				expect(data.vendors).to.deep.equal(vendorList.vendors);
				done();
			});
		});

		it('showConsentTool executes', (done) => {
			cmp.processCommand('showConsentTool', null, data => {
				expect(data).to.be.true;
				expect(cmp.store.isConsentToolShowing).to.be.true;
				expect(cmp.cmpShown).to.be.true;
				done();
			});
		});

		it('getConfig', (done) => {
			cmp.processCommand('getConfig', null, response => {
				expect(response).to.equal('copy');
				done();
			});
		});

		describe('addEventListener', () => {

			it('only adds the callback instance once', () => {
				const callback = () => {};

				cmp.processCommand('addEventListener', 'isLoaded', callback);
				cmp.processCommand('addEventListener', 'isLoaded', callback);

				expect(cmp.eventListeners.isLoaded.size).to.equal(1);
			});
		});

		describe('removeEventListener', () => {

			it('removes a specific callback instance', () => {
				const callback = () => {};

				cmp.processCommand('addEventListener', 'isLoaded', callback);
				expect(cmp.eventListeners.isLoaded.size).to.equal(1);

				cmp.processCommand('removeEventListener', 'isLoaded', callback);

				expect(cmp.eventListeners.isLoaded.size).to.equal(0);
			});

			it('removes all listeners of specific event', () => {

				cmp.processCommand('addEventListener', 'isLoaded', () => {});
				cmp.processCommand('addEventListener', 'isLoaded', () => {});
				expect(cmp.eventListeners.isLoaded.size).to.equal(2);

				cmp.processCommand('removeEventListener', 'isLoaded');

				expect(cmp.eventListeners.isLoaded.size).to.equal(0);
			});

			it('removes all listeners for all events', () => {

				cmp.processCommand('addEventListener', 'isLoaded', () => {});
				cmp.processCommand('addEventListener', 'onSubmit', () => {});
				expect(cmp.eventListeners.isLoaded.size).to.equal(1);
				expect(cmp.eventListeners.onSubmit.size).to.equal(1);

				cmp.processCommand('removeEventListener');

				expect(cmp.eventListeners).to.deep.equal({});
			});
		});

		describe('renderCmpIfNeeded', () => {
			let _cmp, checkReprompt, checkIfGDPRApplies;
			beforeEach(() => {
				_cmp = window.__cmp = jest.fn().mockImplementation((a, b) => { b(); });
				const utils = require('./utils');
				checkReprompt = utils.checkReprompt;
				checkIfGDPRApplies = utils.checkIfGDPRApplies;

				config.gdprAppliesGlobally = false;
				config.testingMode = 'normal';

				checkReprompt.mockReturnValue(true);
				checkIfGDPRApplies.mockImplementation((a, b) => { b(true); });
				Object.defineProperty(window.navigator, 'cookieEnabled', {
					get: () => true,
					configurable: true
				});
			});

			it('renders cmp toolbox if gdprAppliesGlobally', () => {
				config.gdprAppliesGlobally = true;
				cmp.processCommand('renderCmpIfNeeded');

				expect(_cmp.mock.calls.length).to.eq(1);
				expect(_cmp.mock.calls[0][0]).to.eq('showConsentTool');
			});

			it('renders cmp toolbox if user is in EU', () => {
				cmp.processCommand('renderCmpIfNeeded');

				expect(_cmp.mock.calls.length).to.eq(1);
				expect(_cmp.mock.calls[0][0]).to.eq('showConsentTool');
			});

			it('not renders cmp toolbox if user was alredy prompted', () => {
				checkReprompt.mockReturnValue(false);
				cmp.processCommand('renderCmpIfNeeded');
				config.gdprAppliesGlobally = true;
				cmp.processCommand('renderCmpIfNeeded', null, () => {});
				expect(_cmp.mock.calls.length).to.eq(0);
			});

			it('not renders cmp toolbox __cmp not initialised', () => {
				window.__cmp = null;
				mockLog.error.mockReset();
				cmp.processCommand('renderCmpIfNeeded');
				expect(mockLog.error.mock.calls[0][0]).to.eq('CMP failed to load');
			});

			it('not renders cmp toolbox if cookies dissabled', () => {
				Object.defineProperty(window.navigator, 'cookieEnabled', {
					get: () => false,
					configurable: true
				});
				mockLog.warn.mockReset();
				cmp.processCommand('renderCmpIfNeeded');
				expect(mockLog.warn.mock.calls[0][0]).to.eq('Cookies are disabled. Ignoring CMP consent check');
			});

			it('renders cmp toolbox if testing mode enabled', () => {
				config.testingMode = 'always show';
				cmp.processCommand('renderCmpIfNeeded');

				expect(_cmp.mock.calls.length).to.eq(1);
				expect(_cmp.mock.calls[0][0]).to.eq('showConsentTool');
			});

			it('not renders cmp cmp toolbox if testing mode set to other value', () => {
				config.testingMode = 'never show';
				cmp.processCommand('renderCmpIfNeeded');

				expect(_cmp.mock.calls.length).to.eq(0);
			});
		});
	});


	it('notify invokes event listeners', (done) => {
		cmp.processCommand('addEventListener', 'isLoaded', () => {
			done();
		});

		cmp.notify('isLoaded');
	});

	it('processes messages from iframes', () => {
		const source = {
			postMessage: jest.fn()
		};
		const processSpy = jest.spyOn(cmp, 'processCommand');
		cmp.receiveMessage({
			data: {
				__cmpCall: { command: 'showConsentTool' }
			},
			origin: {},
			source
		});

		expect(processSpy.mock.calls[0][0]).to.equal('showConsentTool');
	});

	describe('soft consent handlers', () => {
		it('handleScrolling', (done) => {
			cmp.handleScrolling();
			setTimeout(() => {
				cmp.processCommand('getVendorConsents', null, data => {
					expect(typeof data.metadata).to.equal('string');
					expect(data.metadata.length).to.not.equal(0);
					expect(typeof data.purposeConsents).to.equal('object');
					expect(typeof data.vendorConsents).to.equal('object');
					done();
				});
			}, 90);
		});

		it('handleOutsideClick', (done) => {
			cmp.handleOutsideClick();
			setTimeout(() => {
				cmp.processCommand('getVendorConsents', null, data => {
					expect(typeof data.metadata).to.equal('string');
					expect(data.metadata.length).to.not.equal(0);
					expect(typeof data.purposeConsents).to.equal('object');
					expect(typeof data.vendorConsents).to.equal('object');
					done();
				});
			}, 90);
		});

		it('handleNavigationChange', (done) => {
			cmp.handleNavigationChange();
			setTimeout(() => {
				cmp.processCommand('getVendorConsents', null, data => {
					expect(typeof data.metadata).to.equal('string');
					expect(data.metadata.length).to.not.equal(0);
					expect(typeof data.purposeConsents).to.equal('object');
					expect(typeof data.vendorConsents).to.equal('object');
					done();
				});
			}, 90);
		});
	});

});
