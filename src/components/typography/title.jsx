import { h } from "preact";
import cx from "classnames";
import PropTypes from "prop-types";

import style from "./title.less";

export const Title = ({ children, alignment, ...rest }, { theme }) => (
	<div
		class={cx({ [style.title]: true, [style[alignment]]: !!alignment })}
		{...rest}
		style={{
			color: theme.titleTextColor || theme.colorTextPrimary,
			fontFamily: theme.fontFamily,
			fontSize: theme.titleFontSize || 24
		}}
	>
		{children}
	</div>
);

Title.contextTypes = {
	theme: PropTypes.object.isRequired
};
