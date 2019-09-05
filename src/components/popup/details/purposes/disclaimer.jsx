import { h } from "preact";

import { Label } from "../../../label";
import { LocalizedLink } from "../../../link";
import { Text } from "../../../typography";
import { Divider } from "../../../divider";

import style from "./purposes.less";

export const Disclaimer = ({ onShowVendors }) => (
	<div>
		<div class={style.disclaimer}>
			<Label is={Text} localizeKey="purposes.disclaimer" />
			<LocalizedLink
				localizeKey="purposes.disclaimerVendorLink"
				onClick={onShowVendors}
			/>
		</div>
		<Divider />
	</div>
);
