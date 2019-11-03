import "core-js/fn/array/reduce";
import "core-js/fn/array/fill";
import "core-js/fn/array/map";
import "core-js/fn/array/for-each";
import "core-js/fn/array/filter";
import "core-js/fn/array/from";

import { init } from "./lib/init";
import { coreInit } from "./lib/core";
import { CMP_GLOBAL_NAME } from "./lib/cmp";
function start() {
	let start = new Date();
	const { config } = window[CMP_GLOBAL_NAME] || {};
	coreInit(config, start);
}

start();
