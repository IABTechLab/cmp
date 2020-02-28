// jshint esversion: 6

import log from "./log";
import {
  encodeVendorConsentData,
  encodePublisherConsentData
} from "./cookie/cookie";
import { encodeMetadataValue, decodeMetadataValue } from "./cookie/cookieutils";
import { checkReprompt, checkIfGDPRApplies } from "./utils";

const metadata = require("../../metadata.json");
const testingModes = {
  ALWAYS: "always show",
  NORMAL: "normal",
  NEVER: "never show"
};

export const CMP_GLOBAL_NAME = metadata.cmpGlobalName;

export default class Cmp {
  constructor(store, config) {
    this.isLoaded = false;
    this.cmpReady = false;
    this.gdprApplies = config.gdprAppliesGlobally;
    this.eventListeners = {};
    this.store = store;
    this.config = config;
    this.cmpShown = false;
    this.gdprAppliesLanguage = false;
    this.gdprAppliesLocation = false;
    this.submitted = false;
    this.processCommand.receiveMessage = this.receiveMessage;
  }

	commands = {
	  renderCmpIfNeeded: (_, callback = () => {}) => {
	    const self = this;
	    const store = self.store;
	    const config = self.config;
	    const cmp = window[CMP_GLOBAL_NAME];
	    if (!cmp) {
	      log.error("CMP failed to load");
	    } else if (!window.navigator.cookieEnabled) {
	      log.warn("Cookies are disabled. Ignoring CMP consent check");
	    } else {
	      const vendorConsents = store.getVendorConsentsObject();
	      const publisherConsents = (config.storePublisherData &&
					store.getPublisherConsentsObject()) || { lastUpdated: Date.now() }; // if publisher consent is not enabled mark - cookie as valid
	      const shouldBePrompted = checkReprompt(
	        config.repromptOptions,
	        store.getVendorList(),
	        vendorConsents,
	        publisherConsents
	      );
	      const { testingMode } = config;

	      if (testingMode !== testingModes.NORMAL) {
	        if (testingMode === testingModes.ALWAYS) {
	          self.notify("cmpStarted");
	          cmp("showConsentTool", callback);
	        } else {
	          if (testingMode === testingModes.NEVER) {
	            window.PageviewCMP = 0;
	          }
	          log.debug("Toolbox can be rendered only manually");
	          callback(false);
	        }
	      } else if (config.gdprAppliesGlobally || self.gdprApplies) {
	        self.gdprApplies = true;
	        if (shouldBePrompted) {
	          self.notify("cmpStarted");
	          cmp("showConsentTool", callback);
	        } else {
	          self.notify("consentNotRequired");
	          window.PageviewCMP = 0;
	          log.debug("rendering the CMP is not needed");
	        }
	      } else {
	        checkIfGDPRApplies(config.geoIPVendor, response => {
	          self.gdprApplies = response.applies;
	          self.gdprAppliesLanguage = response.language;
	          self.gdprAppliesLocation = response.location;
	          if (response.applies && shouldBePrompted) {
	            self.notify("cmpStarted");
	            cmp("showConsentTool", callback);
	          } else {
	            self.notify("consentNotRequired");
	            window.PageviewCMP = 0;
	            log.debug("rendering the CMP is not needed");
	          }
	        });
	      }
	    }

	    if (cmp && typeof cmp.onConfigLoaded === "function") {
	      cmp.onConfigLoaded(config);
	    }
	  },

	  /**
		 * Get all publisher consent data from the data store.
		 */
	  getPublisherConsents: (purposeIds, callback = () => {}) => {
	    const consent = {
	      metadata: this.generatePublisherConsentString(),
	      gdprApplies: this.gdprApplies,
	      hasGlobalScope: this.config.storeConsentGlobally,
	      ...this.store.getPublisherConsentsObject()
	    };
	    callback(consent, true);
	  },

	  /**
		 * Get all vendor consent data from the data store.
		 * @param {Array} vendorIds Array of vendor IDs to retrieve.  If empty return all vendors.
		 */
	  getVendorConsents: (vendorIds, callback = () => {}) => {
	    const {
	      purposeConsents,
	      vendorConsents
	    } = this.store.getVendorConsentsObject(vendorIds);
	    const consent = {
	      metadata: this.generateMetadataString(),
	      gdprApplies: this.gdprApplies,
	      hasGlobalScope: this.config.storeConsentGlobally,
	      purposeConsents,
	      vendorConsents
	    };

	    callback(consent, true);
	  },

	  decodeMetadata: (_ = () => {}, callback) => {
	    const metadata = decodeMetadataValue(this.generateMetadataString());
	    if (!callback) {
	      callback = _;
	    }
	    callback(metadata, true);
	  },

	  /**
		 * Get all current vendor consent cookie data from the data store.
		 * @param {Array} vendorIds Array of vendor IDs to retrieve.  If empty return all vendors.
		 */
	  getUnpackedVendorCookie: (vendorIds, callback = () => {}) => {
	    return this.store.getFullVendorConsentsObject(vendorIds).then(consent => {
	      consent.gdprApplies = this.gdprApplies;
	      callback(consent, true);
	      return consent;
	    });
	  },

	  /**
		 * Get the encoded vendor consent data value.
		 */
	  getConsentData: (_, callback = () => {}) => {
	    return this.store.getFullVendorConsentsObject().then(consent => {
	      const output = {
	        gdprApplies: this.gdprApplies,
	        hasGlobalScope: this.config.storeConsentGlobally,
	        consentData: consent.consentString
	      };
	      callback(output, true);
	      return output;
	    });
	  },

	  /**
		 * Get the entire vendor list
		 */
	  getVendorList: (vendorListVersion, callback = () => {}) => {
	    const { vendorList } = this.store;
	    const { vendorListVersion: listVersion } = vendorList || {};
	    if (!vendorListVersion || vendorListVersion === listVersion) {
	      callback(vendorList, true);
	    } else {
	      callback(null, false);
	    }
	  },

	  ping: (_ = () => {}, callback) => {
	    const result = {
	      gdprAppliesGlobally: this.config.gdprAppliesGlobally,
	      cmpLoaded: true
	    };
	    if (!callback) {
	      callback = _;
	    }
	    callback(result, true);
	  },

	  gdprInScope: (_ = () => {}, callback) => {
	    const result = {
	      cmpShown: this.cmpShown,
	      gdprAppliesGlobally: this.config.gdprAppliesGlobally,
	      gdprAppliesLanguage: this.gdprAppliesLanguage,
	      gdprAppliesLocation: this.gdprAppliesLocation,
	      submitted: this.submitted
	    };
	    if (!callback) {
	      callback = _;
	    }
	    callback(result, true);
	  },

	  /**
		 * Add a callback to be fired on a specific event.
		 * @param {string} event Name of the event
		 */
	  addEventListener: (event, callback) => {
	    const eventSet = this.eventListeners[event] || new Set();
	    eventSet.add(callback);
	    this.eventListeners[event] = eventSet;

	    // Trigger load events immediately if they have already occurred
	    if (event === "isLoaded" && this.isLoaded) {
	      callback({ event });
	    }
	    if (event === "cmpReady" && this.cmpReady) {
	      callback({ event });
	    }
	  },

	  /**
		 * Remove a callback for an event.
		 * @param {string} event Name of the event to remove callback from
		 */
	  removeEventListener: (event, callback) => {
	    // If an event is supplied remove the specific listener
	    if (event) {
	      const eventSet = this.eventListeners[event] || new Set();
	      // If a callback is supplied remove it
	      if (callback) {
	        eventSet.delete(callback);
	      }
	      // If no callback is supplied clear all listeners for this event
	      else {
	        eventSet.clear();
	      }
	      this.eventListeners[event] = eventSet;
	    }
	    // If no event is supplied clear ALL listeners
	    else {
	      this.eventListeners = {};
	    }
	  },

	  /**
		 * Trigger the consent tool UI to be shown
		 */
	  showConsentTool: (_, callback = () => {}) => {
	    const self = this;
	    let _command;
	    switch (self.config.layout) {
	    case "footer":
	      _command = "toggleFooterConsentToolShowing";
	      break;
	    case "thin":
	      _command = "toggleThinConsentToolShowing";
	      break;
	    default:
	      _command = "toggleConsentToolShowing";
	    }

	    self.cmpShown = true;
	    self.store[_command](true);
	    self.notify("consentToolDisplayed");
	    callback(true);
	  },

	  getConfig: (_, callback = () => {}) => {
	    callback(this.config.copy(), true);
	  }
	};

