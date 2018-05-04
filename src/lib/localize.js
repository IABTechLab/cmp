import translations from './translations';
import config from './config';

export let currentLocale = 'en-us';
let localizedValues = {};
let localizedMap = {};

function findLocale(forceLocale) {
	const locale = forceLocale ||
		(navigator && (
			navigator.language ||
			navigator.browserLanguage ||
			navigator.userLanguage ||
			(navigator.languages && navigator.languages[0]) ||
			'en-us'
		));
	return locale.toLowerCase();
}

export function updateLocalizationSettings(userConfig) {
	const {
		forceLocale,
	} = userConfig;

	currentLocale = findLocale(forceLocale);
	const [language] = currentLocale.split('-');
	localizedValues = {
		...localizedMap[language],
		...localizedMap[currentLocale]
	};
}

function processLocalized(data = {}) {
	const locales = Object.keys(data);
	return locales.reduce((acc, locale) => {
		const [language] = locale.toLowerCase().split('-');
		return {
			...acc,
			[locale]: {
				...acc[locale],
				...flattenObject(data[language]),
				...flattenObject(data[locale])
			}
		};
	}, {});
}

export function flattenObject(data) {
	const flattened = {};

	function flatten(part, prefix) {
		Object.keys(part).forEach(key => {
			const prop = prefix ? `${prefix}.${key}` : key;
			const val = part[key];

			if (typeof val === 'object') {
				return flatten(val, prop);
			}

			flattened[prop] = val;
		});
	}

	flatten(data);
	return flattened;
}

export class Localize {
	constructor(localizedData) {
		localizedMap = processLocalized(localizedData);
		updateLocalizationSettings(localizedData, findLocale());
	}

	lookup = key => {
		return localizedValues[key];
	};
}

export default new Localize({
	...translations,
	...config.localization
});
