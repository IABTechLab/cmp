import { h } from 'preact';
import cx from 'classnames';

import style from './layout.less';

export const Row = ({ children, className }) => {
  return <div class={cx(style.row, className)}>{children}</div>;
};
