import { h } from 'preact';
import cx from 'classnames';
import PropTypes from 'prop-types';

import style from './title.less';

export const Text = ({ children, alignment, ...rest }, { theme }) => (
  <span
    class={cx({ [style.text]: true, [style[alignment]]: !!alignment })}
    {...rest}
    style={{ color: theme.colorTextPrimary, fontFamily: theme.fontFamily }}
  >
    {children}
  </span>
);

Text.contextTypes = {
  theme: PropTypes.object.isRequired,
};
