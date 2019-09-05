import { h } from "preact";
import { Switch } from "../../../switch";
import { Divider } from "../../../divider";
import { Label } from "../../../label";
import style from "./purposes.less";

export const Scope = ({ consentScope, onChange }) => {
	const labelKey = `consentScope${consentScope === "all" ? "All" : "Current"}`;
	return (
		<div>
			<div className={style.consentScope}>
				<Label prefix="purposes" localizeKey="consentScopeHint" />
				<Switch
					className={style.consentScopeSwitch}
					dataId="consentScope"
					labelKey={"purposes." + labelKey}
					displayLabel
					isSelected={consentScope === "all"}
					onClick={onChange}
				/>
				{/* <Label prefix="purposes" localizeKey={localizeKey} /> */}
			</div>
			<Divider />
		</div>
	);
};
