import { h } from "preact";
import PropTypes from "prop-types";

import style from "./divider.less";

export const Divider = ({}, { theme }) => (
	<div
		className={style.divider}
		style={{ height: 1, width: "100%", backgroundColor: theme.colorBorder }}
	/>
);

Divider.contextTypes = {
	theme: PropTypes.theme
};
