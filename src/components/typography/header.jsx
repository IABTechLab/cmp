import { h } from 'preact';
import PropTypes from 'prop-types';

export const Header = ({ children, ...rest }, { theme }) => (
  <h2
    {...rest}
    style={{ color: theme.colorTextPrimary, fontFamily: theme.fontFamily }}
  >
    {children}
  </h2>
);

Header.contextTypes = {
  theme: PropTypes.object.isRequired,
};
