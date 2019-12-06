import { h } from 'preact';
import cx from 'classnames';

import style from './layout.less';

export const Col = ({ children, className, ...rest }) => (
  <div class={cx(style.column, className)} {...rest}>
    {children}
  </div>
);
