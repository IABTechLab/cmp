import log from "./log";

export const notifyTimer = event => {
	try {
		window.cpexTimer.que.push([event, performance.now()]);
	} catch (e) {
		log.error("Timer error: ", e);
	}
};
