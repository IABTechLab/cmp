import { h } from 'preact';
import PropTypes from 'prop-types';

import Label from '../label/label';

export const Link = ({ onClick, blank, children, ...rest }, { theme }) => (
  <a
    onClick={onClick}
    target={blank ? '_blank' : ''}
    {...rest}
    style={{ color: theme.colorLinkColor, fontFamily: theme.fontFamily }}
  >
    {children}
  </a>
);

Link.contextTypes = {
  theme: PropTypes.object.isRequired,
};

export const LocalizedLink = ({ localizeKey, ...rest }) => (
  <Link {...rest}>
    <Label localizeKey={localizeKey} />
  </Link>
);
