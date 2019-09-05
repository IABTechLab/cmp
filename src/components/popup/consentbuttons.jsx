import { h } from "preact";
import PropTypes from "prop-types";

import { Label } from "../label";
import { Button } from "../button";
import style from "./summary/summary.less";

export const ConsentButtons = (
	{ onShowPurposes, onAcceptAll, className, layout },
	{ theme }
) => (
	<div
		class={className}
		style={{
			borderColor: layout !== "footer" ? theme.colorBorder : "transparent"
		}}
	>
		<Button
			name="footerReject"
			class={style.rejectAll}
			invert={true}
			onClick={onShowPurposes}
		>
			<Label localizeKey="intro.showPurposes" />
		</Button>
		<Button name="footerAccept" class={style.acceptAll} onClick={onAcceptAll}>
			<Label localizeKey="intro.acceptAll" />
		</Button>
	</div>
);

ConsentButtons.contextTypes = {
	theme: PropTypes.object.isRequired
};
