import { h } from "preact";
import PropTypes from "prop-types";

import style from "./ul.less";

const itemFormatter = val => val.toString();

export const Li = ({ children, ...rest }, { theme }) => (
	<li
		style={{ color: theme.colorTextPrimary, fontFamily: theme.fontFamily }}
		class={style.li}
		{...rest}
	>
		{children}
	</li>
);

Li.contextTypes = {
	theme: PropTypes.object.isRequired
};

export const Ul = ({ items = [], formatItem = itemFormatter }) => (
	<ul class={style.ul}>
		{items.map((item, i) => (
			<Li key={i}>{formatItem(item)}</Li>
		))}
	</ul>
);
