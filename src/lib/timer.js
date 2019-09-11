import log from "./log";

export const notifyTimer = event => {
	try {
		const cpexTimer = window.cpexTimer || {};
		cpexTimer.que = cpexTimer.que || [];
		cpexTimer.que.push([event, performance.now()]);
	} catch (e) {
		log.error("Timer error: ", e);
	}
};
