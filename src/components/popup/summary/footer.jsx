import { h } from "preact";

import { ConsentButtons } from "../consentbuttons";
import style from "./summary.less";

export const Footer = ({ onAcceptAll, onShowPurposes }) => {
	return (
		<ConsentButtons
			className={style.footer}
			onAcceptAll={onAcceptAll}
			onShowPurposes={onShowPurposes}
		/>
	);
};
