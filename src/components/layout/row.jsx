import { h } from "preact";
import cx from "classnames";

import style from "./layout.less";

export const Row = ({ children, className, ...rest }) => (
	<div class={cx(style.row, className)} {...rest}>
		{children}
	</div>
);
