const VENDOR_COOKIE_NAME = 'euconsent';
const GDPR_COUNTRIES = new Set([
	'GB',
	'DE',
	'PL',
	'FR',
	'ES',
	'NO',
	'IT',
	'IS',
	'RO',
	'SE',
	'BG',
	'GR',
	'NL',
	'HR',
	'IE',
	'CH',
	'CZ',
	'AT',
	'HU',
	'FI',
	'DK',
	'BE',
	'LI',
	'PT',
	'MT',
	'LU',
	'CY',
	'LT',
	'SK',
	'SI',
	'EE',
	'LV',
]);

function parseCookies(headers) {
	const parsedCookie = {};
	if (headers.cookie) {
		headers.cookie[0].value.split(';').forEach(cookie => {
			if (cookie) {
				const parts = cookie.split('=');
				parsedCookie[parts[0].trim()] = parts[1].trim();
			}
		});
	}
	return parsedCookie;
}

function parseQueryString(string) {
	const parsedQueryString = {};
	if (string) {
		string.split('&').forEach(param => {
			if (param) {
				const parts = param.split('=');
				parsedQueryString[parts[0].trim()] = parts[1].trim();
			}
		});
	}
	return parsedQueryString;
}

function containsMacros(queryString) {
	return /(\{gdpr\}|\{gdpr_consent\})/.test(queryString);
}

function performMacroSubstitution(queryString, gdprApplies, consentString) {
	queryString = decodeURIComponent(queryString);
	queryString = queryString.replace(/\{gdpr\}/, gdprApplies);
	queryString = queryString.replace(/\{gdpr_consent\}/, consentString);
	return queryString;
}

function encodeQueryString(
	gdprApplies,
	consentString,
	addParms,
	redirectContainsMacros,
) {
	if ((addParms && addParms === '1') || !redirectContainsMacros) {
		return `?gdpr=${gdprApplies}&gdpr_consent=${consentString}`;
	}
}

exports.handler = (event, context, callback) => {
	const request = event.Records[0].cf.request;
	const headers = request.headers;
	const queryString = request.querystring;
	const parsedCookies = parseCookies(headers);
	const parsedQueryString = parseQueryString(queryString);

	let origin = '';
	if (headers['origin'] && headers['origin'].length > 0) {
		origin = headers['origin'][0]['value'];
	}

	let countryCode = '';
	if (
		headers['cloudfront-viewer-country'] &&
		headers['cloudfront-viewer-country'].length > 0
	) {
		countryCode = headers['cloudfront-viewer-country'][0].value.toUpperCase();
	}

	const gdprApplies =
		parsedQueryString.gdpr === '1' || GDPR_COUNTRIES.has(countryCode) ? 1 : 0;
	const consentString = parsedCookies[VENDOR_COOKIE_NAME];

	let response;
	if (!parsedQueryString.redirect) {
		response = {
			status: '200',
			statusDescription: 'OK',
			headers: {
				'access-control-allow-credentials': [
					{
						key: 'Access-Control-Allow-Credentials',
						value: 'true',
					},
				],
				'access-control-allow-methods': [
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET, OPTIONS',
					},
				],
				'access-control-allow-origin': [
					{
						key: 'Access-Control-Allow-Origin',
						value: origin,
					},
				],
				'content-type': [
					{
						key: 'Content-Type',
						value: 'application/json',
					},
				],
			},
			body: JSON.stringify({
				gdpr: gdprApplies,
				gdpr_consent: consentString,
			}),
		};
	} else {
		const redirectContainsMacros = containsMacros(parsedQueryString.redirect);
		response = {
			status: '302',
			statusDescription: 'Found',
			headers: {
				location: [
					{
						key: 'Location',
						value:
							performMacroSubstitution(
								parsedQueryString.redirect,
								gdprApplies,
								consentString,
							) +
							encodeQueryString(
								gdprApplies,
								consentString,
								parsedQueryString.add_parms,
								redirectContainsMacros,
							),
					},
				],
			},
		};
	}

	callback(null, response);
};
