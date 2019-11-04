import { h, render } from "preact";
import Promise from "promise-polyfill";
import Store from "./store";
import Cmp, { CMP_GLOBAL_NAME } from "./cmp";
import * as cookie from "./cookie/cookie";
import {
	fetchVendorList,
	fetchLocalizedPurposeList,
	fetchCustomPurposeList
} from "./vendor";
import { checkIfUserInEU, areConsentsStoredGlobally } from "./utils";
import log from "./log";
import config from "./config";
import { pickVariant } from "./abTesting";
import { bundleSasNotify } from "./sas";
import { getAndCacheConsentData, loadConfig } from "./initUtils";
const metadata = require("../../metadata.json");

const pjson = require("../../package.json");

const getConsentData = () => {
	return Promise.all([
		cookie.readVendorConsentCookie(),
		cookie.readPublisherConsentCookie()
	]).then(([vendorConsentData, publisherConsentData]) => {
		return { vendorConsentData, publisherConsentData };
	});
};

export function init(configUpdates) {
	config.update(configUpdates);
	log.debug("Using configuration:", config);
	// LOG always
	console.log("Version:", pjson.version);

	// LOAD CONFIG EXTENSION
	// SETUP AB - TESTING
	let configUrl = config.remoteConfigUrl;

	if (!!config.abTest === true && Array.isArray(config.variants)) {
		log.info("A/B testing active");
		const variant = pickVariant(config.variants);
		configUrl = variant.configUrl;
		config.update({ activeVariant: variant });
	}

	// Fetch the current vendor consent before initializing
	return loadConfig(configUrl).then(
		({ vendors, purposes, features, vendorListVersion, ...rest }) => {
			config.update(rest);
			const getConsent = areConsentsStoredGlobally(config)
				? getAndCacheConsentData
				: getConsentData;

			return getConsent()
				.then(({ publisherConsentData, vendorConsentData }) => {
					if (config.sasEnabled && config.sasUrls.length > 0) {
						log.info("SAS enabled");

						const sasLastCalled = localStorage.getItem("sasLastCalled") || 0;
						const timestamp = Date.now();
						const intervalMs = config.sasInterval * 60 * 60 * 1000;

						if (timestamp - intervalMs > sasLastCalled) {
							return cookie
								.readLocalVendorConsentCookie()
								.then(euconsent => {
									return bundleSasNotify(config, euconsent);
								})
								.then(() => ({ publisherConsentData, vendorConsentData }));
						}
						return { publisherConsentData, vendorConsentData };
					}
					return { publisherConsentData, vendorConsentData };
				})
				.then(({ publisherConsentData, vendorConsentData }) => {
					// Initialize the store with all of our consent data
					const store = new Store({
						vendorConsentData,
						publisherConsentData,
						cmpId: metadata.cmpId,
						cmpVersion: metadata.cmpVersion,
						cookieVersion: 1
					});

					const loadVendorsAndPurposes = () => {
						const _fetchLocalizedPurposeList =
							store.consentLanguage.toLowerCase() === "en"
								? Promise.resolve
								: fetchLocalizedPurposeList;

						// Request lists
						return Promise.all([
							fetchVendorList(vendors).then(resp => {
								store.updateVendorList(resp);

								_fetchLocalizedPurposeList().then(localized => {
									localized && store.updateLocalizedPurposeList(localized);
								});
							}),
							fetchCustomPurposeList().then(store.updateCustomPurposeList)
						]);
					};

					const updateVendorsAndPurposes = () => {
						return fetchVendorList(vendors).then(res => {
							store.updateVendorList(res);
							store.updateLocalizedPurposeList({ purposes, features });
						});
					};
					const loadCmpConfigurationData = config.remoteConfigUrl
						? updateVendorsAndPurposes
						: loadVendorsAndPurposes;

					return loadCmpConfigurationData()
						.then(() => {
							// Pull queued command from __cmp stub
							const { commandQueue = [], onConfigLoaded } =
								window[CMP_GLOBAL_NAME] || {};

							// Replace the __cmp with our implementation
							const cmp = new Cmp(store, config);
							store.updateCmpHandle(cmp);

							// Expose `processCommand` as the CMP implementation
							window[CMP_GLOBAL_NAME] = cmp.processCommand;
							window[CMP_GLOBAL_NAME].onConfigLoaded = onConfigLoaded;

							// Execute any previously queued command
							cmp.commandQueue = commandQueue;

							// set cookies on digitrust domain after consent submitted
							const { addEventListener, getVendorConsents } = cmp.commands;
							if (config.digitrust.redirects) {
								addEventListener("consentStringUpdated", digitrustRedirect);
							}

							function digitrustRedirect() {
								getVendorConsents([64], result => {
									if (
										result &&
										result.vendorConsents &&
										result.vendorConsents[64]
									) {
										window.location.replace(
											`${config.digitrustRedirectUrl}${encodeURIComponent(
												window.location.href
											)}`
										);
									}
								});
							}

							return checkIfUserInEU(config.geoIPVendor, response => {
								cmp.gdprApplies = response.applies;
								cmp.gdprAppliesLanguage = response.language;
								cmp.gdprAppliesLocation = response.location;
							})
								.then(response => {
									function addLocatorFrame() {
										if (!window.frames["__cmpLocator"]) {
											if (document.body) {
												var frame = document.createElement("iframe");
												frame.style.display = "none";
												frame.name = "__cmpLocator";
												document.body.appendChild(frame);
											} else {
												setTimeout(addLocatorFrame, 5);
											}
										}
									}

									addLocatorFrame();
									store.updateIsEU(response.applies);

									// Render the UI
									console.log("cmp.cmpShown:", cmp.cmpShown);
									const App = require("../components/app").default;
									render(
										<App
											store={store}
											cmp={cmp}
											notify={cmp.notify}
											config={config}
										/>,
										document.body
									);

									// Notify listeners that the CMP is loaded
									log.debug(
										`Successfully loaded CMP version: ${metadata.cmpVersion}`
									);
									cmp.isLoaded = true;
									cmp.notify("isLoaded");
									cmp.cmpReady = true;
									cmp.notify("cmpReady");
									cmp.processCommandQueue();
								})
								.catch(err => {
									log.error(
										"Failed to check user location. CMP not ready",
										err
									);
								});
						})
						.catch(err => {
							log.error("Failed to load lists. CMP not ready", err);
						});
				})
				.catch(err => {
					log.error("Failed to load CMP", err);
				});
		}
	);
}
