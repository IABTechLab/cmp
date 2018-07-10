import Promise from 'promise-polyfill';
import 'whatwg-fetch';
import log from "../../lib/log";
import config from "../../lib/config";

const host = (window && window.location && window.location.hostname) || '';
const parts = host.split('.');
const GLOBAL_VENDOR_LIST_DOMAIN = 'https://vendorlist.consensu.org/vendorlist.json';
const COOKIE_DOMAIN = parts.length > 1 ? `;domain=.${parts.slice(-2).join('.')}` : '';
const COOKIE_MAX_AGE = 33696000;
const VENDOR_COOKIE_NAME = 'euconsent';
const PUBLISHER_COOKIE_NAME = 'pubconsent';

const readVendorListPromise = fetch(config.globalVendorListLocation)
	.then(res => res.json())
	.catch(() => {
		log.error(`Failed to load local vendor list from vendors.json, trying global`);
		return fetch(GLOBAL_VENDOR_LIST_DOMAIN)
			.then(resp => resp.json())
			.catch(error => {
				log.error(`Failed to load global vendor list`, error);
			});
	});

function readCookie(name) {
	const value = '; ' + document.cookie;
	const parts = value.split('; ' + name + '=');
	if (parts.length === 2) {
		return Promise.resolve(parts.pop().split(';').shift());
	}
	return Promise.resolve();
}

function writeCookie({ name, value, path = '/'}) {
	document.cookie = `${name}=${value}${COOKIE_DOMAIN};path=${path};max-age=${COOKIE_MAX_AGE}`;

	if ( !document.cookie || document.cookie.indexOf(name) < 0) {
		return Promise.resolve(false);
	}
	return Promise.resolve(true);
}

const commands = {
	readVendorList: () => readVendorListPromise,

	readVendorConsent: () => {
		return readCookie(VENDOR_COOKIE_NAME);
	},

	writeVendorConsent: ({encodedValue}) => {
		return writeCookie({name: VENDOR_COOKIE_NAME, value: encodedValue});
	},

	readPublisherConsent: () => {
		return readCookie(PUBLISHER_COOKIE_NAME);
	},

	writePublisherConsent: ({encodedValue}) => {
		return writeCookie({name: PUBLISHER_COOKIE_NAME, value: encodedValue});
	}
};

window.addEventListener('message', (event) => {
	const data = event.data.vendorConsent;
	if (data && typeof commands[data.command] === 'function') {
		const { command } = data;
		commands[command](data).then(result => {
			event.source.postMessage({
				vendorConsent: {
					...data,
					result
				}
			}, event.origin);
		});
	}
});
window.parent.postMessage({ vendorConsent: { command: 'isLoaded' } }, '*');