	generatePublisherConsentString = () => {
	  const {
	    vendorList,
	    persistedVendorConsentData,
	    persistedPublisherConsentData,
	    customPurposeList
	  } = this.store;

	  let customPurposes = [];
	  customPurposes = customPurposeList && customPurposeList.purposes;

	  const { purposes = [] } = vendorList || {};
	  const { selectedPurposeIds = new Set() } = persistedVendorConsentData || {};
	  const { selectedCustomPurposeIds = new Set() } =
			persistedPublisherConsentData || {};

	  const allowedPurposeIds = new Set();
	  for (let i in purposes) {
	    allowedPurposeIds.add(purposes[i].id);
	  }

	  const allowedCustomPurposeIds = new Set();
	  if (customPurposeList) {
	    for (let j in customPurposes) {
	      allowedCustomPurposeIds.add(customPurposes[j].id);
	    }
	  }

	  const selectedAllowedPurposeIds = new Set();
	  Array.from(selectedPurposeIds)
	    .filter(id => allowedPurposeIds.has(id))
	    .forEach(id => {
	      selectedAllowedPurposeIds.add(id);
	    });

	  const selectedAllowedCustomPurposeIds = new Set();
	  if (customPurposeList) {
	    Array.from(selectedCustomPurposeIds)
	      .filter(id => allowedCustomPurposeIds.has(id))
	      .forEach(id => {
	        selectedAllowedCustomPurposeIds.add(id);
	      });
	  }

	  // Encode the persisted data
	  return (
	    persistedPublisherConsentData &&
			encodePublisherConsentData({
			  ...persistedVendorConsentData,
			  ...persistedPublisherConsentData,
			  selectedPurposeIds: selectedAllowedPurposeIds,
			  selectedCustomPurposeIds: selectedAllowedCustomPurposeIds,
			  customPurposeList,
			  vendorList
			})
	  );
	};

