import { h } from "preact";
import cx from "classnames";
import PropTypes from "prop-types";

import { Label } from "../../../label";
import style from "./purposes.less";
import { PurposeDetail } from "./detail";

export const PurposeList = (
	{ allPurposes, purposes, onPurposeClick,
		onToggleLocalVendors, handleSelectPurpose,localization,
		features, showLocalVendors, purposesAreActive, 
		selectedPurposeIndices, selectedLocalVendors, showSelectedLocalVendors
	},
	{ theme }
) => (
	<div class={style.purposeList}>
		{allPurposes.map((purpose, i) => {
			const isActive = selectedPurposeIndices.hasOwnProperty(i);
			const itemStyles = isActive
				? {
					backgroundColor: theme.activeTabBackground || theme.colorBackground,
					color: theme.activeTabTextColor || theme.colorTextPrimary,
					borderColor: theme.colorBorder,
				}
				: {
					backgroundColor: theme.inactiveTabBackground || theme.colorPrimary,
					color: theme.inactiveTabTextColor || 'white',
					borderColor: theme.colorBorder,
					borderRightWidth: 1,
					borderRightStyle: 'solid',
				};

			return (
				<div
					class={cx({
						[style.purposeItem]: true,
						[style.selectedPurpose]: isActive
					})}
					style={{ ...itemStyles, fontFamily: theme.fontFamily }}
				>
					<div class={style.purposeHeader} onClick={onPurposeClick(i)}>
						<Label
							localizeKey={`purposes.${
								i >= purposes.length ? "customPurpose" : "purpose"
							}${purpose.id}.menu`}
							
						>
							{purpose.name}
						</Label>
						{ selectedPurposeIndices[i] >= 0 ?
							<span class={`${style.purposeChevron} ${style.up}`}/> :
							<span class={style.purposeChevron}/>
						}
					</div>
					<PurposeDetail
						onToggleLocalVendors={onToggleLocalVendors}
						handleSelectPurpose={handleSelectPurpose}
						localization={localization}
						features={features}
						showLocalVendors={showLocalVendors}
						purposesAreActive={purposesAreActive}
						currentPurposeIndex={i}
						currentPurpose={purpose}
						selectedPurposeIndices={selectedPurposeIndices}
						selectedLocalVendors={selectedLocalVendors}
						showSelectedLocalVendors={showSelectedLocalVendors}
						purposes={purposes}
					/>
				</div>
			);
		})}
	</div>
);

PurposeList.contextTypes = {
	theme: PropTypes.object.isRequired
};
