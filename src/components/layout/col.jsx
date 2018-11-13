import { h } from 'preact';
import cx from 'classnames';

import style from './layout.less';

export const Col = ({ children, className }) => {
  return <div class={cx(style.column, className)}>{children}</div>;
};