	generateMetadataString = () => {
	  const {
	    vendorList,
	    persistedVendorConsentData,
	    persistedPublisherConsentData,
	    customPurposeList
	  } = this.store;

	  return (
	    persistedVendorConsentData &&
			encodeMetadataValue({
			  vendorList,
			  ...persistedVendorConsentData,
			  ...persistedPublisherConsentData,
			  customPurposeList
			})
	  );
	};

	generateConsentString = () => {
	  const { persistedVendorConsentData, vendorList } = this.store;

	  const { vendors = [], purposes = [] } = vendorList || {};

	  const { selectedVendorIds = new Set(), selectedPurposeIds = new Set() } =
			persistedVendorConsentData || {};

	  // Filter consents by values that exist in the current vendorList
	  const allowedVendorIds = new Set();
	  for (let i in vendors) {
	    allowedVendorIds.add(vendors[i].id);
	  }

	  const allowedPurposeIds = new Set();
	  for (let j in purposes) {
	    allowedPurposeIds.add(purposes[j].id);
	  }

	  const selectedAllowedVendorIds = new Set();
	  Array.from(selectedVendorIds)
	    .filter(id => allowedVendorIds.has(id))
	    .forEach(id => {
	      selectedAllowedVendorIds.add(id);
	    });

	  const selectedAllowedPurposeIds = new Set();
	  Array.from(selectedPurposeIds)
	    .filter(id => allowedPurposeIds.has(id))
	    .forEach(id => {
	      selectedAllowedPurposeIds.add(id);
	    });

	  // Encode the persisted data
	  return (
	    persistedVendorConsentData &&
			encodeVendorConsentData({
			  ...persistedVendorConsentData,
			  selectedVendorIds: selectedAllowedVendorIds,
			  selectedPurposeIds: selectedAllowedPurposeIds,
			  vendorList
			})
	  );
	};

	processCommandQueue = () => {
	  const queue = [...this.commandQueue];
	  if (queue.length) {
	    log.info(`Process ${queue.length} queued commands`);
	    this.commandQueue = [];
	    queue.forEach(({ callId, command, parameter, callback, event }) => {
	      // If command is queued with an event we will relay its result via postMessage
	      if (event) {
	        this.processCommand(command, parameter, returnValue =>
	          event.source.postMessage(
	            {
	              __cmpReturn: {
	                callId,
	                command,
	                returnValue
	              }
	            },
	            event.origin
	          )
	        );
	      } else {
	        this.processCommand(command, parameter, callback);
	      }
	    });
	  }
	};

	/**
	 * Handle a message event sent via postMessage to
	 * call `processCommand`
	 */
	receiveMessage = ({ data, origin, source }) => {
	  const { __cmpCall: cmp } = data;
	  if (cmp) {
	    const { callId, command, parameter } = cmp;
	    this.processCommand(command, parameter, returnValue =>
	      source.postMessage(
	        { __cmpReturn: { callId, command, returnValue } },
	        origin
	      )
	    );
	  }
	};

	/**
	 * Call one of the available commands.
	 * @param {string} command Name of the command
	 * @param {*} parameter Expected parameter for command
	 */
	processCommand = (command, parameter, callback) => {
	  if (typeof this.commands[command] !== "function") {
	    log.error(`Invalid CMP command "${command}"`);
	  }
	  // Special case where we have the full CMP implementation loaded but
	  // we still queue these commands until there is data available. This
	  // behavior should be removed in future versions of the CMP spec
	  else if (
	    (!this.store.persistedVendorConsentData &&
				(command === "getVendorConsents" || command === "getConsentData")) ||
			(!this.store.persistedPublisherConsentData &&
				command === "getPublisherConsents")
	  ) {
	    log.info(`Queuing command: ${command} until consent data is available`);
	    this.commandQueue.push({
	      command,
	      parameter,
	      callback
	    });
	  } else {
	    log.info(`Proccess command: ${command}, parameter: ${parameter}`);
	    this.commands[command](parameter, callback);
	  }
	};

	/**
	 * Trigger all event listener callbacks to be called.
	 * @param {string} event Name of the event being triggered
	 * @param {*} data Data that will be passed to each callback
	 */
	notify = (event, data) => {
	  log.info(`Notify event: ${event}`);
	  const eventSet = this.eventListeners[event] || new Set();
	  eventSet.forEach(listener => {
	    listener({ event, data });
	  });

	  // Process any queued commands that were waiting for consent data
	  if (event === "onSubmit") {
	    this.submitted = true;
	    this.processCommandQueue();
	  }
	};
}
