import { h } from 'preact';
import cx from 'classnames';
import PropTypes from 'prop-types';

import style from './chevron.less';

export const Chevron = ({ direction, onClick }, { theme }) => (
  <span
    name="ctrl"
    style={{ color: theme.colorTextPrimary }}
    class={cx(style.icon, style[direction])}
    onClick={onClick}
  />
);

Chevron.contextTypes = {
  theme: PropTypes.object.isRequired,
};
