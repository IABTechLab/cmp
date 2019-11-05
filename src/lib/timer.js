import log from "./log";

export const notifyTimer = event => {
	try {
		console.log("Event:", event + " " + performance.now());
		window.cpexTimer.que.push([event, performance.now()]);
	} catch (e) {
		log.error("Timer error: ", e);
	}
};
