import { h } from "preact";
import PropTypes from "prop-types";

export const Header = ({ children, ...rest }, { theme }) => (
	<h3
		{...rest}
		style={{ color: theme.colorTextPrimary, fontFamily: theme.fontFamily }}
	>
		{children}
	</h3>
);

Header.contextTypes = {
	theme: PropTypes.object.isRequired
};
