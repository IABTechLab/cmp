import { h } from 'preact';
import PropTypes from 'prop-types';

import style from './paragraph.less';

export const Paragraph = ({ children, ...rest }, { theme }) => (
  <p
    class={style.paragraph}
    {...rest}
    style={{ color: theme.colorTextPrimary }}
  >
    {children}
  </p>
);

Paragraph.contextTypes = {
  theme: PropTypes.object.isRequired,
};
