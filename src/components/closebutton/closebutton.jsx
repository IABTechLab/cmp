import { h } from "preact";
import cx from "classnames";

import style from "./closebutton.less";

export const CloseButton = ({
	onClick = () => {},
	width = 30,
	height = 30,
	hasBorder = true,
	...rest
}) => (
	<span
		class={cx({
			[style.closeButton]: true,
			[style.hasBorder]: hasBorder,
			[rest.class]: !!rest.class
		})}
		onClick={onClick}
	>
		<svg
			width={width}
			height={height}
			viewBox="0 0 16 16"
			preserveAspectRatio="xMidYMid meet"
		>
			<path d="M6.837 8l-2.45-2.464 1.17-1.17 2.45 2.464 2.465-2.465 1.17 1.17L9.162 8l2.48 2.464-1.167 1.17-2.467-2.48-2.48 2.48-1.17-1.17L6.838 8z" />
		</svg>
	</span>
);
