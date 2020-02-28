import Promise from "promise-polyfill";
import Store from "./store";
import Cmp, { CMP_GLOBAL_NAME } from "./cmp";
import * as cookie from "./cookie/cookie";
import {
  fetchVendorList,
  fetchLocalizedPurposeList,
  fetchCustomPurposeList
} from "./vendor";
import { checkIfUserInEU } from "./utils";
import {
  getAndCacheConsentData,
  loadConfig,
  getLocalConsentData
} from "./initUtils";
import log from "./log";
import { bundleSasNotify } from "./sas";
import { notifyTimer } from "./timer";
import { init } from "init";
import { pickVariant } from "./abTesting";
import config from "./config";
import { writeLocalVendorConsentCookie } from "./cookie/cookie";

const metadata = require("../../metadata.json");

export function coreInit(configUpdates) {
  config.update(configUpdates);
  notifyTimer("cmp_init");
  // USE DEFAULT CONFIG
  // console.log("Using configuration:", config);
  let configUrl = config.remoteConfigUrl;

  // Fetch the current local vendor consent before initializing
  return loadConfig(configUrl).then(
    ({ vendors, purposes, features, vendorListVersion, ...rest }) => {
      config.update(rest);

      return getLocalConsentData().then(
        ({ publisherConsentData, vendorConsentData }) => {
          if (vendorConsentData) {
            // THERE IS SOMETHING
            // prepare cmp and stuff
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
                fetchVendorList().then(resp => {
                  store.updateVendorList(resp);

                  _fetchLocalizedPurposeList().then(localized => {
                    localized && store.updateLocalizedPurposeList(localized);
                  });
                }),
                fetchCustomPurposeList().then(store.updateCustomPurposeList)
              ]);
            };

            return loadVendorsAndPurposes()
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

                // Notify listeners that the CMP is loaded
                log.debug(
                  `Successfully loaded CMP version: ${metadata.cmpVersion}`
                );
                cmp.isLoaded = true;
                cmp.notify("isLoaded");
                cmp.cmpReady = true;
                cmp.notify("cmpReady");
                notifyTimer("cmp_ready");
                cmp.processCommandQueue();
                return afterSync(config, store);
              })
              .catch(err => {
                log.error("Failed to load lists. CMP not ready", err);
              });
          }

          // THERE IS NOT SOMETHING
          // fallback to global
          // getGlobalConsents
          // Initialize the store with all of our consent data
          return init(config);
        }
      );
    }
  );
}

const afterSync = (config, store) => {
  if (!!config.abTest === true && Array.isArray(config.variants)) {
    log.info("A/B testing active");
    const variant = pickVariant(config.variants);
    config.update({ activeVariant: variant });
  }

  // Fetch the current vendor consent before initializing
  return loadConfig(config.remoteConfigUrl).then(
    ({ vendors, purposes, features, vendorListVersion, ...rest }) => {
      config.update(rest);

      return getAndCacheConsentData()
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
          // Update consent strings
          // writeLocalVendorConsentCookie(vendorConsentData);

          const updateVendorsAndPurposes = () => {
            return fetchVendorList(vendors).then(res => {
              store.updateVendorList(res);
              store.updateLocalizedPurposeList({ purposes, features });
            });
          };
          return updateVendorsAndPurposes()
            .then(() => {
              const cmp = store.cmp;
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
                  notifyTimer("cmp_synced");
                })
                .catch(err => {
                  log.error("Failed to check user location. SYNC", err);
                });
            })
            .catch(err => {
              log.error("Failed to load lists. SYNC", err);
            });
        })
        .catch(err => {
          log.error("Failed to load SYNC", err);
        });
    }
  );
};
