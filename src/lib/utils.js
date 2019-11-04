//jshint esversion: 6
import "whatwg-fetch";
import Promise from "promise-polyfill";
import config from "./config";

export {
	checkReprompt,
	checkIfGDPRApplies,
	checkIfLanguageLocaleApplies,
	checkIfUserInEU,
	getAmountOfConsentGiven,
	checkIfCookieIsOld,
	getTimestamp,
	getConsentsCount,
	addStyleSheet,
	areConsentsStoredGlobally
};

const metadata = require("../../metadata.json");
const MAX_COOKIE_LIFESPAN_DAYS = metadata.maxCookieLifespanDays;
const CONSENT_PROPS = [
	"purposeConsents",
	"vendorConsents",
	"customPurposes",
	"standardPurposes"
];
const EU_LANGUAGE_CODES = new Set(metadata.languageCodes);
const EU_COUNTRY_CODES = new Set(metadata.countryCodes);

// Necessary because IE11 doesn't support init'ing a Set with values
function initConstants() {
	if (EU_COUNTRY_CODES.size === 0) {
		for (var i in metadata.countryCodes) {
			EU_COUNTRY_CODES.add(metadata.countryCodes[i]);
		}
		for (var j in metadata.languageCodes) {
			EU_LANGUAGE_CODES.add(metadata.languageCodes[j]);
		}
	}
}

initConstants();

function getConsentsCount(consentObject, vendorList) {
	let total = 0;
	let consented = 0;
	const activeVendors = vendorList.vendors.reduce((acc, vendor) => {
		acc[vendor.id] = true;
		return acc;
	}, {});

	for (let i = 0; i < CONSENT_PROPS.length; i++) {
		if (consentObject[CONSENT_PROPS[i]]) {
			let consents = consentObject[CONSENT_PROPS[i]];
			const indexes = Object.keys(consents);
			if (CONSENT_PROPS[i] === "vendorConsents") {
				consents = indexes.map(
					index => consents[index] && activeVendors[index]
				);
				total += Object.keys(activeVendors).length;
			} else {
				consents = indexes.map(index => consents[index]);
				total += indexes.length;
			}

			consented += consents.filter(Boolean).length;
		}
	}
	return { total, consented };
}

function getTimestamp(dateString) {
	return +new Date(dateString);
}

function checkReprompt(
	repromptOptions,
	vendorList,
	vendorConsents,
	publisherConsents
) {
	// TODO horrible fix
	const oldestCookieTime = Math.max(
		...[
			vendorConsents.lastUpdated || 0
			// publisherConsents.lastUpdated || 0
		].map(getTimestamp)
	);

	const { total, consented } = [vendorConsents, publisherConsents].reduce(
		(previous, current) => {
			current = getConsentsCount(current, vendorList);
			previous.total += current.total;
			previous.consented += current.consented;
			return previous;
		},
		{ total: 0, consented: 0 }
	);

	const consentRange = getAmountOfConsentGiven(total, consented);
	const days = repromptOptions[consentRange];

	return checkIfCookieIsOld(oldestCookieTime, days);
}

function checkIfGDPRApplies(geoVendor, callback) {
	const navigator = window.navigator;
	const browserLanguageCheckResult = checkIfLanguageLocaleApplies(
		navigator.languages || [navigator.browserLanguage]
	);
	if (browserLanguageCheckResult) {
		callback({ applies: true, language: true, location: false });
	} else {
		checkIfUserInEU(geoVendor, callback);
	}
}

function checkIfLanguageLocaleApplies(languages) {
	if (config.useGeolocationOnly) return false;
	for (let i = 0; i < languages.length; i++) {
		if (EU_LANGUAGE_CODES.has(languages[i].toLowerCase())) {
			return true;
		}
	}
	return false;
}

function checkIfUserInEU(geoVendor, callback) {
	return fetch(geoVendor)
		.then(resp => {
			const countryISO = resp.headers.get("X-GeoIP-Country");
			const result =
				!!countryISO && EU_COUNTRY_CODES.has(countryISO.toUpperCase());
			callback({ applies: result, language: false, location: result });
			return Promise.resolve({
				applies: result,
				language: false,
				location: result
			});
		})
		.catch(() => {
			callback(false);
			return Promise.resolve(false);
		});
}

function getAmountOfConsentGiven(total, consented) {
	let consentGiven;
	if (consented === 0) {
		consentGiven = "noConsentGiven";
	} else if (consented < total) {
		consentGiven = "someConsentGiven";
	} else {
		consentGiven = "fullConsentGiven";
	}
	return consentGiven;
}

function checkIfCookieIsOld(cookieTime, days) {
	const cookieTimestamp = getTimestamp(cookieTime);
	const now = Date.now();

	if (days > MAX_COOKIE_LIFESPAN_DAYS) {
		days = MAX_COOKIE_LIFESPAN_DAYS;
	}

	const daysInMS = 1000 * 60 * 60 * 24 * days;

	return now - daysInMS > cookieTimestamp;
}

function addStyleSheet(url) {
	if (url && url.length) {
		const head = document.head;
		const link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = url;
		head.appendChild(link);
	}
}

function areConsentsStoredGlobally(config) {
	// TODO
	return (
		/*config.duplicateConsent &&*/
		config.storeConsentGlobally || config.storePublisherConsentGlobally
	);
}
