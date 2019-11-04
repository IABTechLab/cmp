import Promise from "promise-polyfill";
import * as cookie from "./cookie/cookie";
import log from "./log";

function getLocalConsentData() {
	return Promise.all([
		cookie.readLocalVendorConsentCookie(),
		cookie.readLocalPublisherConsentCookie()
	]).then(([vendorConsentData, publisherConsentData]) => {
		return { vendorConsentData, publisherConsentData };
	});
}

function loadConfig(configUrl) {
	if (configUrl) {
		log.debug("load remote config from", configUrl);
		return fetch(configUrl)
			.then(response => response.json())
			.catch(err => ({}));
	}
	return Promise.resolve({});
}

function getAndCacheConsentData() {
	return Promise.all([
		cookie.readLocalVendorConsentCookie(),
		cookie.readLocalPublisherConsentCookie()
	]).then(([localVendorConsentData, localPublisherConsentData]) => {
		if (localVendorConsentData) {
			log.info("Local consent cookie present, using it");
			loadGlobalConsent({ localVendorConsentData, localPublisherConsentData }); // check third party cookie but don't wait for the result
			return {
				vendorConsentData: localVendorConsentData,
				publisherConsentData: localPublisherConsentData
			};
		}

		log.info("Local consent cookie not present, check global");
		return loadGlobalConsent();
	});
}

function loadGlobalConsent({
	localVendorConsentData,
	localPublisherConsentData
} = {}) {
	return Promise.all([
		cookie.readGlobalVendorConsentCookie(),
		cookie.readGlobalPublisherConsentCookie()
	]).then(([globalVendorConsentData, globalPublisherConsentData]) => {
		if (globalVendorConsentData) {
			log.info("Global consent cookie present", globalVendorConsentData);
			return storeConsentLocally(
				globalVendorConsentData,
				globalPublisherConsentData
			).then(() => {
				return {
					vendorConsentData: globalVendorConsentData,
					publisherConsentData: globalPublisherConsentData
				};
			});
		} else if (!globalVendorConsentData && localVendorConsentData) {
			log.info(
				"Global consent cookie not present, local present",
				localVendorConsentData
			);

			return Promise.all([
				cookie.writeGlobalVendorConsentCookie(localVendorConsentData),
				cookie.writeGlobalPublisherConsentCookie(localPublisherConsentData)
			]).then(() => {
				return {
					vendorConsentData: localVendorConsentData,
					publisherConsentData: localPublisherConsentData
				};
			});
		}

		return {
			vendorConsentData: globalVendorConsentData,
			publisherConsentData: globalPublisherConsentData
		};
	});
}

function storeConsentLocally(vendorConsent, publisherConsent) {
	log.info("Save consent locally");

	return Promise.all([
		cookie.writeLocalVendorConsentCookie(vendorConsent),
		cookie.writePublisherConsentCookie(publisherConsent)
	]);
}

export {
	storeConsentLocally,
	loadGlobalConsent,
	getAndCacheConsentData,
	loadConfig,
	getLocalConsentData
};
