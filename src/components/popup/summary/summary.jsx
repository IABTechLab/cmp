import { h } from "preact";
import cx from "classnames";

import { Header } from "../header";
import { PopupContent } from "../popupcontent";
import { Purposes } from "./purposes";
import { Footer } from "./footer";
import style from "./summary.less";

export const Summary = ({
	onShowPurposes,
	onAcceptAll,
	onShowIntro,
	store,
	layout
}) => {
	let allPurposes = [];

	if (store.vendorList && store.vendorList.purposes) {
		allPurposes = allPurposes.concat(store.vendorList.purposes);
	}

	if (store.customPurposeList && store.customPurposeList.purposes) {
		allPurposes = allPurposes.concat(store.customPurposeList.purposes);
	}

	return (
		<PopupContent layout={layout}>
			<div class={cx(style.container, style[`container-${layout}`])}>
				<Header
					showChevron
					onChevronClick={onShowIntro}
					titleKey="footer.deviceInformationHeader"
				/>
				<Purposes allPurposes={allPurposes} />
				<Footer onShowPurposes={onShowPurposes} onAcceptAll={onAcceptAll} />
			</div>
		</PopupContent>
	);
};
