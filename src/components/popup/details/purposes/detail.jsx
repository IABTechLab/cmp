import { h } from "preact";

import { Label } from "../../../label";
import { LocalizedLink } from "../../../link";
import { Paragraph, Title, Text } from "../../../typography";
import { Row } from "../../../layout";
import { Switch } from "../../../switch";
import { Ul } from "../../../ul";
import { Vendortable } from "../vendortable";
import style from "./purposes.less";

const formatFeature = item => item.description;

export const PurposeDetail = ({
	features,
	onToggleLocalVendors,
	handleSelectPurpose,
	currentPurpose,
	purposesAreActive,
	currentPurposeIndex,
	selectedPurposeIndices,
	selectedLocalVendors,
	showSelectedLocalVendors,
	purposes
}) => {
	const toggleVendorsKey = showSelectedLocalVendors[currentPurposeIndex] ? "hideVendors" : "showVendors";

	const currentPurposeLocalizePrefix = `${
		!selectedPurposeIndices.hasOwnProperty(currentPurposeIndex) ? '' : currentPurposeIndex >= purposes.length ? "customPurpose" : "purpose"
	}${selectedPurposeIndices[currentPurposeIndex] && selectedPurposeIndices[currentPurposeIndex].id}`;
	
	return (
		selectedPurposeIndices[currentPurposeIndex] >=0 && (
		<div class={style.purposeDescription}>
			<Label
				is={Title}
				alignment="left"
				providedValue={currentPurpose.name}
				localizeKey={`${currentPurposeLocalizePrefix}.title`}
			/>
			<Label
				is={Paragraph}
				providedValue={currentPurpose.description}
				localizeKey={`${currentPurposeLocalizePrefix}.description`}
			/>
			<Label is={Paragraph} localizeKey="purposes.featureHeader" />
			<Ul items={features} formatItem={formatFeature} />

			<Row>
				<Switch
					displayLabel
					currentPurposeIndex={currentPurposeIndex}
					isSelected={purposesAreActive[currentPurposeIndex]}
					onClick={handleSelectPurpose}
				/>
				<Label
					is={Text}
					class={style.switchText}
					localizeKey="purposes.switchText"
				/>
			</Row>

			<LocalizedLink
				id="purposeShowVendors"
				localizeKey={`purposes.${toggleVendorsKey}`}
				onClick={() => onToggleLocalVendors(currentPurposeIndex)}
			/>
			{showSelectedLocalVendors[currentPurposeIndex] && (
				<Vendortable vendors={selectedLocalVendors[currentPurposeIndex]} displayControls={false} />
			)}
		</div>)
	);
};
