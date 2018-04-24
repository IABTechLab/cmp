import 'core-js/fn/array/reduce';
import 'core-js/fn/array/fill';
import 'core-js/fn/array/map';
import 'core-js/fn/array/for-each';
import 'core-js/fn/array/filter';
import { init } from './lib/init';
import { CMP_GLOBAL_NAME } from "./lib/cmp";

const {config} = window[CMP_GLOBAL_NAME] || {};
const configUpdates = {
	globalConsentLocation: '//acdn.adnxs.com/cmp/docs/portal.html',
	...config
};
init(configUpdates).then(() => { window.__cmp('renderCmpIfNeeded'); });
